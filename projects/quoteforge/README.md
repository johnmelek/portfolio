# QuoteForge

Generate a working internal tool from a plain description, offline.

You are at a client site. Someone says "I need a form to track test-drives."
QuoteForge turns that sentence into a real, working single-file web app: a
form, a filterable table, and localStorage persistence. No backend, no build,
no API key. Download it and hand it over.

## Why it exists

The fastest way to unblock a team is a tool they can actually use today. A
single HTML file they double-click beats a two-week backlog item. QuoteForge
is the "build the prototype in the room" weapon.

## Run it

```bash
npm install
npm start
# open http://localhost:3000
```

## How it works

The generator is deterministic and offline:

1. It reads your description.
2. It pulls an entity name (the first noun) and field names (from "with ..."
   or "by ..." phrases, or falls back to content words).
3. It renders a complete CRUD app from a template: a form to add records, a
   table with edit/delete, a search box, and localStorage so data survives a
   refresh.

If `OPENROUTER_API_KEY` is set in the environment, field extraction can be
handed to a model for smarter parsing. The template path still works with no
key, which is the default demo.

## Files

- `server.js` ,  Express server and the template engine.
- `public/index.html` ,  the builder UI (textarea, live preview, download).

## Stack

Node.js, Express. Client apps are vanilla HTML/CSS/JS.
