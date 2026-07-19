"""
EdgeSync
========

On-site data reconciliation engine for forward-deployed engineers.

You walk into a customer site. Their customer data lives in three places that
do not agree: a CSV export, a REST JSON endpoint, and a legacy fixed-width
text dump. EdgeSync pulls all three, matches records on a shared key, and tells
you exactly where they disagree. It writes a clean unified dataset and lets you
download it.

Run:
    uv venv && uv pip install fastapi uvicorn
    uv run uvicorn app:app --port 8000
    # open http://localhost:8000

No external services, no API keys. The "REST" source is served from this same
process so the demo runs offline.
"""

import csv
import io
import json
import re
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

BASE = Path(__file__).parent
DATA = BASE / "data"
FIELDS = ["id", "name", "email", "phone", "city"]

app = FastAPI(title="EdgeSync")


# --------------------------------------------------------------------------
# Source loaders
# --------------------------------------------------------------------------
def load_csv(path: Path) -> dict:
    """CSV of customers. Returns {id: {field: value}}."""
    out = {}
    with path.open(newline="", encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            rec = {k: (row.get(k) or "").strip() for k in FIELDS}
            if rec["id"]:
                out[rec["id"]] = rec
    return out


def load_json(path: Path) -> dict:
    """REST-style JSON: a list of records under a 'records' or top-level key."""
    payload = json.loads(path.read_text(encoding="utf-8"))
    rows = payload.get("records", payload) if isinstance(payload, dict) else payload
    out = {}
    for row in rows:
        rec = {k: str(row.get(k, "")).strip() for k in FIELDS}
        if rec["id"]:
            out[rec["id"]] = rec
    return out


def load_legacy(path: Path) -> dict:
    """Legacy fixed-width export. Columns are positional, defined below.
    Each record is one line; fields are sliced by fixed offsets.
    """
    # (field, start, width)  -- 1-indexed start, matches the generator
    layout = [
        ("id", 0, 6),
        ("name", 6, 20),
        ("email", 26, 28),
        ("phone", 54, 14),
        ("city", 68, 16),
    ]
    out = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        raw = raw.rstrip("\n")
        if not raw.strip():
            continue
        rec = {}
        for field, start, width in layout:
            rec[field] = raw[start : start + width].strip()
        if rec["id"]:
            out[rec["id"]] = rec
    return out


# --------------------------------------------------------------------------
# Reconciliation
# --------------------------------------------------------------------------
def reconcile(sources: list[tuple[str, dict]]) -> dict:
    """Merge N keyed dicts. Produce unified records and a conflict list.

    A conflict is a field value that differs across two or more sources for the
    same key. The unified record keeps the first non-empty value found, in
    source priority order.
    """
    keys: set[str] = set()
    for _name, src in sources:
        keys.update(src.keys())

    unified = {}
    conflicts = []
    for key in sorted(keys):
        merged = {f: "" for f in FIELDS}
        for f in FIELDS:
            for _name, src in sources:
                val = src.get(key, {}).get(f, "")
                if val:
                    merged[f] = val
                    break
        unified[key] = merged

        for f in FIELDS:
            vals = {}
            for name, src in sources:
                v = src.get(key, {}).get(f, "")
                if v:
                    vals[name] = v
            distinct = set(vals.values())
            if len(distinct) > 1:
                conflicts.append(
                    {"id": key, "field": f, "values": vals}
                )
    return {"unified": unified, "conflicts": conflicts, "keys": sorted(keys)}


# --------------------------------------------------------------------------
# In-process "REST" endpoint (so the demo works with zero external deps)
# --------------------------------------------------------------------------
@app.get("/api/remote-records")
def remote_records():
    """Stands in for a customer's remote REST API. Some values diverge on
    purpose so the reconciliation has something to find."""
    payload = json.loads((DATA / "remote.json").read_text(encoding="utf-8"))
    return payload


def build_state():
    csv_src = load_csv(DATA / "customers.csv")
    json_src = load_json(DATA / "remote.json")
    legacy_src = load_legacy(DATA / "legacy.txt")

    sources = [("csv", csv_src), ("rest", json_src), ("legacy", legacy_src)]
    result = reconcile(sources)
    return {
        "counts": {
            "csv": len(csv_src),
            "rest": len(json_src),
            "legacy": len(legacy_src),
        },
        "matched": len(result["keys"]),
        "conflicts": len(result["conflicts"]),
        "unified": result["unified"],
        "conflict_list": result["conflict_list"] if "conflict_list" in result else result["conflicts"],
    }


STATE = build_state()


# --------------------------------------------------------------------------
# API
# --------------------------------------------------------------------------
@app.get("/api/stats")
def stats():
    return {
        "counts": STATE["counts"],
        "matched": STATE["matched"],
        "conflicts": STATE["conflicts"],
    }


@app.get("/api/conflicts")
def conflicts():
    return {"conflicts": STATE["conflict_list"]}


@app.get("/api/records")
def records():
    return {"records": STATE["unified"]}


@app.get("/api/unified.csv")
def unified_csv():
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=FIELDS)
    w.writeheader()
    for key in STATE["keys"] if "keys" in STATE else sorted(STATE["unified"]):
        w.writerow(STATE["unified"][key])
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=unified.csv"},
    )


@app.get("/", response_class=HTMLResponse)
def index():
    return (BASE / "static" / "index.html").read_text(encoding="utf-8")


# serve the UI
app.mount("/static", StaticFiles(directory=BASE / "static"), name="static")
