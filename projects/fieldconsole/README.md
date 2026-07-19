# FieldConsole

Live fleet ops console for forward-deployed engineers.

A WebSocket-driven console for managing remote site deployments. Each site in
your fleet has a live status. Hit Deploy and watch it flip from deploying to
healthy in real time, with a streaming log tail. The thing you leave open on
the second monitor during a rollout.

## Why it exists

When you are pushing a release across a dozen locations, you need one screen
that shows every site's state and lets you act on any of them without a page
refresh. FieldConsole is that screen.

## Run it

```bash
npm install
npm start
# open http://localhost:3000
```

## What it does

- Keeps an in-memory fleet of sites (see `sites.json`), each with a status,
  version, region, and uptime.
- A Deploy button simulates a rollout: status goes deploying, then after a
  beat flips to healthy and the version is bumped.
- A WebSocket pushes every status change and log line to all connected
  browsers instantly. No polling needed for the live bits.
- A log-tail panel streams events as they happen.

## Files

- `server.js` ,  Express API + WebSocket server.
- `sites.json` ,  the seeded fleet.
- `public/index.html` ,  the console.

## Stack

Node.js, Express, `ws`. No database, no build step.
