"""
ReconPlanner
============

Scoped reconnaissance planner for forward-deployed engineers.

Before you assess a client's external surface, you need a plan and a declared
scope. ReconPlanner reads a scope file, enumerates subdomain candidates with
passive DNS lookups, runs a safe port scan against localhost, and renders the
result as an attack-surface graph plus a markdown report.

Safety rules (read them):
  * Active scanning only ever targets 127.0.0.1 / localhost.
  * DNS enumeration only runs for domains the user explicitly declares.
  * Nothing here brute-forces external IPs or scans third-party hosts.

Run:
    python3 app.py
    # opens http://localhost:8001

Pure standard library. No external packages.
"""

import json
import socket
import subprocess
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE = Path(__file__).parent
SCOPE = BASE / "scope.json"

WORDLIST = [
    "www", "mail", "api", "admin", "dev", "staging", "portal", "crm",
    "vpn", "remote", "app", "docs", "intranet", "shop", "login", "test",
]

# Ports we are allowed to probe on localhost. Curated, common, safe to check.
LOCAL_PORTS = [21, 22, 25, 53, 80, 443, 3306, 5432, 6379, 8080, 8443]


def load_scope() -> dict:
    return json.loads(SCOPE.read_text(encoding="utf-8"))


def dns_lookup(host: str):
    """Return resolved IP or None. Passive: just asks the system resolver."""
    try:
        return socket.gethostbyname(host)
    except (socket.gaierror, socket.timeout, OSError):
        return None


def scan_local_port(port: int, timeout: float = 0.35) -> bool:
    """TCP connect probe against 127.0.0.1. Safe, local only."""
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(timeout)
    try:
        return s.connect_ex(("127.0.0.1", port)) == 0
    except OSError:
        return False
    finally:
        s.close()


def cert_days(host: str, port: int) -> int | None:
    """Best-effort TLS cert expiry in days, via openssl if present."""
    try:
        out = subprocess.run(
            ["openssl", "s_client", "-connect", f"{host}:{port}", "-servername", host],
            input=b"", capture_output=True, timeout=4,
        )
        txt = out.stdout.decode("utf-8", "ignore")
        # crude: hand off to a small python parse using datetime
        import datetime
        import re
        m = re.search(r"notAfter=(.+)", txt)
        if not m:
            return None
        exp = datetime.datetime.strptime(m.group(1).strip(), "%b %d %H:%M:%S %Y %Z")
        return (exp - datetime.datetime.utcnow()).days
    except Exception:
        return None


def build_surface() -> dict:
    scope = load_scope()
    domains = scope.get("domains", [])
    nodes = []
    edges = []

    for domain in domains:
        base = {"id": f"dom:{domain}", "label": domain, "type": "domain"}
        nodes.append(base)
        for sub in WORDLIST:
            host = f"{sub}.{domain}"
            ip = dns_lookup(host)
            if ip:
                hid = f"host:{host}"
                nodes.append({"id": hid, "label": host, "type": "host", "ip": ip})
                edges.append({"from": base["id"], "to": hid, "kind": "dns"})

    # localhost probe
    local_node = {"id": "local:127.0.0.1", "label": "127.0.0.1", "type": "localhost"}
    nodes.append(local_node)
    for port in LOCAL_PORTS:
        open_p = scan_local_port(port)
        pid = f"port:{port}"
        nodes.append({
            "id": pid, "label": f":{port}", "type": "port",
            "state": "open" if open_p else "closed",
        })
        edges.append({
            "from": local_node["id"], "to": pid,
            "kind": "open" if open_p else "closed",
        })

    return {"domains": domains, "nodes": nodes, "edges": edges}


def render_report(surface: dict) -> str:
    lines = ["# ReconPlanner report", ""]
    lines.append(f"Domains in scope: {', '.join(surface['domains']) or 'none'}")
    lines.append("")
    lines.append("## Resolved hosts (passive DNS)")
    hosts = [n for n in surface["nodes"] if n["type"] == "host"]
    if hosts:
        for h in hosts:
            lines.append(f"- {h['label']} -> {h['ip']}")
    else:
        lines.append("- No subdomain candidates resolved.")
    lines.append("")
    lines.append("## Localhost port scan (127.0.0.1)")
    ports = [n for n in surface["nodes"] if n["type"] == "port"]
    open_ports = [p for p in ports if p["state"] == "open"]
    lines.append(f"- Open: {', '.join(p['label'] for p in open_ports) or 'none'}")
    lines.append(f"- Closed: {len(ports) - len(open_ports)} probed")
    lines.append("")
    lines.append("## Notes")
    lines.append("- DNS enumeration is passive and runs only for declared domains.")
    lines.append("- Port scanning is restricted to 127.0.0.1 by design.")
    return "\n".join(lines)


def svg_graph(surface: dict) -> str:
    """Tiny deterministic force-ish layout: circle the domain, ring the hosts,
    stack localhost ports. Returns an SVG string."""
    W, H = 900, 520
    nodes = surface["nodes"]
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="monospace" font-size="11">']
    parts.append(f'<rect width="{W}" height="{H}" fill="#0d0d0f"/>')

    # edges
    pos = {}
    dom_nodes = [n for n in nodes if n["type"] == "domain"]
    host_nodes = [n for n in nodes if n["type"] == "host"]
    local_nodes = [n for n in nodes if n["type"] == "localhost"]
    port_nodes = [n for n in nodes if n["type"] == "port"]

    import math
    cx, cy = W / 2, H / 2
    # domains in a row near top
    for i, d in enumerate(dom_nodes):
        x = 120 + i * 220
        pos[d["id"]] = (x, 70)
    # hosts ring around center
    for i, h in enumerate(host_nodes):
        a = (i / max(1, len(host_nodes))) * 2 * math.pi
        pos[h["id"]] = (cx + 200 * math.cos(a), cy + 120 * math.sin(a))
    # localhost + ports on the right
    if local_nodes:
        pos[local_nodes[0]["id"]] = (W - 120, 90)
    for i, p in enumerate(port_nodes):
        pos[p["id"]] = (W - 120, 130 + i * 26)

    color = {"domain": "#c6ff00", "host": "#22e0ff", "localhost": "#ff2e63", "port": "#9a9a92"}
    for e in surface["edges"]:
        a, b = pos.get(e["from"]), pos.get(e["to"])
        if not a or not b:
            continue
        stroke = "#c6ff00" if e["kind"] == "open" else "#33333a"
        parts.append(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="{stroke}" stroke-width="1"/>')
    for n in nodes:
        x, y = pos.get(n["id"], (cx, cy))
        c = color.get(n["type"], "#fff")
        if n["type"] == "port":
            label = f'{n["label"]} {n["state"]}'
            parts.append(f'<circle cx="{x}" cy="{y}" r="4" fill="{c if n["state"]=="open" else "#33333a"}"/>')
            parts.append(f'<text x="{x+8}" y="{y+3}" fill="#9a9a92">{label}</text>')
        else:
            parts.append(f'<circle cx="{x}" cy="{y}" r="6" fill="{c}"/>')
            parts.append(f'<text x="{x+9}" y="{y+3}" fill="#f3f2ec">{n["label"]}</text>')
    parts.append("</svg>")
    return "\n".join(parts)


class Handler(BaseHTTPRequestHandler):
    def _send(self, body, ctype="application/json"):
        data = body.encode("utf-8") if isinstance(body, str) else body
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            self._send((BASE / "static" / "index.html").read_text(encoding="utf-8"), "text/html")
        elif self.path == "/api/surface":
            self._send(json.dumps(build_surface()))
        elif self.path == "/api/graph":
            self._send(svg_graph(build_surface()), "image/svg+xml")
        elif self.path == "/api/report":
            self._send(render_report(build_surface()), "text/plain")
        else:
            self.send_response(404); self.end_headers()

    def log_message(self, *a):
        return


def main():
    srv = ThreadingHTTPServer(("127.0.0.1", 8001), Handler)
    print("ReconPlanner on http://localhost:8001")
    srv.serve_forever()


if __name__ == "__main__":
    main()
