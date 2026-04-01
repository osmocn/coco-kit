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
import { MailIcon } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof schema>;

const ForgotPasswordForm = () => {
  const emailId = useId();
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: ForgotPasswordValues) {
    form.clearErrors("root");

    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      form.setError("root", {
        message: error.message ?? "Failed to send reset link",
      });
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <p className="rounded-[1.25rem] border border-border bg-muted/40 px-4 py-3 text-center text-sm text-muted-foreground">
        If an account exists for{" "}
        <span className="font-medium text-foreground">
          {form.getValues("email")}
        </span>
        , you'll receive a password reset link shortly.
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
        <Field data-invalid={!!errors.email || undefined}>
          <FieldLabel htmlFor={emailId}>Email</FieldLabel>
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
              Enter the email associated with your account and we'll send you a
              reset link.
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        <MailIcon data-icon="inline-start" />
        Send reset link
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
