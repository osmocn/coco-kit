"use client";

import { Button } from "@coco-kit/ui/components/ui/button";
import {
  FieldGroup,
  FieldError as FieldErrorComponent,
} from "@coco-kit/ui/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { PasswordField } from "../../auth-ui";

const schema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof schema>;

export const ResetPasswordFields = ({ token }: { token: string }) => {
  const router = useRouter();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: ResetPasswordValues) {
    form.clearErrors("root");

    const { error } = await authClient.resetPassword({
      newPassword: values.newPassword,
      token,
    });

    if (error) {
      form.setError("root", {
        message: error.message ?? "Couldn't reset your password",
      });
      return;
    }

    router.replace("/login?reset=1");
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <FieldErrorComponent errors={errors.root ? [errors.root] : []} />

      <FieldGroup>
        <PasswordField
          registration={form.register("newPassword")}
          error={errors.newPassword}
          label="New password"
          placeholder="Create a new password"
          description="Use at least 8 characters"
        />

        <PasswordField
          registration={form.register("confirmPassword")}
          error={errors.confirmPassword}
          label="Confirm password"
          placeholder="Re-enter your password"
          description="Make sure both passwords match"
        />
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Resetting password..." : "Reset password"}
      </Button>
    </form>
  );
};
