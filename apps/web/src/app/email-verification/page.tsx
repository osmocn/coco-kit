"use client";

import { Button } from "@coco-kit/ui/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type VerificationState = {
  description: string;
  eyebrow: string;
  title: string;
  tone: "error" | "info" | "success";
};

const stateByErrorCode: Record<string, VerificationState> = {
  INVALID_TOKEN: {
    eyebrow: "Verification Error",
    title: "This verification link is invalid.",
    description:
      "The link may be broken, already used, or copied incorrectly. Request a fresh verification email and try again.",
    tone: "error",
  },
  TOKEN_EXPIRED: {
    eyebrow: "Verification Error",
    title: "This verification link has expired.",
    description:
      "Verification links only stay active for a limited time. Request a new email verification link to continue.",
    tone: "error",
  },
  USER_NOT_FOUND: {
    eyebrow: "Verification Error",
    title: "We couldn't find that account anymore.",
    description:
      "That verification link no longer matches an active user. Try signing in again or request a fresh verification email.",
    tone: "error",
  },
  INVALID_USER: {
    eyebrow: "Verification Error",
    title: "This verification link belongs to a different session.",
    description:
      "Open the link while signed into the matching account, or sign out and try again from the latest email.",
    tone: "error",
  },
};

const defaultErrorState: VerificationState = {
  eyebrow: "Verification Error",
  title: "We couldn't verify your email.",
  description:
    "Try using the latest email we sent. If this keeps happening, request a new verification link from your account.",
  tone: "error",
};

const successState: VerificationState = {
  eyebrow: "Email Verified",
  title: "Your email has been verified.",
  description:
    "You're all set. Your account now reflects the verified email address and you can continue normally.",
  tone: "success",
};

const idleState: VerificationState = {
  eyebrow: "Email Verification",
  title: "Open the verification link from your inbox.",
  description:
    "This page shows the result after you use an email verification link. If you need a fresh one, request it again from your account.",
  tone: "info",
};

function getNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/account";
  }

  return next;
}

function getState(error: string | null, status: string | null) {
  if (error) {
    return stateByErrorCode[error] ?? defaultErrorState;
  }

  if (status === "success") {
    return successState;
  }

  return idleState;
}

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const status = searchParams.get("status");
  const nextPath = getNextPath(searchParams.get("next"));
  const state = getState(error, status);

  const cardToneClasses =
    state.tone === "error"
      ? "border-destructive/30 bg-destructive/10"
      : state.tone === "success"
        ? "border-emerald-500/30 bg-emerald-500/10"
        : "border-line bg-surface";

  const eyebrowToneClasses =
    state.tone === "error"
      ? "text-destructive"
      : state.tone === "success"
        ? "text-emerald-700"
        : "text-accent-deep";

  return (
    <main className="relative isolate overflow-hidden px-6 py-8 sm:px-10 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(216,93,54,0.18),_transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-soft blur-3xl"
      />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl items-center justify-center">
        <section
          className={`w-full rounded-[2rem] border p-7 shadow-[var(--shadow)] sm:p-9 ${cardToneClasses}`}
        >
          <div className="max-w-2xl">
            <p
              className={`text-sm font-semibold uppercase tracking-[0.28em] ${eyebrowToneClasses}`}
            >
              {state.eyebrow}
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {state.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
              {state.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href={nextPath}>
                {nextPath === "/account" ? "Go To Account" : "Continue"}
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go To Home</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
