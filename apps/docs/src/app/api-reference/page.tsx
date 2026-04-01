import type { Metadata } from "next";
import { apiGroups, referenceCommands } from "@/app/_content/site";

export const metadata: Metadata = {
  title: "API Reference",
  description:
    "Starter reference sections for routes, commands, and workspace conventions.",
};

export default function ApiReferencePage() {
  return (
    <main className="space-y-8">
      <section className="rounded-[2rem] border border-line bg-surface p-7 shadow-[var(--shadow)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-strong">
          API Reference
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.04] text-ink sm:text-6xl">
          Keep the exact things close at hand: routes, commands, and config.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 sm:text-lg">
          This starter page is shaped like a reference index, ready for the
          specific surface area your team will document over time.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {apiGroups.map((group) => (
          <article
            key={group.title}
            className="rounded-[1.8rem] border border-line bg-surface p-6 shadow-[var(--shadow)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-strong">
              {group.eyebrow}
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
              {group.title}
            </h2>
            <p className="mt-4 text-sm leading-7">{group.summary}</p>
            <ul className="mt-5 space-y-3">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-[1rem] border border-line bg-surface-strong px-4 py-3 text-sm text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-line bg-surface-dark p-7 text-white shadow-[var(--shadow)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9fe1d7]">
              Workspace Commands
            </p>
            <h2 className="mt-3 font-display text-3xl">
              The operational shortcuts match the rest of the monorepo.
            </h2>
          </div>
          <p className="text-sm text-slate-300">
            Same stack, same root workflow, separate frontend.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {referenceCommands.map((command) => (
            <article
              key={command.command}
              className="rounded-[1.3rem] border border-white/10 bg-white/5 p-5"
            >
              <p className="font-mono text-sm text-[#eebc4b]">
                {command.command}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                {command.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
