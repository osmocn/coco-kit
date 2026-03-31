"use client";

import { Button } from "@coco-kit/ui/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@coco-kit/ui/components/ui/field";
import { Input } from "@coco-kit/ui/components/ui/input";
import {
  type EmailPasswordAuth,
  emailPasswordAuthSchema,
} from "@coco-kit/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";

const RegisterForm = () => {
  const emailId = useId();
  const passwordId = useId();
  const router = useRouter();

  const form = useForm<EmailPasswordAuth>({
    resolver: zodResolver(emailPasswordAuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
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
    });

    if (error) {
      form.setError("root", {
        message: error.message ?? "Registration failed",
      });
      return;
    }

    router.replace("/account");
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
              Enter the email associated with your account.
            </FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!errors.password || undefined}>
          <FieldLabel htmlFor={passwordId}>Password</FieldLabel>
          <Input
            id={passwordId}
            type="password"
            placeholder="********"
            {...form.register("password")}
            aria-invalid={!!errors.password || undefined}
          />

          {errors.password ? (
            <FieldDescription>{errors.password.message}</FieldDescription>
          ) : (
            <FieldDescription>Your account password.</FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        <MailIcon data-icon="inline-start" />
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;
