import type { Metadata } from "next";
import Link from "next/link";
import { docsChannels, guideTracks } from "@/app/_content/site";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Starter guides for structuring and extending the Coco Docs frontend.",
};

export default function GuidesPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-[2rem] border border-line bg-surface p-7 shadow-[var(--shadow)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-strong">
          Guides
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.04] text-ink sm:text-6xl">
          Start with a path, then deepen each section as the product grows.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          These starter tracks are organized the way a healthy docs site tends
          to evolve: onboarding, workflows, and references that keep technical
          details close to the product surface.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {guideTracks.map((track) => (
          <article
            key={track.title}
            className="rounded-[1.8rem] border border-line bg-surface p-6 shadow-[var(--shadow)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-strong">
              {track.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl text-ink">
              {track.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              {track.description}
            </p>
            <ul className="mt-5 space-y-3">
              {track.topics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-[1rem] border border-line bg-surface-strong px-4 py-3 text-sm text-ink"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-line bg-surface-dark p-7 text-white shadow-[var(--shadow)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9fe1d7]">
            Recommended Structure
          </p>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-200">
            <p>
              Keep reusable docs data in private folders like
              `src/app/_content`, put route-specific page files under `src/app`,
              and let shared chrome stay in the root layout.
            </p>
            <p>
              When the docs grow, add route groups for major sections or nested
              layouts for areas like tutorials, changelogs, and API reference.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-line bg-surface p-7 shadow-[var(--shadow)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-strong">
            Content Modes
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {docsChannels.map((channel) => (
              <article
                key={channel.title}
                className="rounded-[1.3rem] border border-line bg-surface-strong p-5"
              >
                <h2 className="text-lg font-semibold text-ink">
                  {channel.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {channel.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-line bg-surface p-7 shadow-[var(--shadow)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-strong">
              Continue
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink">
              Jump into the reference layer when you need exact behaviors.
            </h2>
          </div>
          <Link
            href="/api-reference"
            className="rounded-full bg-surface-dark px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            Open API reference
          </Link>
        </div>
      </section>
    </main>
  );
}
