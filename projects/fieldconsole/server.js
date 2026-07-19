// FieldConsole
// Live fleet ops console for forward-deployed engineers.
//
// A small Express server keeps an in-memory fleet of customer sites. Each site
// has a status that changes as you deploy it. A WebSocket pushes status changes
// and log lines to every connected browser in real time.
//
// Run:
//   npm install
//   npm start
//   open http://localhost:3000

const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const SITES_FILE = path.join(__dirname, "sites.json");
let sites = JSON.parse(fs.readFileSync(SITES_FILE, "utf-8"));

function seedLogs() {
  for (const s of sites) {
    s.logs = s.logs || [];
    if (s.logs.length === 0) {
      s.logs.push(`[boot] ${s.name} registered, status ${s.status}`);
    }
  }
}
seedLogs();

function broadcast(obj) {
  const msg = JSON.stringify(obj);
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(msg);
  }
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/api/sites", (req, res) => {
  res.json(sites.map(({ logs, ...s }) => s));
});

app.get("/api/sites/:id/logs", (req, res) => {
  const s = sites.find((x) => x.id === req.params.id);
  res.json({ logs: s ? s.logs : [] });
});

// Simulate a deploy: status -> deploying, then after a beat -> healthy.
app.post("/api/sites/:id/deploy", (req, res) => {
  const s = sites.find((x) => x.id === req.params.id);
  if (!s) return res.status(404).json({ error: "not found" });
  if (s.status === "deploying") return res.status(409).json({ error: "already deploying" });
  s.status = "deploying";
  s.logs.push(`[deploy] starting rollout to ${s.name}`);
  broadcast({ type: "status", id: s.id, status: s.status });
  broadcast({ type: "log", id: s.id, line: s.logs[s.logs.length - 1] });

  setTimeout(() => {
    s.status = "healthy";
    s.lastDeploy = new Date().toISOString();
    s.currentVersion = s.targetVersion;
    s.logs.push(`[deploy] ${s.name} healthy on ${s.currentVersion}`);
    broadcast({ type: "status", id: s.id, status: s.status });
    broadcast({ type: "log", id: s.id, line: s.logs[s.logs.length - 1] });
  }, 1500);

  res.json({ id: s.id, status: s.status });
});

// WebSocket upgrade -> confirm it works
wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "hello", sites: sites.length }));
  // heartbeat
  const hb = setInterval(() => {
    if (ws.readyState === 1) ws.send(JSON.stringify({ type: "heartbeat", t: Date.now() }));
  }, 5000);
  ws.on("close", () => clearInterval(hb));
});

server.listen(PORT, () => {
  console.log(`FieldConsole on http://localhost:${PORT}`);
});
