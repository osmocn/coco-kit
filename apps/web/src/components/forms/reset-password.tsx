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
import { useRouter, useSearchParams } from "next/navigation";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

type ResetPasswordValues = z.infer<typeof schema>;

const ResetPasswordForm = () => {
  const passwordId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "" },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) {
      form.setError("root", { message: "Invalid or missing reset token." });
      return;
    }

    form.clearErrors("root");

    const { error } = await authClient.resetPassword({
      newPassword: values.newPassword,
      token,
    });

    if (error) {
      form.setError("root", {
        message: error.message ?? "Failed to reset password",
      });
      return;
    }

    router.replace("/login");
  }

  if (!token) {
    return (
      <p
        role="alert"
        className="rounded-[1.25rem] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        Invalid or expired reset link. Please request a new one.
      </p>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      {errors.root?.message ? (
        <p
          role="alert"
          className="rounded-[1.25rem] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {errors.root.message}
        </p>
      ) : null}

      <FieldGroup>
        <Field data-invalid={!!errors.newPassword || undefined}>
          <FieldLabel htmlFor={passwordId}>New Password</FieldLabel>
          <Input
            id={passwordId}
            type="password"
            placeholder="********"
            {...form.register("newPassword")}
            aria-invalid={!!errors.newPassword || undefined}
          />
          {errors.newPassword ? (
            <FieldDescription>{errors.newPassword.message}</FieldDescription>
          ) : (
            <FieldDescription>
              Choose a strong password with at least 8 characters.
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        Reset password
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
