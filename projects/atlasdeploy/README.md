# AtlasDeploy

Multi-site deployment orchestrator for forward-deployed engineers.

You need to push a release across many locations (dealerships, branches,
factories) without taking them all down at once. AtlasDeploy runs the rollout
in waves, executes a real but safe step plan per site, streams live progress,
and supports one-click rollback.

## Why it exists

A rollout to 70 sites is either a calm wave sequence or a 3am outage. AtlasDeploy
makes the wave sequence the default: validate one wave, watch it go green, move
to the next. If something breaks, roll back everything that completed.

## Run it

```bash
uv venv
uv pip install fastapi uvicorn
uv run uvicorn app:app --port 8000
# open http://localhost:8000
```

## What it does

- Reads `sites.json` (locations, grouped into deploy waves) and `plan.json`
  (the ordered steps each site runs).
- Executes each step as a real subprocess, but only from an allowlist of
  harmless binaries (`git`, `date`, `sha256sum`, `echo`). Nothing destructive
  can run, by construction.
- Streams progress over Server-Sent Events so the UI updates live.
- Supports one-click rollback of every completed site, in reverse order.

## Safety

The step runner rejects any binary not on the allowlist. There is no shell,
no redirects, no path to run an arbitrary command. The demo plan proves the
site is healthy (git rev-parse, a timestamp, an artifact hash) and marks it
done. Swap in your own safe steps for a real rollout.

## Files

- `app.py` ,  orchestrator, SSE stream, allowlisted step runner.
- `sites.json` ,  the locations and their waves.
- `plan.json` ,  the step plan.
- `static/index.html` ,  the console.

## Stack

Python 3.11+, FastAPI, Uvicorn. Standard library `asyncio`/`subprocess` for
the steps.
