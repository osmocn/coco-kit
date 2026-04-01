"use client";

import { Button } from "@coco-kit/ui/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@coco-kit/ui/components/ui/field";
import { Input } from "@coco-kit/ui/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type ChangePasswordValues = z.infer<typeof schema>;

type Notice = {
  message: string;
  tone: "error" | "success";
} | null;

export function ChangePasswordForm() {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();
  const [notice, setNotice] = useState<Notice>(null);

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: ChangePasswordValues) {
    setNotice(null);
    form.clearErrors("root");

    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: false,
    });

    if (error) {
      form.setError("root", {
        message: error.message ?? "Failed to change password.",
      });
      return;
    }

    form.reset();
    setNotice({ message: "Password changed successfully.", tone: "success" });
  }

  return (
    <article className="rounded-[2rem] border border-line bg-surface p-6 shadow-[var(--shadow)]">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-deep">
          Security
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Change password
        </h2>
        <p className="text-sm leading-7 text-muted sm:text-base">
          Enter your current password and choose a new one.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-6"
      >
        {errors.root?.message ? (
          <p
            role="alert"
            className="rounded-[1.25rem] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {errors.root.message}
          </p>
        ) : null}

        {!errors.root?.message && notice ? (
          <p
            role="status"
            className={`rounded-[1.25rem] border px-4 py-3 text-sm ${
              notice.tone === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {notice.message}
          </p>
        ) : null}

        <FieldGroup>
          <Field data-invalid={!!errors.currentPassword || undefined}>
            <FieldLabel htmlFor={currentPasswordId}>
              Current Password
            </FieldLabel>
            <Input
              id={currentPasswordId}
              type="password"
              placeholder="********"
              {...form.register("currentPassword")}
              aria-invalid={!!errors.currentPassword || undefined}
            />
            {errors.currentPassword ? (
              <FieldDescription>
                {errors.currentPassword.message}
              </FieldDescription>
            ) : null}
          </Field>

          <Field data-invalid={!!errors.newPassword || undefined}>
            <FieldLabel htmlFor={newPasswordId}>New Password</FieldLabel>
            <Input
              id={newPasswordId}
              type="password"
              placeholder="********"
              {...form.register("newPassword")}
              aria-invalid={!!errors.newPassword || undefined}
            />
            {errors.newPassword ? (
              <FieldDescription>{errors.newPassword.message}</FieldDescription>
            ) : (
              <FieldDescription>
                At least 8 characters.
              </FieldDescription>
            )}
          </Field>

          <Field data-invalid={!!errors.confirmNewPassword || undefined}>
            <FieldLabel htmlFor={confirmPasswordId}>
              Confirm New Password
            </FieldLabel>
            <Input
              id={confirmPasswordId}
              type="password"
              placeholder="********"
              {...form.register("confirmNewPassword")}
              aria-invalid={!!errors.confirmNewPassword || undefined}
            />
            {errors.confirmNewPassword ? (
              <FieldDescription>
                {errors.confirmNewPassword.message}
              </FieldDescription>
            ) : null}
          </Field>
        </FieldGroup>

        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Change Password"}
          </Button>
        </div>
      </form>
    </article>
  );
}
