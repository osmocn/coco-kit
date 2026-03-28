# @coco-kit/api

This workspace app runs a small Hono server from `src/index.ts` using
`@hono/node-server`.

Run commands from the repository root:

```bash
pnpm dev:api
pnpm --filter @coco-kit/api lint
pnpm --filter @coco-kit/api typecheck
pnpm --filter @coco-kit/api build
pnpm --filter @coco-kit/api start
```

The development server listens on `http://localhost:3002`.

`build` emits the compiled server into `dist/`, and `start` runs the compiled
entrypoint with Node.js.
