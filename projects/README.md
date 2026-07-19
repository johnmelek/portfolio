# Projects

Six tools I built end to end. Every one runs with zero API keys. Each folder
is its own small app with its own README and run instructions.

| Project | What it does | Stack | Live port |
| --- | --- | --- | --- |
| [edgesync](edgesync/) | Reconciles customer data from CSV, REST JSON, and legacy exports, matches by key, surfaces conflicts. | Python / FastAPI | 8000 |
| [fieldconsole](fieldconsole/) | Live fleet ops console. Deploy a site, watch status flip over WebSocket, tail logs. | Node / Express / WS | 3000 |
| [quoteforge](quoteforge/) | Describe an internal tool, get a working single-file CRUD app generated offline. | Node / Express | 3001 |
| [recon](recon/) | Scoped recon: passive DNS for declared domains, safe localhost port scan, attack-surface graph. | Python / stdlib | 8001 |
| [pulse](pulse/) | Client-site uptime monitor. Response time, TLS cert expiry, SSE live status, sparklines. | Node / Express / SSE | 3002 |
| [atlasdeploy](atlasdeploy/) | Wave deployment orchestrator with real allowlisted steps and one-click rollback. | Python / FastAPI | 8002 |

To run a project, open its folder and follow its README. The portfolio's
"Live" buttons assume the matching server is running on the port above.
