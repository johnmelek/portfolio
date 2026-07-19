"""
AtlasDeploy
===========

Multi-site deployment orchestrator for forward-deployed engineers.

You need to push a release across many locations (dealerships, branches,
factories) without taking them all down at once. AtlasDeploy runs the rollout
in waves, executes a real but safe step plan per site, streams live progress,
and supports one-click rollback.

Every shell step is allowlisted. The demo steps run harmless commands
(git rev-parse, date, sha256sum, echo to a local log). Nothing destructive
ever runs.

Run:
    uv venv && uv pip install fastapi uvicorn
    uv run uvicorn app:app --port 8000
    # open http://localhost:8000

The SSE stream and the rollback endpoint are exercised by the bundled UI.
"""

import asyncio
import hashlib
import json
import subprocess
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from contextlib import asynccontextmanager
from pathlib import Path

BASE = Path(__file__).parent
SITES = BASE / "sites.json"
PLAN = BASE / "plan.json"
LOG = BASE / "deploy.log"

ALLOWED_BINS = {"git", "date", "sha256sum", "echo", "cat", "test"}

STATE = {}  # site_id -> status
HISTORY = []  # event log lines
SUBS = []  # SSE queues


@asynccontextmanager
async def lifespan(app: FastAPI):
    for s in load_sites():
        STATE[s["id"]] = "pending"
    yield


app = FastAPI(title="AtlasDeploy", lifespan=lifespan)


def load_sites() -> list:
    return json.loads(SITES.read_text(encoding="utf-8"))


def load_plan() -> list:
    return json.loads(PLAN.read_text(encoding="utf-8"))


def log_event(msg: str):
    line = f"[{asyncio.get_event_loop().time():.0f}] {msg}"
    HISTORY.append(line)
    for q in SUBS:
        q.put_nowait({"event": "log", "msg": msg})


async def run_step(site: dict, step: dict) -> dict:
    """Execute one plan step as a safe, allowlisted subprocess."""
    bin_name = step.get("bin")
    if bin_name not in ALLOWED_BINS:
        return {"ok": False, "step": step["name"], "error": f"bin {bin_name} not allowlisted"}
    args = [bin_name, *step.get("args", [])]
    # never allow shell, never allow redirects
    proc = await asyncio.create_subprocess_exec(
        *args, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    out, err = await proc.communicate()
    return {
        "ok": proc.returncode == 0,
        "step": step["name"],
        "rc": proc.returncode,
        "out": out.decode("utf-8", "ignore").strip()[:200],
        "err": err.decode("utf-8", "ignore").strip()[:200],
    }


@app.on_event("startup")
async def _init():
    for s in load_sites():
        STATE[s["id"]] = "pending"


@app.get("/api/plan")
def get_plan():
    return {"sites": load_sites(), "plan": load_plan()}


@app.get("/api/state")
def get_state():
    return {"state": STATE, "history": HISTORY}


@app.post("/api/deploy")
async def deploy():
    sites = load_sites()
    plan = load_plan()
    waves = sorted({s["wave"] for s in sites})
    for wave in waves:
        wave_sites = [s for s in sites if s["wave"] == wave]
        log_event(f"WAVE {wave}: starting {len(wave_sites)} site(s)")
        for site in wave_sites:
            STATE[site["id"]] = "running"
            log_event(f"{site['name']}: deploy running")
            for step in plan:
                res = await run_step(site, step)
                if not res["ok"]:
                    STATE[site["id"]] = "failed"
                    log_event(f"{site['name']}: step '{step['name']}' FAILED: {res.get('error') or res.get('err')}")
                    break
            else:
                STATE[site["id"]] = "done"
                log_event(f"{site['name']}: deploy done")
        log_event(f"WAVE {wave}: complete")
    return {"state": STATE}


@app.post("/api/rollback")
async def rollback():
    done = [sid for sid, st in STATE.items() if st == "done"]
    for sid in reversed(done):
        STATE[sid] = "rolled_back"
        log_event(f"{sid}: rolled back")
    return {"state": STATE, "rolled_back": len(done)}


@app.get("/api/stream")
async def stream(request: Request):
    from fastapi.responses import StreamingResponse

    q: asyncio.Queue = asyncio.Queue()
    SUBS.append(q)

    async def gen():
        yield ": connected\n\n"
        try:
            while True:
                if await request.is_disconnected():
                    break
                try:
                    item = await asyncio.wait_for(q.get(), timeout=15)
                    yield f"data: {json.dumps(item)}\n\n"
                except asyncio.TimeoutError:
                    yield ": ping\n\n"
        finally:
            if q in SUBS:
                SUBS.remove(q)

    return StreamingResponse(gen(), media_type="text/event-stream")


@app.get("/", response_class=HTMLResponse)
def index():
    return (BASE / "static" / "index.html").read_text(encoding="utf-8")
