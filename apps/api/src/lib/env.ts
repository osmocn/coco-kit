import { z } from "zod";

const trustedOriginsSchema = z
  .string()
  .min(1, "BETTER_AUTH_TRUSTED_ORIGINS is required")
  .transform((value) =>
    value
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  )
  .refine((origins) => origins.length > 0, {
    message: "BETTER_AUTH_TRUSTED_ORIGINS must include at least one URL",
  })
  .refine((origins) => origins.every((origin) => URL.canParse(origin)), {
    message:
      "BETTER_AUTH_TRUSTED_ORIGINS must be a comma-separated list of valid URLs",
  });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),

  BETTER_AUTH_TRUSTED_ORIGINS: trustedOriginsSchema,

  BETTER_AUTH_BASE_URL: z
    .string()
    .url("BETTER_AUTH_BASE_URL must be a valid URL"),

  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
});

const parsed = envSchema.safeParse({
  ...process.env,
  BETTER_AUTH_TRUSTED_ORIGINS: process.env.BETTER_AUTH_TRUSTED_ORIGINS,
});

if (!parsed.success) {
  console.error("\nInvalid environment variables:\n");

  const errors = parsed.error.flatten().fieldErrors;

  Object.entries(errors).forEach(([key, value]) => {
    console.error(`- ${key}: ${value?.join(", ")}`);
  });

  console.error("\nFix your .env file and restart.\n");
  process.exit(1);
}
export const env = parsed.data;

export type Env = typeof env;
