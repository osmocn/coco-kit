These instructions apply only inside `apps/api` and supplement the repo-root
`AGENTS.md`.

## API App Overview

- Hono.js HTTP server running on port **3060**.
- Entry point: `src/index.ts` — bootstraps the server and binds to the port.
- App wiring: `src/app.ts` — registers middleware, mounts routes, and handles
  404/500 responses.
- Environment: `src/lib/env.ts` — validates all required env vars at startup
  using Zod; app exits immediately if any are missing or invalid.

## Structure

```
src/
├── index.ts                          # Server bootstrap (port binding only)
├── app.ts                            # Hono app, middleware, route mounting
├── lib/
│   ├── env.ts                        # Env var validation — fail-fast on startup
│   └── require-auth-middleware.ts    # Guards routes that require a session
└── routes/
    ├── index.ts                      # Aggregates all route modules
    └── *.ts                          # Individual feature route handlers
```

## Conventions

- Keep `src/index.ts` minimal — server startup only, no middleware or routes.
- Keep `src/app.ts` for global middleware (CORS, logger, session injection) and
  top-level route mounting.
- Add new routes as separate files under `src/routes/` and register them in
  `src/routes/index.ts`.
- Use `requireAuth` from `src/lib/require-auth-middleware.ts` to guard
  authenticated routes — do not inline the session check.
- Import env values from `src/lib/env.ts`; never read `process.env` directly.
- Auth integration lives in `@coco-kit/auth`; do not duplicate auth logic here.
- Email sending lives in `@coco-kit/email`; call sender helpers from routes.
- Keep this app on the shared workspace tooling:
  - `tsconfig.json` should extend `../../tsconfig.base.json`
  - linting and formatting come from the repo-root `biome.json`
- Do not reintroduce `pnpm-lock.yaml`, `pnpm-workspace.yaml`, or `biome.json`
  inside `apps/api`.
