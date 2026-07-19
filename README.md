# John Melek, Portfolio

Loud, neo-brutalist portfolio for a **Forward Deploy Engineer**. Every project linked here
is a real, runnable tool. No mocks, no API keys required to demo.

## Live site
https://johnmelek.github.io/portfolio

## What's inside
- `index.html`, the portfolio (custom cursor, scramble text, magnetic buttons, spotlight
  cards, continuous marquees, scroll progress, live-preview modal).
- `css/style.css`, the system (neo-brutalist tokens, no UI framework).
- `js/main.js`, all interactions, vanilla JS, no dependencies.
- `assets/img/john-melek.jpg`, hero photo.

## Projects (each is its own repo)
1. **EdgeSync**, on-site data reconciliation engine (Python / FastAPI)
2. **FieldConsole**, live fleet ops console (Node / Express / WebSocket)
3. **QuoteForge**, internal-tool generator, offline (Node / Express)
4. **ReconPlanner**, scoped recon and surface map, local-only (Python stdlib)
5. **Pulse**, client-site uptime monitor (Node / Express / SSE)
6. **AtlasDeploy**, wave deployment orchestrator with rollback (Python / FastAPI)

## Run the portfolio locally
```bash
python3 -m http.server 8080
# open http://localhost:8080
```

No build step. No dependencies. Pure HTML/CSS/JS.
