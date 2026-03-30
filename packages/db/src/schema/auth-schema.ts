import { relations } from "drizzle-orm";
import { boolean, index, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import {
  eventTimestamptz,
  primaryKeyColumns,
  requiredManualTimestamptz,
  requiredTimestamptz,
  timestampColumns,
} from "../helpers/base-column";
import { createTable } from "../helpers/create-table";

export const user = createTable("user", {
  ...primaryKeyColumns(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  ...timestampColumns(),
});

export const session = createTable(
  "session",
  {
    ...primaryKeyColumns(),
    expiresAt: requiredManualTimestamptz("expires_at"),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    activeOrganizationId: uuid("active_organization_id"),
    ...timestampColumns(),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = createTable(
  "account",
  {
    ...primaryKeyColumns(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: eventTimestamptz("access_token_expires_at"),
    refreshTokenExpiresAt: eventTimestamptz("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    ...timestampColumns(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = createTable(
  "verification",
  {
    ...primaryKeyColumns(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: requiredManualTimestamptz("expires_at"),
    ...timestampColumns(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const organization = createTable(
  "organization",
  {
    ...primaryKeyColumns(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),
    createdAt: requiredManualTimestamptz("created_at"),
    metadata: text("metadata"),
  },
  (table) => [uniqueIndex("organization_slug_uidx").on(table.slug)],
);

export const member = createTable(
  "member",
  {
    ...primaryKeyColumns(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").default("member").notNull(),
    createdAt: requiredManualTimestamptz("created_at"),
  },
  (table) => [
    index("member_organizationId_idx").on(table.organizationId),
    index("member_userId_idx").on(table.userId),
  ],
);

export const invitation = createTable(
  "invitation",
  {
    ...primaryKeyColumns(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    status: text("status").default("pending").notNull(),
    expiresAt: requiredManualTimestamptz("expires_at"),
    createdAt: requiredTimestamptz("created_at"),
    inviterId: uuid("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("invitation_organizationId_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  members: many(member),
  invitations: many(invitation),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));
