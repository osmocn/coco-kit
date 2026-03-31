import { z } from "zod";
import {
  eventTimestamp,
  idSchema,
  idValueSchema,
  manualTimestamp,
  timestamps,
} from "../helpers/base-schema";

// ─── User ───────────────────────────────────────────────────────────────────

export const userSchema = z.object({
  ...idSchema(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean().default(false),
  image: z.string().nullable().optional(),
  ...timestamps(),
});

// ─── Session ─────────────────────────────────────────────────────────────────

export const sessionSchema = z.object({
  ...idSchema(),
  expiresAt: manualTimestamp(),
  token: z.string(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  userId: idValueSchema,
  activeOrganizationId: idValueSchema.nullable().optional(),
  ...timestamps(),
});

export const authSessionResponseSchema = z
  .object({
    session: sessionSchema,
    user: userSchema,
  })
  .nullable();

export type AuthSessionResponse = z.infer<typeof authSessionResponseSchema>;

// ─── Account ─────────────────────────────────────────────────────────────────

// biome-ignore lint/correctness/noUnusedVariables: <->
const accountSchema = z.object({
  ...idSchema(),
  accountId: z.string(),
  providerId: z.string(),
  userId: idValueSchema,
  accessToken: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
  idToken: z.string().nullable().optional(),
  accessTokenExpiresAt: eventTimestamp().optional(),
  refreshTokenExpiresAt: eventTimestamp().optional(),
  scope: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
  ...timestamps(),
});

// ─── Verification ─────────────────────────────────────────────────────────────

// biome-ignore lint/correctness/noUnusedVariables: <->
const verificationSchema = z.object({
  ...idSchema(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: manualTimestamp(),
  ...timestamps(),
});

// ─── Organization ─────────────────────────────────────────────────────────────

// biome-ignore lint/correctness/noUnusedVariables: <->
const organizationSchema = z.object({
  ...idSchema(),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullable().optional(),
  createdAt: manualTimestamp(),
  metadata: z.string().nullable().optional(),
});

// ─── Member ───────────────────────────────────────────────────────────────────

// biome-ignore lint/correctness/noUnusedVariables: <->
const memberSchema = z.object({
  ...idSchema(),
  organizationId: idValueSchema,
  userId: idValueSchema,
  role: z.string().default("member"),
  createdAt: manualTimestamp(),
});

// ─── Invitation ───────────────────────────────────────────────────────────────

// biome-ignore lint/correctness/noUnusedVariables: <->
const invitationSchema = z.object({
  ...idSchema(),
  organizationId: idValueSchema,
  email: z.email(),
  role: z.string().nullable().optional(),
  status: z.string().default("pending"),
  expiresAt: manualTimestamp(),
  createdAt: manualTimestamp(),
  inviterId: idValueSchema,
});
