// schema.ts
import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  integer,
  real,
  json,
  uniqueIndex,
  index,
  PgColumn,
  PgTableWithColumns,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// ===============================
// ENUMS
// ===============================
import {
  UserRole,
  LevelType,
  EnrollmentStatus,
  PaymentStatus,
  ResourceType,
  MessageRole,
  ApplicationStatus,
  InvitationStatus,
} from "./enums";

// ===============================
// ENUMS (Drizzle ORM specific)
// ===============================
function enumValues<T extends Record<string, string>>(obj: T) {
  return Object.values(obj) as [T[keyof T], ...T[keyof T][]];
}

export const userRoleEnum = pgEnum("user_role", enumValues(UserRole));
export const levelTypeEnum = pgEnum("level_type", enumValues(LevelType));
export const enrollmentStatusEnum = pgEnum(
  "enrollment_status",
  enumValues(EnrollmentStatus)
);
export const paymentStatusEnum = pgEnum(
  "payment_status",
  enumValues(PaymentStatus)
);
export const resourceTypeEnum = pgEnum(
  "resource_type",
  enumValues(ResourceType)
);
export const messageRoleEnum = pgEnum("message_role", enumValues(MessageRole));
export const applicationStatusEnum = pgEnum(
  "application_status",
  enumValues(ApplicationStatus)
);
export const invitationStatusEnum = pgEnum(
  "invitation_status",
  enumValues(InvitationStatus)
);

// ===============================
// AUTH TABLES (User Management)
// ===============================
export const user = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
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

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
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
  (table) => [index("session_user_id_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
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
  (table) => [index("account_user_id_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

// ===============================
// USER PROFILES
// ===============================
export const teacherProfiles = pgTable(
  "teacher_profiles",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    bio: text("bio"),
    expertise: text("expertise"),
    qualifications: text("qualifications").notNull(),
    experience: integer("experience"),
    availabilityStatus: boolean("availability_status").default(true),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("teacher_profile_user_id_idx").on(table.userId)]
);

export const studentProfiles = pgTable(
  "student_profiles",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    gradeLevel: text("grade_level"),
    level: levelTypeEnum("level"),
    interests: text("interests"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("student_profile_user_id_idx").on(table.userId)]
);

export const teacherApplications = pgTable(
  "teacher_applications",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    status: applicationStatusEnum("status").default(ApplicationStatus.PENDING),
    credentials: json("credentials"),
    identification: json("identification"),
    qualifications: text("qualifications").notNull(),
    experience: text("experience"),
    rejectionReason: text("rejection_reason"),
    reviewedById: text("reviewed_by_id").references(() => user.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("teacher_application_user_id_idx").on(table.userId),
    index("teacher_application_status_idx").on(table.status),
  ]
);

// ===============================
// SUBJECTS & SPECIALIZATIONS
// ===============================
export const subjects = pgTable(
  "subjects",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: text("name").notNull(),
    description: text("description"),
    category: text("category").notNull(),
    level: levelTypeEnum("level"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("subject_name_idx").on(table.name),
    index("subject_level_idx").on(table.level),
  ]
);

export const levelSpecializations = pgTable(
  "level_specializations",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => teacherProfiles.id, { onDelete: "cascade" }),
    level: levelTypeEnum("level").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueTeacherLevel: uniqueIndex("unique_teacher_level").on(
      table.teacherId,
      table.level
    ),
  })
);

export const subjectSpecializations = pgTable(
  "subject_specializations",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => teacherProfiles.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueTeacherSubject: uniqueIndex("unique_teacher_subject").on(
      table.teacherId,
      table.subjectId
    ),
  })
);

// ===============================
// CLASSES & ENROLLMENT
// ===============================
export const classes = pgTable(
  "classes",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    title: text("title").notNull(),
    description: text("description"),
    level: levelTypeEnum("level").notNull(),
    grade: text("grade"),
    startsOn: timestamp("starts_on").notNull(),
    endsOn: timestamp("ends_on").notNull(),
    fee: real("fee").notNull(),
    enrollmentStatus: enrollmentStatusEnum("enrollment_status").default(
      EnrollmentStatus.STARTING_SOON
    ),
    publish: boolean("publish").default(false),
    frontPageAd: boolean("front_page_ad").default(false),
    advertOn: timestamp("advert_on"),
    advertEndOn: timestamp("advert_end_on"),
    prerequisite: text("prerequisite"),
    coverFileName: text("cover_file_name"),
    coverFileDir: text("cover_file_dir"),
    previewVideoUrl: text("preview_video_url"),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("class_level_idx").on(table.level),
    index("class_enrollment_status_idx").on(table.enrollmentStatus),
    index("class_created_by_idx").on(table.createdByUserId),
    index("class_starts_on_idx").on(table.startsOn),
  ]
);

export const classSubjects = pgTable(
  "class_subjects",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    classId: text("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueClassSubject: uniqueIndex("unique_class_subject").on(
      table.classId,
      table.subjectId
    ),
  })
);

export const classTeachers = pgTable(
  "class_teachers",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    classId: text("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => teacherProfiles.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    status: invitationStatusEnum("status").default(InvitationStatus.PENDING),
    invitedAt: timestamp("invited_at").defaultNow(),
    respondedAt: timestamp("responded_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueClassTeacherSubject: uniqueIndex("unique_class_teacher_subject").on(
      table.classId,
      table.teacherId,
      table.subjectId
    ),
  })
);

export const teacherInvites = pgTable(
  "teacher_invites",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    classId: text("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    receiverId: text("receiver_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    message: text("message"),
    status: invitationStatusEnum("status").default(InvitationStatus.PENDING),
    sentAt: timestamp("sent_at").defaultNow(),
    respondedAt: timestamp("responded_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("teacher_invite_status_idx").on(table.status),
    index("teacher_invite_receiver_idx").on(table.receiverId),
    index("teacher_invite_class_idx").on(table.classId),
  ]
);

export const classEnrollments = pgTable(
  "class_enrollments",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    studentId: text("student_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    classId: text("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    enrolledAt: timestamp("enrolled_at").defaultNow(),
    status: enrollmentStatusEnum("status").default(EnrollmentStatus.ACTIVE),
    selectedSubjects: json("selected_subjects"),
    duration: text("duration"),
    paymentMethod: text("payment_method"),
  },
  (table) => ({
    uniqueStudentClass: uniqueIndex("unique_student_class").on(
      table.studentId,
      table.classId
    ),
  })
);

// ===============================
// COURSE STRUCTURE
// ===============================
export const syllabus = pgTable(
  "syllabus",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    classId: text("class_id")
      .notNull()
      .unique()
      .references(() => classes.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("syllabus_class_id_idx").on(table.classId)]
);

export const modules = pgTable(
  "modules",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    classId: text("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("module_class_id_idx").on(table.classId),
    index("module_order_idx").on(table.classId, table.orderIndex),
  ]
);

export const chapters = pgTable(
  "chapters",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    syllabusId: text("syllabus_id").references(() => syllabus.id, {
      onDelete: "cascade",
    }),
    classId: text("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => teacherProfiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    chapterNumber: integer("chapter_number").notNull(),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueClassSubjectChapter: uniqueIndex("unique_class_subject_chapter").on(
      table.classId,
      table.subjectId,
      table.chapterNumber
    ),
  })
);

export const topics = pgTable(
  "topics",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    chapterId: text("chapter_id")
      .notNull()
      .references(() => chapters.id, { onDelete: "cascade" }),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => teacherProfiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    topicNumber: integer("topic_number").notNull(),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueChapterTopic: uniqueIndex("unique_chapter_topic").on(
      table.chapterId,
      table.topicNumber
    ),
  })
);

export const lessons = pgTable(
  "lessons",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => teacherProfiles.id, { onDelete: "cascade" }),
    moduleId: text("module_id").references(() => modules.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    lessonNumber: integer("lesson_number").notNull(),
    videoUrl: text("video_url"),
    duration: integer("duration"),
    orderIndex: integer("order_index").notNull(),
    briefDescription: text("brief_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueTopicLesson: uniqueIndex("unique_topic_lesson").on(
      table.topicId,
      table.lessonNumber
    ),
  })
);

export const lessonResources = pgTable(
  "lesson_resources",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    fileUrl: text("file_url").notNull(),
    type: resourceTypeEnum("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("lesson_resource_lesson_id_idx").on(table.lessonId),
    index("lesson_resource_type_idx").on(table.type),
  ]
);

// ===============================
// EXERCISES & ASSESSMENTS
// ===============================
export const exercises = pgTable(
  "exercises",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    questions: json("questions"),
    fileUrl: text("file_url"),
    dueDate: timestamp("due_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("exercise_lesson_id_idx").on(table.lessonId)]
);

export const exerciseSubmissions = pgTable(
  "exercise_submissions",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    studentId: text("student_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    answers: json("answers"),
    fileUrl: text("file_url"),
    submittedAt: timestamp("submitted_at").defaultNow(),
    grade: real("grade"),
    feedback: text("feedback"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueExerciseStudent: uniqueIndex("unique_exercise_student").on(
      table.exerciseId,
      table.studentId
    ),
  })
);

// ===============================
// EDUCATIONAL RESOURCES
// ===============================
export const educationalResources = pgTable(
  "educational_resources",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    title: text("title").notNull(),
    description: text("description"),
    type: resourceTypeEnum("type").notNull(),
    fileUrl: text("file_url").notNull(),
    price: real("price").default(0),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    level: levelTypeEnum("level"),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("educational_resource_subject_idx").on(table.subjectId),
    index("educational_resource_level_idx").on(table.level),
    index("educational_resource_created_by_idx").on(table.createdByUserId),
  ]
);

export const examPapers = pgTable(
  "exam_papers",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    title: text("title").notNull(),
    description: text("description"),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    level: levelTypeEnum("level"),
    year: integer("year").notNull(),
    paperNumber: integer("paper_number"),
    numberOfPapers: integer("number_of_papers"),
    fileUrl: text("file_url").notNull(),
    markingSchemeUrl: text("marking_scheme_url"),
    price: real("price").default(0),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("exam_paper_subject_year_idx").on(table.subjectId, table.year),
    index("exam_paper_level_idx").on(table.level),
  ]
);

export const books = pgTable(
  "books",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    title: text("title").notNull(),
    author: text("author"),
    description: text("description"),
    isbn: text("isbn"),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    level: levelTypeEnum("level"),
    fileUrl: text("file_url").notNull(),
    coverImageUrl: text("cover_image_url"),
    price: real("price").default(0),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("book_subject_idx").on(table.subjectId),
    index("book_isbn_idx").on(table.isbn),
  ]
);

// ===============================
// PAST PAPERS
// ===============================
export const pastPaperYears = pgTable(
  "past_paper_years",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    year: text("year").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("past_paper_year_year_idx").on(table.year)]
);

export const pastPapers = pgTable(
  "past_papers",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    title: text("title").notNull(),
    description: text("description"),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    level: levelTypeEnum("level"),
    year: integer("year").notNull(),
    paperNumber: integer("paper_number"),
    fileUrl: text("file_url").notNull(),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    isActive: boolean("is_active").default(true),
    pastPaperYearId: text("past_paper_year_id").references(
      () => pastPaperYears.id,
      { onDelete: "set null" }
    ),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueSubjectYearPaper: uniqueIndex("unique_subject_year_paper").on(
      table.subjectId,
      table.year,
      table.paperNumber
    ),
  })
);

// ===============================
// PAYMENTS
// ===============================
export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    studentId: text("student_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    enrollmentId: text("enrollment_id").references(() => classEnrollments.id, {
      onDelete: "set null",
    }),
    resourceId: text("resource_id"),
    resourceType: text("resource_type"),
    amount: real("amount").notNull(),
    currency: text("currency").default("USD"),
    status: paymentStatusEnum("status").default(PaymentStatus.PENDING),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    paymentMethod: text("payment_method"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("payment_student_idx").on(table.studentId),
    index("payment_status_idx").on(table.status),
    index("payment_enrollment_idx").on(table.enrollmentId),
  ]
);

// ===============================
// CLASS PREVIEWS
// ===============================
export const classPreviews = pgTable(
  "class_previews",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    classId: text("class_id")
      .notNull()
      .unique()
      .references(() => classes.id, { onDelete: "cascade" }),
    videoUrl: text("video_url"),
    description: text("description"),
    highlights: json("highlights"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("class_preview_class_id_idx").on(table.classId)]
);

// ===============================
// LEARNING ANALYTICS
// ===============================
export const studentProgress = pgTable(
  "student_progress",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    studentId: text("student_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    progressPercentage: real("progress_percentage").default(0),
    completedAt: timestamp("completed_at"),
    lastWatchedAt: timestamp("last_watched_at").defaultNow(),
  },
  (table) => ({
    uniqueStudentLesson: uniqueIndex("unique_student_lesson").on(
      table.studentId,
      table.lessonId
    ),
  })
);

export const watchHistory = pgTable(
  "watch_history",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    studentId: text("student_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    watchTimeSeconds: integer("watch_time_seconds").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("watch_history_student_idx").on(table.studentId),
    index("watch_history_lesson_idx").on(table.lessonId),
  ]
);

// ===============================
// CHAT & COMMUNICATION
// ===============================
export const chatSessions = pgTable(
  "chat_sessions",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    studentId: text("student_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("chat_session_student_idx").on(table.studentId),
    index("chat_session_lesson_idx").on(table.lessonId),
  ]
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    sessionId: text("session_id")
      .notNull()
      .references(() => chatSessions.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    metadata: json("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("chat_message_session_idx").on(table.sessionId),
    index("chat_message_created_at_idx").on(table.createdAt),
  ]
);

// ===============================
// RELATIONS
// ===============================
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),

  teacherProfile: many(teacherProfiles),
  studentProfile: one(studentProfiles),

  teacherApplications: many(teacherApplications),

  reviewedApplications: many(teacherApplications, {
    relationName: "applicationReviewer",
  }),
  createdClasses: many(classes, { relationName: "classCreator" }),
  payments: many(payments),
  enrollments: many(classEnrollments),
  exerciseSubmissions: many(exerciseSubmissions),
  chatSessions: many(chatSessions),
  studentProgress: many(studentProgress),
  watchHistory: many(watchHistory),
  sentInvites: many(teacherInvites, { relationName: "sentInvites" }),
  receivedInvites: many(teacherInvites, { relationName: "receivedInvites" }),
  createdResources: many(educationalResources),
  createdExamPapers: many(examPapers),
  createdBooks: many(books),
  createdPastPapers: many(pastPapers),
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

export const teacherProfilesRelations = relations(
  teacherProfiles,
  ({ one, many }) => ({
    user: one(user, {
      fields: [teacherProfiles.userId],
      references: [user.id],
    }),
    applications: many(teacherApplications),
    levelSpecializations: many(levelSpecializations),
    subjectSpecializations: many(subjectSpecializations),
    classes: many(classTeachers),
    chapters: many(chapters),
    topics: many(topics),
    lessons: many(lessons),
  })
);

export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  user: one(user, {
    fields: [studentProfiles.userId],
    references: [user.id],
  }),
}));

export const teacherApplicationsRelations = relations(
  teacherApplications,
  ({ one }) => ({
    user: one(user, {
      fields: [teacherApplications.userId],
      references: [user.id],
    }),
    reviewedBy: one(user, {
      fields: [teacherApplications.reviewedById],
      references: [user.id],
      relationName: "applicationReviewer",
    }),
  })
);

export const subjectsRelations = relations(subjects, ({ many }) => ({
  classSubjects: many(classSubjects),
  specializations: many(subjectSpecializations),
  chapters: many(chapters),
  educationalResources: many(educationalResources),
  examPapers: many(examPapers),
  books: many(books),
  pastPapers: many(pastPapers),
  classTeachers: many(classTeachers),
  teacherInvites: many(teacherInvites),
}));

export const levelSpecializationsRelations = relations(
  levelSpecializations,
  ({ one }) => ({
    teacher: one(teacherProfiles, {
      fields: [levelSpecializations.teacherId],
      references: [teacherProfiles.id],
    }),
  })
);

export const subjectSpecializationsRelations = relations(
  subjectSpecializations,
  ({ one }) => ({
    teacher: one(teacherProfiles, {
      fields: [subjectSpecializations.teacherId],
      references: [teacherProfiles.id],
    }),
    subject: one(subjects, {
      fields: [subjectSpecializations.subjectId],
      references: [subjects.id],
    }),
  })
);

export const classesRelations = relations(classes, ({ one, many }) => ({
  createdBy: one(user, {
    fields: [classes.createdByUserId],
    references: [user.id],
    relationName: "classCreator",
  }),
  subjects: many(classSubjects),
  teachers: many(classTeachers),
  enrollments: many(classEnrollments),
  modules: many(modules),
  syllabus: one(syllabus),
  preview: one(classPreviews),
  teacherInvites: many(teacherInvites),
  chapters: many(chapters),
}));

export const classSubjectsRelations = relations(classSubjects, ({ one }) => ({
  class: one(classes, {
    fields: [classSubjects.classId],
    references: [classes.id],
  }),
  subject: one(subjects, {
    fields: [classSubjects.subjectId],
    references: [subjects.id],
  }),
}));

export const classTeachersRelations = relations(classTeachers, ({ one }) => ({
  class: one(classes, {
    fields: [classTeachers.classId],
    references: [classes.id],
  }),
  teacher: one(teacherProfiles, {
    fields: [classTeachers.teacherId],
    references: [teacherProfiles.id],
  }),
  subject: one(subjects, {
    fields: [classTeachers.subjectId],
    references: [subjects.id],
  }),
}));

export const teacherInvitesRelations = relations(teacherInvites, ({ one }) => ({
  class: one(classes, {
    fields: [teacherInvites.classId],
    references: [classes.id],
  }),
  sender: one(user, {
    fields: [teacherInvites.senderId],
    references: [user.id],
    relationName: "sentInvites",
  }),
  receiver: one(user, {
    fields: [teacherInvites.receiverId],
    references: [user.id],
    relationName: "receivedInvites",
  }),
  subject: one(subjects, {
    fields: [teacherInvites.subjectId],
    references: [subjects.id],
  }),
}));

export const classEnrollmentsRelations = relations(
  classEnrollments,
  ({ one }) => ({
    student: one(user, {
      fields: [classEnrollments.studentId],
      references: [user.id],
    }),
    class: one(classes, {
      fields: [classEnrollments.classId],
      references: [classes.id],
    }),
    payment: one(payments, {
      fields: [classEnrollments.id],
      references: [payments.enrollmentId],
    }),
  })
);

export const syllabusRelations = relations(syllabus, ({ one, many }) => ({
  class: one(classes, {
    fields: [syllabus.classId],
    references: [classes.id],
  }),
  chapters: many(chapters),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  class: one(classes, {
    fields: [modules.classId],
    references: [classes.id],
  }),
  lessons: many(lessons),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  syllabus: one(syllabus, {
    fields: [chapters.syllabusId],
    references: [syllabus.id],
  }),
  class: one(classes, {
    fields: [chapters.classId],
    references: [classes.id],
  }),
  subject: one(subjects, {
    fields: [chapters.subjectId],
    references: [subjects.id],
  }),
  teacher: one(teacherProfiles, {
    fields: [chapters.teacherId],
    references: [teacherProfiles.id],
  }),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [topics.chapterId],
    references: [chapters.id],
  }),
  teacher: one(teacherProfiles, {
    fields: [topics.teacherId],
    references: [teacherProfiles.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  topic: one(topics, {
    fields: [lessons.topicId],
    references: [topics.id],
  }),
  teacher: one(teacherProfiles, {
    fields: [lessons.teacherId],
    references: [teacherProfiles.id],
  }),
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  resources: many(lessonResources),
  exercises: many(exercises),
  chatSessions: many(chatSessions),
  studentProgress: many(studentProgress),
  watchHistory: many(watchHistory),
}));

export const lessonResourcesRelations = relations(lessonResources, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonResources.lessonId],
    references: [lessons.id],
  }),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [exercises.lessonId],
    references: [lessons.id],
  }),
  submissions: many(exerciseSubmissions),
}));

export const exerciseSubmissionsRelations = relations(
  exerciseSubmissions,
  ({ one }) => ({
    exercise: one(exercises, {
      fields: [exerciseSubmissions.exerciseId],
      references: [exercises.id],
    }),
    student: one(user, {
      fields: [exerciseSubmissions.studentId],
      references: [user.id],
    }),
  })
);

export const educationalResourcesRelations = relations(
  educationalResources,
  ({ one }) => ({
    subject: one(subjects, {
      fields: [educationalResources.subjectId],
      references: [subjects.id],
    }),
    createdBy: one(user, {
      fields: [educationalResources.createdByUserId],
      references: [user.id],
    }),
  })
);

export const examPapersRelations = relations(examPapers, ({ one }) => ({
  subject: one(subjects, {
    fields: [examPapers.subjectId],
    references: [subjects.id],
  }),
  createdBy: one(user, {
    fields: [examPapers.createdByUserId],
    references: [user.id],
  }),
}));

export const booksRelations = relations(books, ({ one }) => ({
  subject: one(subjects, {
    fields: [books.subjectId],
    references: [subjects.id],
  }),
  createdBy: one(user, {
    fields: [books.createdByUserId],
    references: [user.id],
  }),
}));

export const pastPaperYearsRelations = relations(pastPaperYears, ({ many }) => ({
  pastPapers: many(pastPapers),
}));

export const pastPapersRelations = relations(pastPapers, ({ one }) => ({
  subject: one(subjects, {
    fields: [pastPapers.subjectId],
    references: [subjects.id],
  }),
  createdBy: one(user, {
    fields: [pastPapers.createdByUserId],
    references: [user.id],
  }),
  pastPaperYear: one(pastPaperYears, {
    fields: [pastPapers.pastPaperYearId],
    references: [pastPaperYears.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  student: one(user, {
    fields: [payments.studentId],
    references: [user.id],
  }),
  enrollment: one(classEnrollments, {
    fields: [payments.enrollmentId],
    references: [classEnrollments.id],
  }),
}));

export const classPreviewsRelations = relations(classPreviews, ({ one }) => ({
  class: one(classes, {
    fields: [classPreviews.classId],
    references: [classes.id],
  }),
}));

export const studentProgressRelations = relations(studentProgress, ({ one }) => ({
  student: one(user, {
    fields: [studentProgress.studentId],
    references: [user.id],
  }),
  lesson: one(lessons, {
    fields: [studentProgress.lessonId],
    references: [lessons.id],
  }),
}));

export const watchHistoryRelations = relations(watchHistory, ({ one }) => ({
  student: one(user, {
    fields: [watchHistory.studentId],
    references: [user.id],
  }),
  lesson: one(lessons, {
    fields: [watchHistory.lessonId],
    references: [lessons.id],
  }),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  student: one(user, {
    fields: [chatSessions.studentId],
    references: [user.id],
  }),
  lesson: one(lessons, {
    fields: [chatSessions.lessonId],
    references: [lessons.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatMessages.sessionId],
    references: [chatSessions.id],
  }),
}));

function one(studentProfiles: PgTableWithColumns<{ name: "student_profiles"; schema: undefined; columns: { id: PgColumn<{ name: "id"; tableName: "student_profiles"; dataType: "string"; columnType: "PgText"; data: string; driverParam: string; notNull: true; hasDefault: true; isPrimaryKey: true; isAutoincrement: false; hasRuntimeDefault: true; enumValues: [string, ...string[]]; baseColumn: never; identity: undefined; generated: undefined; }, {}, {}>; userId: PgColumn<{ name: "user_id"; tableName: "student_profiles"; dataType: "string"; columnType: "PgText"; data: string; driverParam: string; notNull: true; hasDefault: false; isPrimaryKey: false; isAutoincrement: false; hasRuntimeDefault: false; enumValues: [string, ...string[]]; baseColumn: never; identity: undefined; generated: undefined; }, {}, {}>; gradeLevel: PgColumn<{ name: "grade_level"; tableName: "student_profiles"; dataType: "string"; columnType: "PgText"; data: string; driverParam: string; notNull: false; hasDefault: false; isPrimaryKey: false; isAutoincrement: false; hasRuntimeDefault: false; enumValues: [string, ...string[]]; baseColumn: never; identity: undefined; generated: undefined; }, {}, {}>; level: PgColumn<{ name: "level"; tableName: "student_profiles"; dataType: "string"; columnType: "PgEnumColumn"; data: "PRIMARY" | "JUNIOR" | "SENIOR" | "COLLEGE" | "SKILLS"; driverParam: string; notNull: false; hasDefault: false; isPrimaryKey: false; isAutoincrement: false; hasRuntimeDefault: false; enumValues: ["PRIMARY" | "JUNIOR" | "SENIOR" | "COLLEGE" | "SKILLS", ...("PRIMARY" | "JUNIOR" | "SENIOR" | "COLLEGE" | "SKILLS")[]]; baseColumn: never; identity: undefined; generated: undefined; }, {}, {}>; interests: PgColumn<{ name: "interests"; tableName: "student_profiles"; dataType: "string"; columnType: "PgText"; data: string; driverParam: string; notNull: false; hasDefault: false; isPrimaryKey: false; isAutoincrement: false; hasRuntimeDefault: false; enumValues: [string, ...string[]]; baseColumn: never; identity: undefined; generated: undefined; }, {}, {}>; createdAt: PgColumn<{ name: "created_at"; tableName: "student_profiles"; dataType: "date"; columnType: "PgTimestamp"; data: Date; driverParam: string; notNull: true; hasDefault: true; isPrimaryKey: false; isAutoincrement: false; hasRuntimeDefault: false; enumValues: undefined; baseColumn: never; identity: undefined; generated: undefined; }, {}, {}>; updatedAt: PgColumn<{ name: "updated_at"; tableName: "student_profiles"; dataType: "date"; columnType: "PgTimestamp"; data: Date; driverParam: string; notNull: true; hasDefault: true; isPrimaryKey: false; isAutoincrement: false; hasRuntimeDefault: false; enumValues: undefined; baseColumn: never; identity: undefined; generated: undefined; }, {}, {}>; }; dialect: "pg"; }>): any {
  throw new Error("Function not implemented.");
}
