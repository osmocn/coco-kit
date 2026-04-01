"use client";

import { Button } from "@coco-kit/ui/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@coco-kit/ui/components/ui/field";
import { Input } from "@coco-kit/ui/components/ui/input";
import type { AuthSessionResponse } from "@coco-kit/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import { getEmailVerificationCallbackURL } from "@/lib/email-verification";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email address"),
});

type AccountFormValues = z.infer<typeof schema>;
type AccountUser = NonNullable<AuthSessionResponse>["user"];

type Notice = {
  message: string;
  tone: "error" | "info" | "success";
} | null;

type AccountFormProps = {
  user: AccountUser;
};

function NoticeBanner({ notice }: { notice: Notice }) {
  if (!notice) {
    return null;
  }

  const toneClasses =
    notice.tone === "error"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : notice.tone === "success"
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
        : "border-border bg-muted/40 text-muted-foreground";

  return (
    <p
      role={notice.tone === "error" ? "alert" : "status"}
      className={`rounded-[1.25rem] border px-4 py-3 text-sm ${toneClasses}`}
    >
      {notice.message}
    </p>
  );
}

export function AccountForm({ user }: AccountFormProps) {
  const nameId = useId();
  const emailId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [profile, setProfile] = useState({
    email: user.email,
    emailVerified: user.emailVerified,
    name: user.name,
  });
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user.email,
      name: user.name,
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    let cancelled = false;

    async function loadPendingEmail() {
      const response = await apiClient.account["pending-email"].$get();
      const payload = await response.json().catch(() => null);

      if (!response.ok || cancelled) {
        return;
      }

      const nextPendingEmail =
        payload &&
        typeof payload === "object" &&
        "pendingEmail" in payload &&
        (typeof payload.pendingEmail === "string" ||
          payload.pendingEmail === null)
          ? payload.pendingEmail
          : null;

      setPendingEmail(nextPendingEmail);
    }

    void loadPendingEmail();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const emailChangeError = searchParams.get("emailChangeError");
    const emailChanged = searchParams.get("emailChanged");
    const registered = searchParams.get("registered");
    const verificationEmailSent = searchParams.get("verificationEmailSent");

    if (!emailChangeError && !emailChanged && !registered) {
      return;
    }

    if (emailChangeError === "email-in-use") {
      setNotice({
        message: "That email is no longer available. Try a different address.",
        tone: "error",
      });
    } else if (emailChangeError) {
      setNotice({
        message: "We couldn't complete the email change from that link.",
        tone: "error",
      });
    } else if (emailChanged === "1" && verificationEmailSent === "0") {
      setNotice({
        message:
          "Email updated, but we couldn't send the verification email. Use resend verification.",
        tone: "info",
      });
    } else if (emailChanged === "1") {
      setNotice({
        message: "Email updated. Verify your new email address to finish.",
        tone: "success",
      });
    } else if (registered === "1" && verificationEmailSent === "0") {
      setNotice({
        message:
          "Account created, but we couldn't send the verification email. Use resend verification.",
        tone: "info",
      });
    } else if (registered === "1") {
      setNotice({
        message: "Account created. Verify your email address to finish.",
        tone: "success",
      });
    }

    router.replace("/account", { scroll: false });
  }, [router, searchParams]);

  async function onSubmit(values: AccountFormValues) {
    form.clearErrors("root");
    setNotice(null);

    const nextName = values.name.trim();
    const nextEmail = values.email.trim();
    const isNameChanged = nextName !== profile.name;
    const isEmailChanged = nextEmail !== profile.email;
    let savedName = profile.name;

    if (!isNameChanged && !isEmailChanged) {
      setNotice({
        message: "No changes to save yet.",
        tone: "info",
      });
      return;
    }

    if (isNameChanged) {
      const { error } = await authClient.updateUser({
        name: nextName,
      });

      if (error) {
        form.setError("root", {
          message: error.message ?? "Failed to update your profile.",
        });
        return;
      }

      savedName = nextName;
      setProfile((current) => ({
        ...current,
        name: nextName,
      }));
    }

    if (isEmailChanged) {
      const response = await apiClient.account["change-email"].$post({
        json: {
          newEmail: nextEmail,
          callbackURL: "/account",
          verificationCallbackURL: getEmailVerificationCallbackURL(),
        },
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        form.reset({
          email: profile.email,
          name: savedName,
        });
        form.setError("root", {
          message:
            (payload &&
            typeof payload === "object" &&
            "message" in payload &&
            typeof payload.message === "string"
              ? payload.message
              : null) ??
            (isNameChanged
              ? "Display name updated, but we couldn't start your email change."
              : "Failed to start your email change."),
        });
        return;
      }

      const currentEmail =
        payload &&
        typeof payload === "object" &&
        "currentEmail" in payload &&
        typeof payload.currentEmail === "string"
          ? payload.currentEmail
          : profile.email;
      const emailVerified =
        payload &&
        typeof payload === "object" &&
        "emailVerified" in payload &&
        typeof payload.emailVerified === "boolean"
          ? payload.emailVerified
          : profile.emailVerified;
      const nextPendingEmail =
        payload &&
        typeof payload === "object" &&
        "pendingEmail" in payload &&
        (typeof payload.pendingEmail === "string" ||
          payload.pendingEmail === null)
          ? payload.pendingEmail
          : nextEmail;
      const verificationEmailSent =
        payload &&
        typeof payload === "object" &&
        "verificationEmailSent" in payload &&
        (typeof payload.verificationEmailSent === "boolean" ||
          payload.verificationEmailSent === null)
          ? payload.verificationEmailSent
          : null;

      setProfile((current) => ({
        ...current,
        email: currentEmail,
        emailVerified,
      }));
      setPendingEmail(nextPendingEmail);

      form.reset({
        email: currentEmail,
        name: savedName,
      });

      if (currentEmail === nextEmail) {
        setNotice({
          message:
            verificationEmailSent === false
              ? "Email updated, but we couldn't send the verification email. Use resend verification."
              : "Email updated. Verify your new email address to finish.",
          tone: verificationEmailSent === false ? "info" : "success",
        });
        return;
      }
    }

    form.reset({
      email: profile.email,
      name: savedName,
    });

    setNotice({
      message:
        isNameChanged && isEmailChanged
          ? "Profile updated. Check your current email to approve the change."
          : isEmailChanged
            ? "Check your current email to approve the change."
            : "Profile updated successfully.",
      tone: "success",
    });
  }

  async function handleResendVerification() {
    setNotice(null);
    form.clearErrors("root");
    setIsResendingVerification(true);

    const response = await apiClient.account["send-verification-email"].$post({
      json: {
        callbackURL: getEmailVerificationCallbackURL(),
      },
    });
    const payload = await response.json().catch(() => null);

    setIsResendingVerification(false);

    if (!response.ok) {
      setNotice({
        message:
          (payload &&
          typeof payload === "object" &&
          "message" in payload &&
          typeof payload.message === "string"
            ? payload.message
            : null) ?? "Failed to resend the verification email.",
        tone: "error",
      });
      return;
    }

    setNotice({
      message: `Verification email sent to ${profile.email}.`,
      tone: "success",
    });
  }

  return (
    <article className="rounded-[2rem] border border-line bg-surface p-6 shadow-[var(--shadow)]">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-deep">
          Profile
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Edit account details
        </h2>
        <p className="text-sm leading-7 text-muted sm:text-base">
          Update your display name now, and request an email change whenever you
          need it.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-4 rounded-[1.25rem] border border-line bg-surface-strong p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Current Email
          </span>
          <span className="text-sm font-medium text-ink">{profile.email}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Verification
          </span>
          <span className="text-sm font-medium text-ink">
            {profile.emailVerified ? "Verified" : "Pending"}
          </span>
          {!profile.emailVerified ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={isResendingVerification}
            >
              {isResendingVerification ? "Sending..." : "Resend verification"}
            </Button>
          ) : null}
        </div>

        {pendingEmail ? (
          <div className="rounded-[1rem] border border-dashed border-line px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              New Email Awaiting Approval
            </p>
            <p className="mt-2 text-sm font-medium text-ink">{pendingEmail}</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Check {profile.email} to approve this change. After approval,{" "}
              {pendingEmail} becomes your sign-in email and you can verify it
              from here.
            </p>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-6"
      >
        {errors.root?.message ? (
          <NoticeBanner
            notice={{
              message: errors.root.message,
              tone: "error",
            }}
          />
        ) : null}

        {!errors.root?.message ? <NoticeBanner notice={notice} /> : null}

        <FieldGroup>
          <Field data-invalid={!!errors.name || undefined}>
            <FieldLabel htmlFor={nameId}>Display Name</FieldLabel>
            <Input
              id={nameId}
              placeholder="Your name"
              {...form.register("name")}
              aria-invalid={!!errors.name || undefined}
            />
            {errors.name ? (
              <FieldDescription>{errors.name.message}</FieldDescription>
            ) : (
              <FieldDescription>
                This updates the name shown across your account.
              </FieldDescription>
            )}
          </Field>

          <Field data-invalid={!!errors.email || undefined}>
            <FieldLabel htmlFor={emailId}>Email Address</FieldLabel>
            <Input
              id={emailId}
              type="email"
              placeholder="you@example.com"
              {...form.register("email")}
              aria-invalid={!!errors.email || undefined}
            />
            {errors.email ? (
              <FieldDescription>{errors.email.message}</FieldDescription>
            ) : (
              <FieldDescription>
                Verified emails need approval from your current inbox first.
                Unverified emails switch right away, then the new address needs
                verification.
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Account"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset({
                email: profile.email,
                name: profile.name,
              });
              setNotice(null);
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </article>
  );
}
