# EdgeSync

On-site data reconciliation engine for forward-deployed engineers.

Walk into a customer site. Their customer data lives in three places that do
not agree: a CSV export, a REST JSON endpoint, and a legacy fixed-width text
dump. EdgeSync pulls all three, matches records on a shared key (the customer
ID), and shows you exactly where they disagree. It writes a clean unified
dataset and lets you download it as CSV.

## Why it exists

Forward deployment means dealing with whatever the client already has. Half the
job is reconciling mismatched exports before any new tool can use them. EdgeSync
turns that into a five minute check instead of a afternoon of spreadsheet diffing.

## Run it

```bash
uv venv
uv pip install fastapi uvicorn
uv run uvicorn app:app --port 8000
```

Then open http://localhost:8000.

The "REST" source is served from the same process (see `/api/remote-records`)
so the whole thing runs offline. No API keys, no external services.

## What it does

- Ingests three source shapes: CSV, JSON (REST-style), and legacy fixed-width.
- Matches records by key and merges them, keeping the first non-empty value.
- Detects field-level conflicts (same key, different value across sources).
- Exposes a small console: per-source counts, matched count, conflict count,
  a conflicts table, and a downloadable unified CSV.

## Sample conflict output

With the bundled demo data, the engine finds conflicts like:

```
C002  email   csv:    bruno.lopez@example.com
                rest:   b.lopez@example.com
                legacy: b.lopez@example.com
C003  phone   csv:    0612340003
                rest:   0799887766
                legacy: 0799887766
```

The unified record keeps one value per field; the conflicts report is what you
take back to the client to fix at the source.

## Stack

Python 3.11+, FastAPI, Uvicorn. Standard library only for parsing
(`csv`, `json`, `re`). No database.
