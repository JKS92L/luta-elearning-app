import { relations } from "drizzle-orm";
import { pgTable,pgEnum, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

// ===============================
// ENUMS
// ===============================

export const userRoleEnum = pgEnum("user_role", [
  // SYSTEM ROLES
  "SYSTEM_ADMIN",
  "SYSTEM_SUPER_ADMIN",
  "SYSTEM_DEVELOPER",
  "CUSTOMER_RELATION",

  // USER ROLES
  "STUDENT",
  "TEACHER",
  "EDUCATION_RESEARCHER",
  "GUEST",
  "CONTENT_CREATOR",
  "GENERAL_USER",
  "LECTURER",
  "OTHER",
]);
export type UserRole = (typeof userRoleEnum.enumValues)[number]


export const levelTypeEnum = pgEnum("level_type", [
  "PRIMARY",
  "JUNIOR",
  "SENIOR",
  "COLLEGE",
  "SKILLS",
]);

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "CLOSED",
  "IN_PROGRESS",
  "STARTING_SOON",
  "ACTIVE",
  "INACTIVE",
  "COMPLETED",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
]);

export const resourceTypeEnum = pgEnum("resource_type", [
  "PDF",
  "VIDEO",
  "IMAGE",
  "LINK",
  "DOCUMENT",
  "EXERCISE",
  "EXAM",
  "BOOK",
]);

export const messageRoleEnum = pgEnum("message_role", ["USER", "ASSISTANT"]);

export const applicationStatusEnum = pgEnum("application_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const invitationStatusEnum = pgEnum("invitation_status", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
]);


export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),

  // ✅ NEW COLUMN
  role: userRoleEnum("role")
  .notNull()
  .default("GENERAL_USER"),

  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
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
