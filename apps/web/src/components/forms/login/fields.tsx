"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  emailPasswordAuthSchema,
  type EmailPasswordAuth,
} from "@coco-kit/zod/schema";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { Button } from "@coco-kit/ui/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldContent,
  FieldError as FieldErrorComponent,
} from "@coco-kit/ui/components/ui/field";
import { Input } from "@coco-kit/ui/components/ui/input";

import { PasswordField } from "../../auth-ui";

export function LoginFields() {
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

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/account",
    });

    if (error) {
      form.setError("root", {
        message: error.message ?? "Invalid email or password",
      });
      return;
    }

    router.replace("/account");
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <FieldErrorComponent errors={errors.root ? [errors.root] : []} />

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
          <FieldDescription>Use the email you signed up with</FieldDescription>
        )}

        <FieldErrorComponent errors={errors.email ? [errors.email] : []} />
      </Field>

      <PasswordField
        registration={form.register("password")}
        error={errors.password}
        showForgotPassword
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Signing you in..." : "Sign in"}
      </Button>
    </form>
  );
}
