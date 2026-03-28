# `@coco-kit/docs`

This app is the docs-focused Next.js frontend inside the `coco-kit` Turborepo.

## Run It

From the repository root:

```bash
pnpm install
pnpm dev
```

To run just this app:

```bash
pnpm dev:docs
```

The app starts on `http://localhost:3000` unless another Next app is already
using that port.

## Workspace Notes

- Shared formatting and linting come from the repo-root `biome.json`.
- Shared TypeScript defaults come from `../../tsconfig.base.json`.
- Turbo tasks are configured in the repo-root `turbo.json`.
- Do not add app-local lockfiles, workspace manifests, or Biome configs here.

## Useful Commands

From the repository root:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## References

- [Next.js docs](https://nextjs.org/docs)
- [Turborepo docs](https://turbo.build/repo/docs)
- [Biome docs](https://biomejs.dev/guides/getting-started/)
