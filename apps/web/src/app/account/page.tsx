import { Button } from "@coco-kit/ui/components/ui/button";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountForm } from "@/components/forms/account";
import { ChangePasswordForm } from "@/components/forms/change-password";
import { SignOutButton } from "@/components/sign-out-button";
import { getAuthSession } from "@/lib/auth-session";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AccountPage() {
  const session = await getAuthSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const { user, session: activeSession } = session;

  return (
    <main className="min-h-screen bg-canvas px-6 py-8 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="rounded-[2rem] border border-line bg-surface p-6 shadow-[var(--shadow)]">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-deep">
            Private Account
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Manage your account.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 sm:text-base">
            This page is protected. Update your profile details here, review
            your active session, and jump back home whenever you need to.
          </p>
        </header>

        <ChangePasswordForm />

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <AccountForm user={user} />

          <aside className="rounded-[2rem] border border-line bg-surface p-6 shadow-[var(--shadow)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-deep">
              Session
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-[1.25rem] border border-line bg-surface-strong p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Session Expires
                </p>
                <p className="mt-2 text-base font-medium text-ink">
                  {formatTimestamp(activeSession.expiresAt)}
                </p>
              </div>

              <div className="rounded-[1.25rem] border border-line bg-surface-strong p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Last Updated
                </p>
                <p className="mt-2 text-base font-medium text-ink">
                  {formatTimestamp(activeSession.updatedAt)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/">Go To Home</Link>
              </Button>
              <SignOutButton />
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
