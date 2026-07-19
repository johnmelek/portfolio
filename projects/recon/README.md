# ReconPlanner

Scoped reconnaissance planner for forward-deployed engineers.

Before you assess a client's external surface, you need a plan and a declared
scope. ReconPlanner reads a scope file, enumerates subdomain candidates with
passive DNS lookups, runs a safe port scan against localhost, and renders the
result as an attack-surface graph plus a markdown report.

## Safety model

This tool is built for legitimate, declared-scope work:

- Active port scanning only ever targets `127.0.0.1` / localhost.
- DNS enumeration runs passive lookups only for domains you list in `scope.json`.
- It never brute-forces external IP ranges or scans hosts you do not control.

Point it at systems you have permission to test. That is the whole point.

## Run it

```bash
python3 app.py
# opens http://localhost:8000
```

No dependencies. Standard library only.

## What it does

- Reads `scope.json` (the domains you are cleared to look at).
- Generates subdomain candidates from a built-in wordlist and resolves them
  with the system DNS resolver (passive, no active scanning).
- Probes a curated set of common ports on localhost with short TCP timeouts.
- Renders the surface as an SVG graph (domains, hosts, open/closed ports).
- Emits a markdown report you can hand to the client.

## Files

- `app.py` ,  the planner and the small web UI.
- `scope.json` ,  the declared scope. Edit this before you run.
- `static/index.html` ,  the console.

## Stack

Python 3.11+, standard library (`socket`, `json`, `subprocess`, `http.server`).
