// schema.ts
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// ===============================
// ENUMS
// ===============================

// User roles enum
export const UserRole = {
  SYS_ADMIN: "SYS_ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  EDUCATION_RESEARCHER: "EDUCATION_RESEARCHER",
  LECTURER: "LECTURER",
  GENERAL_USER: "GENERAL_USER",
  CONTENT_CREATOR: "CONTENT_CREATOR",
  CLASS_LEAD: "CLASS_LEAD",
  SYSTEM_DEVELOPER: "SYSTEM_DEVELOPER",
  CUSTOMER_RELATION: "CUSTOMER_RELATION",
} as const;

// Level types enum
export const LevelType = {
  PRIMARY: "PRIMARY",
  JUNIOR: "JUNIOR",
  SENIOR: "SENIOR",
  COLLEGE: "COLLEGE",
  SKILLS: "SKILLS",
} as const;

// Curriculum types enum
export const CurriculumType = {
  COMPETENCE_BASED_OUTCOME: "COMPETENCE_BASED_OUTCOME",
  OBJECTIVE_BASED_OUTCOME: "OBJECTIVE_BASED_OUTCOME",
} as const;

// Create drizzle enums from our TypeScript enums
function enumValues<T extends Record<string, string>>(obj: T) {
  return Object.values(obj) as [T[keyof T], ...T[keyof T][]];
}

export const userRoleEnum = pgEnum("user_role", enumValues(UserRole));
export const levelTypeEnum = pgEnum("level_type", enumValues(LevelType));
export const curriculumTypeEnum = pgEnum("curriculum_type", enumValues(CurriculumType));

// ===============================
// BETTER-AUTH CORE TABLES (UPDATED)
// ===============================

// 1. USER TABLE - Add role field
export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").notNull().default(UserRole.GENERAL_USER),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// 2. SESSION TABLE (Keep as is)
export const session = pgTable(
  "session",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

// 3. ACCOUNT TABLE (Keep as is)
export const account = pgTable(
  "account",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
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
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

// 4. VERIFICATION TABLE (Keep as is)
export const verification = pgTable(
  "verification",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ===============================
// SUBJECTS TABLE (UPDATED)
// ===============================

export const subjects = pgTable(
  "subjects",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    short_tag: text("short_tag").notNull(), // Changed to text for short_tag
    code: text("code").notNull().unique(),
    curriculum_type: curriculumTypeEnum("curriculum_type"), // Changed from description to curriculum_type
    category: text("category").notNull(),
    level: levelTypeEnum("level"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    shortTagIdx: uniqueIndex("short_tag_idx").on(table.short_tag),
    codeIdx: uniqueIndex("code_idx").on(table.code),
  })
);

// ===============================
// BASIC RELATIONS
// ===============================

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

// Subject relations (simple for now)
export const subjectsRelations = relations(subjects, () => ({
  // We'll add more relations as we add more tables
}));

// ===============================
// EXPORT TYPES
// ===============================

// Export TypeScript types
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export type LevelTypeType = (typeof LevelType)[keyof typeof LevelType];
export type CurriculumTypeType = (typeof CurriculumType)[keyof typeof CurriculumType];
export type User = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = typeof subjects.$inferInsert;