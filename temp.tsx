import {
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  integer,
  real,
  json,
  jsonb,
  pgEnum,
  primaryKey,
  uniqueIndex,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { createId } from "@paralleldrive/cuid2";
// ===============================
// ENUMS
// ===============================
export const userRoleEnum = pgEnum("user_role", [
  //SYSTEM ROLES
  "SYSTEM_ADMIN",
  "SYSTEM_SUPER_ADMIN",
  "SYSTEM_DEVELOPER",
  "CUSTOMER_RELATION",
  
  //USER ROLES
  "STUDENT",
  "TEACHER",
  "EDUCATION_RESEARCHER",
  "GUEST",
  "CONTENT_CREATOR",
  "GENERAL_USER",
  "LECTURER",
  "OTHER",
]);

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

// ===============================
// USER MODEL
// ===============================
export const users = pgTable("users", {
  id: text("id").primaryKey()
  .$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatar: text("avatar"),
  role: userRoleEnum("role").default("STUDENT"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  teacherApplication: one(teacherApplications, {
    fields: [users.id],
    references: [teacherApplications.userId],
  }),
  teacherProfile: one(teacherProfiles, {
    fields: [users.id],
    references: [teacherProfiles.userId],
  }),
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  payments: many(payments),
  enrollments: many(classEnrollments),
  chatSessions: many(chatSessions),
  progress: many(studentProgress),
  watchHistory: many(watchHistory),
  sentInvites: many(teacherInvites, { relationName: "SentInvites" }),
  receivedInvites: many(teacherInvites, { relationName: "ReceivedInvites" }),
  createdResources: many(educationalResources),
  createdExamPapers: many(examPapers),
  createdBooks: many(books),
  createdPastPapers: many(pastPapers),
  reviewedApplications: many(teacherApplications, {
    relationName: "ApplicationReviewer",
  }),
  createdClasses: many(classes, { relationName: "ClassCreator" }),
  exerciseSubmissions: many(exerciseSubmissions),
}));

// ===============================
// TEACHER APPLICATION MODEL
// ===============================
export const teacherApplications = pgTable("teacher_applications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id").notNull().unique(),
  status: applicationStatusEnum("status").default("PENDING"),
  credentials: json("credentials"),
  identification: json("identification"),
  qualifications: text("qualifications").notNull(),
  experience: text("experience"),
  rejectionReason: text("rejection_reason"),
  reviewedById: text("reviewed_by_id"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teacherApplicationsRelations = relations(
  teacherApplications,
  ({ one }) => ({
    user: one(users, {
      fields: [teacherApplications.userId],
      references: [users.id],
    }),
    reviewedBy: one(users, {
      fields: [teacherApplications.reviewedById],
      references: [users.id],
      relationName: "ApplicationReviewer",
    }),
  })
);

// ===============================
// TEACHER PROFILE MODEL
// ===============================
export const teacherProfiles = pgTable("teacher_profiles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id").notNull().unique(),
  bio: text("bio"),
  expertise: text("expertise"),
  qualifications: text("qualifications").notNull(),
  experience: integer("experience"),
  availabilityStatus: boolean("availability_status").default(true),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teacherProfilesRelations = relations(
  teacherProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [teacherProfiles.userId],
      references: [users.id],
    }),
    classes: many(classTeachers),
    chapters: many(chapters),
    topics: many(topics),
    lessons: many(lessons),
    levelSpecializations: many(levelSpecializations),
    subjectSpecializations: many(subjectSpecializations),
  })
);

// ===============================
// LEVEL SPECIALIZATION MODEL
// ===============================
export const levelSpecializations = pgTable(
  "level_specializations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    teacherId: text("teacher_id").notNull(),
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

export const levelSpecializationsRelations = relations(
  levelSpecializations,
  ({ one }) => ({
    teacher: one(teacherProfiles, {
      fields: [levelSpecializations.teacherId],
      references: [teacherProfiles.id],
    }),
  })
);

// ===============================
// SUBJECT SPECIALIZATION MODEL
// ===============================
export const subjectSpecializations = pgTable(
  "subject_specializations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    teacherId: text("teacher_id").notNull(),
    subjectId: text("subject_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueTeacherSubject: uniqueIndex("unique_teacher_subject").on(
      table.teacherId,
      table.subjectId
    ),
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

// ===============================
// STUDENT PROFILE MODEL
// ===============================
export const studentProfiles = pgTable("student_profiles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id").notNull().unique(),
  gradeLevel: text("grade_level"),
  level: levelTypeEnum("level"),
  interests: text("interests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const studentProfilesRelations = relations(
  studentProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [studentProfiles.userId],
      references: [users.id],
    }),
  })
);

// ===============================
// SUBJECT MODEL
// ===============================
export const subjects = pgTable("subjects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  level: levelTypeEnum("level"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
  classes: many(classSubjects),
  specializations: many(subjectSpecializations),
  chapters: many(chapters),
  examPapers: many(examPapers),
  pastPapers: many(pastPapers),
  classTeachers: many(classTeachers),
  educationalResources: many(educationalResources),
  books: many(books),
  teacherInvites: many(teacherInvites),
}));

// ===============================
// CLASS MODEL
// ===============================
export const classes = pgTable("classes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description"),
  level: levelTypeEnum("level").notNull(),
  grade: text("grade"),
  startsOn: timestamp("starts_on").notNull(),
  endsOn: timestamp("ends_on").notNull(),
  fee: real("fee").notNull(),
  enrollmentStatus:
    enrollmentStatusEnum("enrollment_status").default("STARTING_SOON"),
  publish: boolean("publish").default(false),
  frontPageAd: boolean("front_page_ad").default(false),
  advertOn: timestamp("advert_on"),
  advertEndOn: timestamp("advert_end_on"),
  prerequisite: text("prerequisite"),
  coverFileName: text("cover_file_name"),
  coverFileDir: text("cover_file_dir"),
  previewVideoUrl: text("preview_video_url"),
  createdByUserId: text("created_by_user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const classesRelations = relations(classes, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [classes.createdByUserId],
    references: [users.id],
    relationName: "ClassCreator",
  }),
  classSubjects: many(classSubjects),
  classTeachers: many(classTeachers),
  enrollments: many(classEnrollments),
  modules: many(modules),
  preview: one(classPreviews, {
    fields: [classes.id],
    references: [classPreviews.classId],
  }),
  chapters: many(chapters),
  syllabus: one(syllabus, {
    fields: [classes.id],
    references: [syllabus.classId],
  }),
  teacherInvites: many(teacherInvites),
}));

// ===============================
// CLASS SUBJECT MODEL (Join Table)
// ===============================
export const classSubjects = pgTable(
  "class_subjects",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    classId: text("class_id").notNull(),
    subjectId: text("subject_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueClassSubject: uniqueIndex("unique_class_subject").on(
      table.classId,
      table.subjectId
    ),
  })
);

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

// ===============================
// CLASS TEACHER MODEL (Join Table)
// ===============================
export const classTeachers = pgTable(
  "class_teachers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    classId: text("class_id").notNull(),
    teacherId: text("teacher_id").notNull(),
    subjectId: text("subject_id").notNull(),
    status: invitationStatusEnum("status").default("PENDING"),
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

// ===============================
// TEACHER INVITE MODEL
// ===============================
export const teacherInvites = pgTable("teacher_invites", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  classId: text("class_id").notNull(),
  senderId: text("sender_id").notNull(),
  receiverId: text("receiver_id").notNull(),
  subjectId: text("subject_id").notNull(),
  message: text("message"),
  status: invitationStatusEnum("status").default("PENDING"),
  sentAt: timestamp("sent_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teacherInvitesRelations = relations(teacherInvites, ({ one }) => ({
  class: one(classes, {
    fields: [teacherInvites.classId],
    references: [classes.id],
  }),
  sender: one(users, {
    fields: [teacherInvites.senderId],
    references: [users.id],
    relationName: "SentInvites",
  }),
  receiver: one(users, {
    fields: [teacherInvites.receiverId],
    references: [users.id],
    relationName: "ReceivedInvites",
  }),
  subject: one(subjects, {
    fields: [teacherInvites.subjectId],
    references: [subjects.id],
  }),
}));

// ===============================
// CLASS PREVIEW MODEL
// ===============================
export const classPreviews = pgTable("class_previews", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  classId: text("class_id").notNull().unique(),
  videoUrl: text("video_url"),
  description: text("description"),
  highlights: json("highlights"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const classPreviewsRelations = relations(classPreviews, ({ one }) => ({
  class: one(classes, {
    fields: [classPreviews.classId],
    references: [classes.id],
  }),
}));

// ===============================
// SYLLABUS MODEL
// ===============================
export const syllabus = pgTable("syllabus", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  classId: text("class_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const syllabusRelations = relations(syllabus, ({ one, many }) => ({
  class: one(classes, {
    fields: [syllabus.classId],
    references: [classes.id],
  }),
  chapters: many(chapters),
}));

// ===============================
// CHAPTER MODEL
// ===============================
export const chapters = pgTable(
  "chapters",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    syllabusId: text("syllabus_id"),
    classId: text("class_id").notNull(),
    subjectId: text("subject_id").notNull(),
    teacherId: text("teacher_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    chapterNumber: integer("chapter_number").notNull(),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueClassSubjectChapter: uniqueIndex("unique_class_subject_chapter").on(
      table.classId,
      table.subjectId,
      table.chapterNumber
    ),
  })
);

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

// ===============================
// TOPIC MODEL
// ===============================
export const topics = pgTable(
  "topics",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    chapterId: text("chapter_id").notNull(),
    teacherId: text("teacher_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    topicNumber: integer("topic_number").notNull(),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueChapterTopic: uniqueIndex("unique_chapter_topic").on(
      table.chapterId,
      table.topicNumber
    ),
  })
);

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

// ===============================
// LESSON MODEL
// ===============================
export const lessons = pgTable(
  "lessons",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    topicId: text("topic_id").notNull(),
    teacherId: text("teacher_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    lessonNumber: integer("lesson_number").notNull(),
    videoUrl: text("video_url"),
    duration: integer("duration"),
    orderIndex: integer("order_index").notNull(),
    briefDescription: text("brief_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    moduleId: text("module_id"),
  },
  (table) => ({
    uniqueTopicLesson: uniqueIndex("unique_topic_lesson").on(
      table.topicId,
      table.lessonNumber
    ),
  })
);

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  topic: one(topics, {
    fields: [lessons.topicId],
    references: [topics.id],
  }),
  teacher: one(teacherProfiles, {
    fields: [lessons.teacherId],
    references: [teacherProfiles.id],
  }),
  resources: many(lessonResources),
  exercises: many(exercises),
  chatSessions: many(chatSessions),
  studentProgress: many(studentProgress),
  watchHistory: many(watchHistory),
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
}));

// ===============================
// LESSON RESOURCE MODEL
// ===============================
export const lessonResources = pgTable("lesson_resources", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  lessonId: text("lesson_id").notNull(),
  title: text("title").notNull(),
  fileUrl: text("file_url").notNull(),
  type: resourceTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessonResourcesRelations = relations(
  lessonResources,
  ({ one }) => ({
    lesson: one(lessons, {
      fields: [lessonResources.lessonId],
      references: [lessons.id],
    }),
  })
);

// ===============================
// EXERCISE MODEL
// ===============================
export const exercises = pgTable("exercises", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  lessonId: text("lesson_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  questions: json("questions"),
  fileUrl: text("file_url"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [exercises.lessonId],
    references: [lessons.id],
  }),
  submissions: many(exerciseSubmissions),
}));

// ===============================
// EXERCISE SUBMISSION MODEL
// ===============================
export const exerciseSubmissions = pgTable(
  "exercise_submissions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    exerciseId: text("exercise_id").notNull(),
    studentId: text("student_id").notNull(),
    answers: json("answers"),
    fileUrl: text("file_url"),
    submittedAt: timestamp("submitted_at").defaultNow(),
    grade: real("grade"),
    feedback: text("feedback"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueExerciseStudent: uniqueIndex("unique_exercise_student").on(
      table.exerciseId,
      table.studentId
    ),
  })
);

export const exerciseSubmissionsRelations = relations(
  exerciseSubmissions,
  ({ one }) => ({
    exercise: one(exercises, {
      fields: [exerciseSubmissions.exerciseId],
      references: [exercises.id],
    }),
    student: one(users, {
      fields: [exerciseSubmissions.studentId],
      references: [users.id],
    }),
  })
);

// ===============================
// EDUCATIONAL RESOURCE MODEL
// ===============================
export const educationalResources = pgTable("educational_resources", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description"),
  type: resourceTypeEnum("type").notNull(),
  fileUrl: text("file_url").notNull(),
  price: real("price").default(0),
  subjectId: text("subject_id").notNull(),
  level: levelTypeEnum("level"),
  createdByUserId: text("created_by_user_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const educationalResourcesRelations = relations(
  educationalResources,
  ({ one }) => ({
    subject: one(subjects, {
      fields: [educationalResources.subjectId],
      references: [subjects.id],
    }),
    createdBy: one(users, {
      fields: [educationalResources.createdByUserId],
      references: [users.id],
    }),
  })
);

// ===============================
// EXAM PAPER MODEL
// ===============================
export const examPapers = pgTable("exam_papers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description"),
  subjectId: text("subject_id").notNull(),
  level: levelTypeEnum("level"),
  year: integer("year").notNull(),
  paperNumber: integer("paper_number"),
  numberOfPapers: integer("number_of_papers"),
  fileUrl: text("file_url").notNull(),
  markingSchemeUrl: text("marking_scheme_url"),
  price: real("price").default(0),
  createdByUserId: text("created_by_user_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const examPapersRelations = relations(examPapers, ({ one }) => ({
  subject: one(subjects, {
    fields: [examPapers.subjectId],
    references: [subjects.id],
  }),
  createdBy: one(users, {
    fields: [examPapers.createdByUserId],
    references: [users.id],
  }),
}));

// ===============================
// BOOK MODEL
// ===============================
export const books = pgTable("books", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  author: text("author"),
  description: text("description"),
  isbn: text("isbn"),
  subjectId: text("subject_id").notNull(),
  level: levelTypeEnum("level"),
  fileUrl: text("file_url").notNull(),
  coverImageUrl: text("cover_image_url"),
  price: real("price").default(0),
  createdByUserId: text("created_by_user_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const booksRelations = relations(books, ({ one }) => ({
  subject: one(subjects, {
    fields: [books.subjectId],
    references: [subjects.id],
  }),
  createdBy: one(users, {
    fields: [books.createdByUserId],
    references: [users.id],
  }),
}));

// ===============================
// PAST PAPER YEAR MODEL
// ===============================
export const pastPaperYears = pgTable("past_paper_years", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  year: text("year").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pastPaperYearsRelations = relations(
  pastPaperYears,
  ({ many }) => ({
    pastPapers: many(pastPapers),
  })
);

// ===============================
// PAST PAPER MODEL
// ===============================
export const pastPapers = pgTable(
  "past_papers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text("title").notNull(),
    description: text("description"),
    subjectId: text("subject_id").notNull(),
    level: levelTypeEnum("level"),
    year: integer("year").notNull(),
    paperNumber: integer("paper_number"),
    fileUrl: text("file_url").notNull(),
    createdByUserId: text("created_by_user_id").notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    pastPaperYearId: text("past_paper_year_id"),
  },
  (table) => ({
    uniqueSubjectYearPaper: uniqueIndex("unique_subject_year_paper").on(
      table.subjectId,
      table.year,
      table.paperNumber
    ),
  })
);

export const pastPapersRelations = relations(pastPapers, ({ one }) => ({
  subject: one(subjects, {
    fields: [pastPapers.subjectId],
    references: [subjects.id],
  }),
  createdBy: one(users, {
    fields: [pastPapers.createdByUserId],
    references: [users.id],
  }),
  pastPaperYear: one(pastPaperYears, {
    fields: [pastPapers.pastPaperYearId],
    references: [pastPaperYears.id],
  }),
}));

// ===============================
// CLASS ENROLLMENT MODEL
// ===============================
export const classEnrollments = pgTable(
  "class_enrollments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    studentId: text("student_id").notNull(),
    classId: text("class_id").notNull(),
    enrolledAt: timestamp("enrolled_at").defaultNow(),
    status: enrollmentStatusEnum("status").default("ACTIVE"),
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

export const classEnrollmentsRelations = relations(
  classEnrollments,
  ({ one }) => ({
    student: one(users, {
      fields: [classEnrollments.studentId],
      references: [users.id],
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

// ===============================
// PAYMENT MODEL
// ===============================
export const payments = pgTable("payments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  studentId: text("student_id").notNull(),
  enrollmentId: text("enrollment_id").unique(),
  resourceId: text("resource_id"),
  resourceType: text("resource_type"),
  amount: real("amount").notNull(),
  currency: text("currency").default("USD"),
  status: paymentStatusEnum("status").default("PENDING"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  student: one(users, {
    fields: [payments.studentId],
    references: [users.id],
  }),
  enrollment: one(classEnrollments, {
    fields: [payments.enrollmentId],
    references: [classEnrollments.id],
  }),
}));

// ===============================
// MODULE MODEL
// ===============================
export const modules = pgTable("modules", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  classId: text("class_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const modulesRelations = relations(modules, ({ one, many }) => ({
  class: one(classes, {
    fields: [modules.classId],
    references: [classes.id],
  }),
  lessons: many(lessons),
}));

// ===============================
// CHAT SESSION MODEL
// ===============================
export const chatSessions = pgTable("chat_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  studentId: text("student_id").notNull(),
  lessonId: text("lesson_id").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chatSessionsRelations = relations(
  chatSessions,
  ({ one, many }) => ({
    student: one(users, {
      fields: [chatSessions.studentId],
      references: [users.id],
    }),
    lesson: one(lessons, {
      fields: [chatSessions.lessonId],
      references: [lessons.id],
    }),
    messages: many(chatMessages),
  })
);

// ===============================
// CHAT MESSAGE MODEL
// ===============================
export const chatMessages = pgTable("chat_messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  sessionId: text("session_id").notNull(),
  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatMessages.sessionId],
    references: [chatSessions.id],
  }),
}));

// ===============================
// STUDENT PROGRESS MODEL
// ===============================
export const studentProgress = pgTable(
  "student_progress",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    studentId: text("student_id").notNull(),
    lessonId: text("lesson_id").notNull(),
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

export const studentProgressRelations = relations(
  studentProgress,
  ({ one }) => ({
    student: one(users, {
      fields: [studentProgress.studentId],
      references: [users.id],
    }),
    lesson: one(lessons, {
      fields: [studentProgress.lessonId],
      references: [lessons.id],
    }),
  })
);

// ===============================
// WATCH HISTORY MODEL
// ===============================
export const watchHistory = pgTable("watch_history", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  studentId: text("student_id").notNull(),
  lessonId: text("lesson_id").notNull(),
  watchTimeSeconds: integer("watch_time_seconds").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchHistoryRelations = relations(watchHistory, ({ one }) => ({
  student: one(users, {
    fields: [watchHistory.studentId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [watchHistory.lessonId],
    references: [lessons.id],
  }),
}));
