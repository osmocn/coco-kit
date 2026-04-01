import Link from "next/link";
import {
  apiGroups,
  docsChannels,
  quickstartSteps,
  workspaceNotes,
} from "@/app/_content/site";

const commands = [
  "pnpm install",
  "pnpm dev",
  "pnpm dev:docs",
  "pnpm typecheck",
] as const;

const featuredPaths = [
  {
    href: "/guides",
    eyebrow: "Start Here",
    title: "Guides that explain the flow, not just the files.",
    description:
      "A docs frontend should help people find a path quickly, so the starter ships with curated sections instead of a blank canvas.",
  },
  {
    href: "/api-reference",
    eyebrow: "For Builders",
    title: "Reference screens for routes, commands, and conventions.",
    description:
      "Keep framework notes, workspace commands, and app-level behavior close to the UI your team will extend.",
  },
] as const;

export default function Home() {
  return (
    <main className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.78fr]">
        <div className="rounded-[2rem] border border-line bg-surface p-7 shadow-[var(--shadow)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-strong">
            Docs Workspace
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.04] text-ink sm:text-6xl">
            A calmer, sharper starting point for writing product docs.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 sm:text-lg">
            `apps/docs` mirrors the same Next.js, React, Tailwind v4, and
            TypeScript stack as `apps/web`, but the UI is shaped for knowledge
            architecture, navigation, and readable content blocks.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {commands.map((command) => (
              <span
                key={command}
                className="rounded-full border border-line bg-surface-strong px-4 py-2 font-mono text-sm text-ink"
              >
                {command}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/guides"
              className="rounded-full bg-surface-dark px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              Explore guides
            </Link>
            <Link
              href="/api-reference"
              className="rounded-full border border-line-strong bg-surface-strong px-5 py-3 text-sm font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5"
            >
              Open API reference
            </Link>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-line bg-surface-dark p-7 text-white shadow-[var(--shadow)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9fe1d7]">
            Quickstart
          </p>
          <ol className="mt-6 space-y-5">
            {quickstartSteps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#eebc4b]">
                  Step {index + 1}
                </p>
                <h2 className="mt-2 text-lg font-semibold">{step.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {featuredPaths.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-[1.8rem] border border-line bg-surface p-7 shadow-[var(--shadow)] transition-transform duration-200 hover:-translate-y-1"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-strong">
              {item.eyebrow}
            </p>
            <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight text-ink">
              {item.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7">
              {item.description}
            </p>
            <p className="mt-6 text-sm font-semibold text-accent">
              Open section
            </p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-line bg-surface p-7 shadow-[var(--shadow)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-strong">
            Documentation Channels
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {docsChannels.map((channel) => (
              <article
                key={channel.title}
                className="rounded-[1.4rem] border border-line bg-surface-strong p-5"
              >
                <h2 className="text-xl font-semibold tracking-tight text-ink">
                  {channel.title}
                </h2>
                <p className="mt-3 text-sm leading-7">
                  {channel.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-line bg-surface p-7 shadow-[var(--shadow)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-strong">
            Workspace Notes
          </p>
          <div className="mt-6 space-y-4">
            {workspaceNotes.map((note) => (
              <div
                key={note.label}
                className="rounded-[1.25rem] border border-line bg-surface-strong p-4"
              >
                <p className="font-mono text-sm text-accent-strong">
                  {note.label}
                </p>
                <p className="mt-2 text-sm leading-7">
                  {note.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-line bg-surface p-7 shadow-[var(--shadow)] sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-strong">
              API Surface
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              The first reference sections are already mapped out.
            </h2>
          </div>
          <Link
            href="/api-reference"
            className="text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
          >
            Browse everything
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {apiGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-[1.35rem] border border-line bg-surface-strong p-5"
            >
              <h3 className="text-lg font-semibold text-ink">{group.title}</h3>
              <p className="mt-3 text-sm leading-7">
                {group.summary}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
