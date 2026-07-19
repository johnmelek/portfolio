# Pulse

Client-site uptime and health monitor for forward-deployed engineers.

You leave it running at the customer's office. It polls a list of endpoints,
tracks HTTP status, response time, and TLS certificate expiry, streams live
status over SSE, and draws response-time sparklines on a canvas. History is
appended to a JSONL file, so there is no database to babysit.

## Why it exists

After you deploy something at a client site, someone needs to know when it
stops answering. Pulse is a small monitor you can leave behind: open the page,
see green or red, spot a cert about to expire before it does.

## Run it

```bash
npm install
npm start
# open http://localhost:3000
```

The bundled `endpoints.json` seeds three targets: a localhost endpoint (shows
up immediately), a public HTTPS site (real cert parsing), and a deliberately
dead port (shows the down state). Edit the array in `server.js` for real use.

## What it does

- Polls each endpoint every 5 seconds.
- Records HTTP status, response time in milliseconds, and TLS cert expiry
  days (for HTTPS, via the socket peer certificate).
- Streams a live snapshot to the browser over Server-Sent Events.
- Draws a response-time sparkline per endpoint on a canvas.
- Appends every sample to `history.jsonl`.

## Files

- `server.js` ,  poller, SSE stream, history writer.
- `public/index.html` ,  the dashboard.

## Stack

Node.js, Express, standard `http`/`https`. Canvas for sparklines. No database.
