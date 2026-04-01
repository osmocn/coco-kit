import Link from "next/link";
import type { AuthSessionResponse } from "@coco-kit/zod/schema";
import { Button } from "@coco-kit/ui/components/ui/button";

export const navbarLinks = [{ href: "/", label: "Home" }] as const;

export default function Navbar({ session }: { session: AuthSessionResponse }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-sm font-medium tracking-tight text-foreground"
        >
          YourBrand
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navbarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {session?.user ? (
            <Link
              href="/account"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Account
            </Link>
          ) : (
            <>
              {/* Secondary */}
              <Link
                href="/login"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>

              {/* Primary */}
              <Button asChild size="sm" className="h-8 px-3 text-sm">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}