// Pulse
// Client-site uptime and health monitor for forward-deployed engineers.
//
// Leave it running at the customer's office. It polls a list of endpoints,
// tracks HTTP status, response time, and TLS cert expiry, streams live status
// over SSE, and draws response-time sparklines on a canvas. History is appended
// to a JSONL file, so there is no database to babysit.
//
// Run:
//   npm install
//   npm start
//   open http://localhost:3000

const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = 3002;
const app = express();
app.use(express.static(path.join(__dirname, "public")));

const ENDPOINTS = [
  { name: "local-api", url: "http://127.0.0.1:8080", region: "on-prem" },
  { name: "example", url: "https://example.com", region: "public" },
  { name: "down-test", url: "http://127.0.0.1:9", region: "probe" },
];

const HISTORY_FILE = path.join(__dirname, "history.jsonl");
if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, "");

const history = {}; // name -> [{t, ms, up}]
for (const e of ENDPOINTS) history[e.name] = [];

function probe(ep) {
  return new Promise((resolve) => {
    const isHttps = ep.url.startsWith("https");
    const lib = isHttps ? https : http;
    const start = Date.now();
    const req = lib.get(ep.url, { timeout: 4000 }, (res) => {
      let certDays = null;
      if (isHttps && res.socket && res.socket.getPeerCertificate) {
        const cert = res.socket.getPeerCertificate();
        if (cert && cert.valid_to) {
          const exp = new Date(cert.valid_to).getTime();
          certDays = Math.max(0, Math.round((exp - Date.now()) / 86400000));
        }
      }
      res.resume();
      const ms = Date.now() - start;
      resolve({ up: true, status: res.statusCode, ms, certDays });
    });
    req.on("error", () => resolve({ up: false, status: 0, ms: Date.now() - start, certDays: null }));
    req.on("timeout", () => { req.destroy(); resolve({ up: false, status: 0, ms: Date.now() - start, certDays: null }); });
  });
}

async function tick() {
  const snap = [];
  for (const ep of ENDPOINTS) {
    const r = await probe(ep);
    const entry = { t: Date.now(), ms: r.ms, up: r.up };
    history[ep.name].push(entry);
    if (history[ep.name].length > 60) history[ep.name].shift();
    fs.appendFileSync(HISTORY_FILE, JSON.stringify({ name: ep.name, ...entry, status: r.status, certDays: r.certDays }) + "\n");
    snap.push({ name: ep.name, region: ep.region, url: ep.url, ...r });
  }
  broadcast({ type: "status", snapshot: snap });
}

// SSE
const SSE = [];
app.get("/api/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("retry: 3000\n\n");
  SSE.push(res);
  req.on("close", () => {
    const i = SSE.indexOf(res);
    if (i >= 0) SSE.splice(i, 1);
  });
});
function broadcast(obj) {
  const data = `data: ${JSON.stringify(obj)}\n\n`;
  for (const res of SSE) res.write(data);
}

app.get("/api/status", (req, res) => {
  const out = ENDPOINTS.map((ep) => {
    const h = history[ep.name];
    const last = h[h.length - 1] || {};
    return { name: ep.name, region: ep.region, url: ep.url, up: !!last.up, ms: last.ms ?? null, samples: h.length };
  });
  res.json(out);
});

app.get("/api/history/:name", (req, res) => {
  res.json(history[req.params.name] || []);
});

setInterval(tick, 5000);
tick();

app.listen(PORT, () => console.log(`Pulse on http://localhost:${PORT}`));
