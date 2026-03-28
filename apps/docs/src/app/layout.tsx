import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const navigation = [
  { href: "/", label: "Overview" },
  { href: "/guides", label: "Guides" },
  { href: "/api-reference", label: "API Reference" },
] as const;

export const metadata: Metadata = {
  title: {
    default: "Coco Docs",
    template: "%s | Coco Docs",
  },
  description:
    "A docs-focused Next.js frontend for Coco Kit with the same modern stack as the web app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-full bg-canvas antialiased">
      <body className="min-h-full font-sans text-ink">
        <div className="relative isolate min-h-screen overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(10,125,114,0.18),_transparent_55%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-8rem] top-36 h-80 w-80 rounded-full bg-[rgba(238,188,75,0.15)] blur-3xl"
          />

          <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
            <header className="sticky top-4 z-20 rounded-[1.6rem] border border-line bg-surface/90 px-4 py-4 shadow-[var(--shadow)] backdrop-blur sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <Link href="/" className="inline-flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-dark text-sm font-semibold text-white">
                      D
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.32em] text-accent-strong">
                        Coco Kit
                      </span>
                      <span className="font-display text-2xl leading-none">
                        Docs Frontend
                      </span>
                    </span>
                  </Link>
                </div>

                <nav className="flex flex-wrap items-center gap-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full border border-line bg-surface-strong px-4 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:border-line-strong hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </header>

            <div className="flex-1 py-8 sm:py-10">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
