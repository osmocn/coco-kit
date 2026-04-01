import Navbar from "@/components/navbar";
import { getAuthSession } from "@/lib/auth-session";
import { headers } from "next/headers";

const workspaceHighlights = [
  {
    title: "Shared tooling, one source of truth",
    description:
      "Biome now lives at the repo root, so every app or package inherits the same formatting and lint rules by default.",
  },
  {
    title: "Reusable TypeScript defaults",
    description:
      "A shared base tsconfig keeps strict options in one place while each app adds only the pieces it actually needs.",
  },
  {
    title: "Ready for more than one app",
    description:
      "Turbo tasks are wired for build, dev, lint, and typecheck so the workspace can grow without redoing the setup.",
  },
] as const;

const commands = [
  "pnpm install",
  "pnpm dev",
  "pnpm lint",
  "pnpm typecheck",
] as const;

const workspaceMap = [
  {
    label: "apps/web",
    detail:
      "Next.js app with Tailwind v4, typed routes, and the shared workspace configs.",
  },
  {
    label: "packages",
    detail:
      "Reserved for shared UI, utils, configs, or API clients when you start splitting code out.",
  },
  {
    label: "biome.json",
    detail: "Central linting and formatting rules for the whole monorepo.",
  },
  {
    label: "tsconfig.base.json",
    detail: "Strict reusable compiler defaults extended by apps and packages.",
  },
  {
    label: "turbo.json",
    detail: "Task graph and caching rules for your workspace commands.",
  },
] as const;

const resourceLinks = [
  {
    href: "https://turbo.build/repo/docs",
    label: "Turborepo docs",
  },
  {
    href: "https://nextjs.org/docs",
    label: "Next.js docs",
  },
  {
    href: "https://biomejs.dev/guides/getting-started/",
    label: "Biome guides",
  },
] as const;

export default async function Home() {
  const session = await getAuthSession({ headers: await headers() });
  return (
    <>
      <Navbar session={session} />
      <main className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(216,93,54,0.18),_transparent_62%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-32 h-72 w-72 rounded-full bg-accent-soft blur-3xl"
        />

        <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-14 px-6 py-8 sm:px-10 lg:px-12">
          <header className="flex flex-col gap-5 rounded-[2rem] border border-line bg-surface p-6 shadow-[var(--shadow)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-deep">
                Coco Kit
              </p>
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Your Turborepo starter is wired up and ready to grow.
              </h1>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-line bg-surface-strong px-4 py-2 text-sm">
              Shared Biome + shared TS config + Turbo tasks
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
            <div className="rounded-[2rem] border border-line bg-surface-strong p-7 shadow-[var(--shadow)]">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-accent-deep">
                Starter Foundation
              </p>
              <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                One clean workspace for shipping apps, shared packages, and
                future tooling.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 sm:text-lg">
                The app is no longer the default Create Next App screen. It now
                explains the workspace, points at the important files, and gives
                you a stronger base to build from.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {commands.map((command) => (
                  <span
                    key={command}
                    className="rounded-full border border-line bg-canvas px-4 py-2 font-mono text-sm text-ink"
                  >
                    {command}
                  </span>
                ))}
              </div>
            </div>

            <aside className="rounded-[2rem] border border-line bg-[#201d19] p-7 text-[#f7f0e7] shadow-[var(--shadow)]">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#f4b39e]">
                First Moves
              </p>
              <ol className="mt-6 space-y-5 text-sm leading-7 text-[#e8dccd]">
                <li>
                  Run <span className="font-mono text-white">pnpm install</span>{" "}
                  from the repo root so Turbo and the web app share one
                  lockfile.
                </li>
                <li>
                  Start local development with{" "}
                  <span className="font-mono text-white">pnpm dev</span> or just
                  the app with{" "}
                  <span className="font-mono text-white">pnpm dev:web</span>.
                </li>
                <li>
                  Add shared code in{" "}
                  <span className="font-mono text-white">packages</span> when
                  you are ready to reuse UI, schemas, or utilities.
                </li>
              </ol>
            </aside>
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            {workspaceHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-[var(--shadow)]"
              >
                <h3 className="text-xl font-semibold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7">{item.description}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-line bg-surface p-7 shadow-[var(--shadow)]">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-deep">
                Workspace Map
              </p>
              <div className="mt-6 space-y-4">
                {workspaceMap.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.25rem] border border-line bg-surface-strong p-4"
                  >
                    <p className="font-mono text-sm text-accent-deep">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-7">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-line bg-surface p-7 shadow-[var(--shadow)]">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-deep">
                Helpful Docs
              </p>
              <div className="mt-6 space-y-4">
                {resourceLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-[1.25rem] border border-line bg-surface-strong px-4 py-4 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <span className="font-medium text-ink">{link.label}</span>
                    <span className="text-sm transition-colors group-hover:text-accent-deep">
                      Open
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-accent-soft p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-deep">
                  Next step
                </p>
                <p className="mt-3 text-sm leading-7 text-[#523629]">
                  Create a second app or a shared package and this setup will
                  keep the formatting, type safety, and task wiring consistent.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
