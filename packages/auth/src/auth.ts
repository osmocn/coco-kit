import db, { authSchema } from "@coco-kit/db";
import { getEnvVariable } from "@coco-kit/utils";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, organization } from "better-auth/plugins";

const trustedOrigins = getEnvVariable("BETTER_AUTH_TRUSTED_ORIGINS")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (trustedOrigins.length === 0) {
  throw new Error("Missing environment variable: BETTER_AUTH_TRUSTED_ORIGINS");
}

export const auth = betterAuth({
  plugins: [organization(), openAPI()],
  basePath: "/api/auth",
  baseURL: getEnvVariable("BETTER_AUTH_BASE_URL"),
  secret: getEnvVariable("BETTER_AUTH_SECRET"),
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: authSchema.user,
      account: authSchema.account,
      member: authSchema.member,
      invitation: authSchema.invitation,
      session: authSchema.session,
      verification: authSchema.verification,
      organization: authSchema.organization,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
});
