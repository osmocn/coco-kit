"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type EmailPasswordAuth,
  emailPasswordAuthSchema,
} from "@coco-kit/zod/schema";
import { useRouter } from "next/navigation";

import { Button } from "@coco-kit/ui/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldError as FieldErrorComponent,
} from "@coco-kit/ui/components/ui/field";
import { Input } from "@coco-kit/ui/components/ui/input";

import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import { getEmailVerificationCallbackURL } from "@/lib/email-verification";
import { PasswordField } from "../../auth-ui";

export function RegisterFields() {
  const emailId = useId();
  const router = useRouter();

  const form = useForm<EmailPasswordAuth>({
    resolver: zodResolver(emailPasswordAuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: EmailPasswordAuth) {
    form.clearErrors("root");

    const username = (values.email?.split("@")[0] ?? "")
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const { error } = await authClient.signUp.email({
      name: username,
      email: values.email,
      password: values.password,
      callbackURL: "/account",
    });

    if (error) {
      form.setError("root", {
        message: error.message ?? "Couldn't create your account",
      });
      return;
    }

    const verificationResponse = await apiClient.account[
      "send-verification-email"
    ].$post({
      json: {
        callbackURL: getEmailVerificationCallbackURL(),
      },
    });

    router.replace(
      `/account?registered=1&verificationEmailSent=${
        verificationResponse.ok ? "1" : "0"
      }`,
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <FieldErrorComponent errors={errors.root ? [errors.root] : []} />

      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor={emailId}>Email address</FieldLabel>

          <FieldContent>
            <Input
              id={emailId}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
              aria-invalid={!!errors.email}
              {...form.register("email")}
            />
          </FieldContent>

          {!errors.email && (
            <FieldDescription>
              We'll send a verification link to this email
            </FieldDescription>
          )}

          <FieldErrorComponent errors={errors.email ? [errors.email] : []} />
        </Field>

        <PasswordField
          registration={form.register("password")}
          error={errors.password}
          placeholder="Create a strong password"
          description="At least 8 characters recommended"
        />
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating your account..." : "Create account"}
      </Button>
    </form>
  );
}
