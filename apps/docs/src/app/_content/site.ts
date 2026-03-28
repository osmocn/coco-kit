export const quickstartSteps = [
  {
    title: "Install once at the repo root",
    description:
      "Keep one lockfile and one dependency graph so the docs app tracks the same package family as the main web app.",
  },
  {
    title: "Run only the docs app when needed",
    description:
      "Use the dedicated script for focused docs work, or keep `pnpm dev` for the full workspace flow.",
  },
  {
    title: "Grow routes by section, not by accident",
    description:
      "Add guides, changelogs, and API reference areas as explicit routes while colocating shared content in private folders.",
  },
] as const;

export const docsChannels = [
  {
    title: "Getting Started",
    description:
      "Short, confidence-building guidance for new teammates who need the happy path first.",
  },
  {
    title: "Guides",
    description:
      "Narrative walkthroughs that explain workflows, architecture, and the reasoning behind product decisions.",
  },
  {
    title: "Reference",
    description:
      "Fast lookup pages for commands, endpoints, conventions, and exact expected behavior.",
  },
  {
    title: "Release Notes",
    description:
      "A space for changes, migrations, and versioned updates once the docs start evolving alongside the product.",
  },
] as const;

export const workspaceNotes = [
  {
    label: "apps/docs",
    detail:
      "Standalone Next.js docs frontend with typed routes, React Compiler, and Tailwind v4.",
  },
  {
    label: "apps/web",
    detail:
      "Primary app frontend sharing the same package versions and workspace tooling.",
  },
  {
    label: "tsconfig.base.json",
    detail:
      "Shared strict compiler defaults extended by both apps so type behavior stays aligned.",
  },
  {
    label: "turbo.json",
    detail: "Monorepo task graph for build, dev, lint, and typecheck commands.",
  },
] as const;

export const guideTracks = [
  {
    eyebrow: "Onboarding",
    title: "Start",
    description:
      "Cover installation, first run, and the shortest route from clone to confident local edits.",
    topics: [
      "Installing dependencies",
      "Running the docs app alone",
      "Understanding the route layout",
    ],
  },
  {
    eyebrow: "Authoring",
    title: "Write",
    description:
      "Teach contributors how to add new pages, organize content, and keep docs easy to scan.",
    topics: [
      "Adding new App Router pages",
      "Using private folders for shared content",
      "Choosing when content belongs in guides vs reference",
    ],
  },
  {
    eyebrow: "Operations",
    title: "Ship",
    description:
      "Document the checks and expectations that keep the docs frontend in step with the workspace.",
    topics: [
      "Linting and formatting",
      "Typechecking from the root",
      "Keeping package versions aligned with apps/web",
    ],
  },
] as const;

export const apiGroups = [
  {
    eyebrow: "Routes",
    title: "Site Sections",
    summary:
      "Map the public-facing docs areas before the content volume makes navigation messy.",
    items: ["/", "/guides", "/api-reference"],
  },
  {
    eyebrow: "Conventions",
    title: "Workspace Rules",
    summary:
      "Capture the repo-level habits that matter while working in this frontend.",
    items: [
      "Extend ../../tsconfig.base.json",
      "Use shared biome.json",
      "Keep app code inside src/app",
    ],
  },
  {
    eyebrow: "Tooling",
    title: "Shared Stack",
    summary:
      "Mirror the same runtime and tooling versions already used by apps/web.",
    items: ["next@16.2.1", "react@19.2.4", "tailwindcss@^4", "typescript@^5"],
  },
] as const;

export const referenceCommands = [
  {
    command: "pnpm dev:docs",
    description: "Run only the docs app for focused frontend work.",
  },
  {
    command: "pnpm build",
    description: "Build every workspace project through Turbo.",
  },
  {
    command: "pnpm lint",
    description: "Apply the shared Biome rules from the repository root.",
  },
  {
    command: "pnpm typecheck",
    description: "Run package-aware typechecks across the monorepo.",
  },
] as const;
