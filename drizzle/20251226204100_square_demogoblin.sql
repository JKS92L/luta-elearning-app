CREATE TYPE "public"."application_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."enrollment_status" AS ENUM('CLOSED', 'IN_PROGRESS', 'STARTING_SOON', 'ACTIVE', 'INACTIVE', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."level_type" AS ENUM('PRIMARY', 'JUNIOR', 'SENIOR', 'COLLEGE', 'SKILLS');--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('USER', 'ASSISTANT');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('PDF', 'VIDEO', 'IMAGE', 'LINK', 'DOCUMENT', 'EXERCISE', 'EXAM', 'BOOK');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('SYSTEM_ADMIN', 'SYSTEM_SUPER_ADMIN', 'SYSTEM_DEVELOPER', 'CUSTOMER_RELATION', 'STUDENT', 'TEACHER', 'EDUCATION_RESEARCHER', 'GUEST', 'CONTENT_CREATOR', 'GENERAL_USER', 'LECTURER', 'OTHER');--> statement-breakpoint
CREATE TABLE "books" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"description" text,
	"isbn" text,
	"subject_id" text NOT NULL,
	"level" "level_type",
	"file_url" text NOT NULL,
	"cover_image_url" text,
	"price" real DEFAULT 0,
	"created_by_user_id" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" text PRIMARY KEY NOT NULL,
	"syllabus_id" text,
	"class_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"teacher_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"chapter_number" integer NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_enrollments" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"class_id" text NOT NULL,
	"enrolled_at" timestamp DEFAULT now(),
	"status" "enrollment_status" DEFAULT 'ACTIVE',
	"selected_subjects" json,
	"duration" text,
	"payment_method" text
);
--> statement-breakpoint
CREATE TABLE "class_previews" (
	"id" text PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"video_url" text,
	"description" text,
	"highlights" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "class_previews_class_id_unique" UNIQUE("class_id")
);
--> statement-breakpoint
CREATE TABLE "class_subjects" (
	"id" text PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_teachers" (
	"id" text PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"teacher_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"status" "invitation_status" DEFAULT 'PENDING',
	"invited_at" timestamp DEFAULT now(),
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"level" "level_type" NOT NULL,
	"grade" text,
	"starts_on" timestamp NOT NULL,
	"ends_on" timestamp NOT NULL,
	"fee" real NOT NULL,
	"enrollment_status" "enrollment_status" DEFAULT 'STARTING_SOON',
	"publish" boolean DEFAULT false,
	"front_page_ad" boolean DEFAULT false,
	"advert_on" timestamp,
	"advert_end_on" timestamp,
	"prerequisite" text,
	"cover_file_name" text,
	"cover_file_dir" text,
	"preview_video_url" text,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "educational_resources" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "resource_type" NOT NULL,
	"file_url" text NOT NULL,
	"price" real DEFAULT 0,
	"subject_id" text NOT NULL,
	"level" "level_type",
	"created_by_user_id" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_papers" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"subject_id" text NOT NULL,
	"level" "level_type",
	"year" integer NOT NULL,
	"paper_number" integer,
	"number_of_papers" integer,
	"file_url" text NOT NULL,
	"marking_scheme_url" text,
	"price" real DEFAULT 0,
	"created_by_user_id" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"exercise_id" text NOT NULL,
	"student_id" text NOT NULL,
	"answers" json,
	"file_url" text,
	"submitted_at" timestamp DEFAULT now(),
	"grade" real,
	"feedback" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"questions" json,
	"file_url" text,
	"due_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_resources" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"title" text NOT NULL,
	"file_url" text NOT NULL,
	"type" "resource_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"teacher_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"lesson_number" integer NOT NULL,
	"video_url" text,
	"duration" integer,
	"order_index" integer NOT NULL,
	"brief_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"module_id" text
);
--> statement-breakpoint
CREATE TABLE "level_specializations" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"level" "level_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modules" (
	"id" text PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "past_paper_years" (
	"id" text PRIMARY KEY NOT NULL,
	"year" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "past_paper_years_year_unique" UNIQUE("year")
);
--> statement-breakpoint
CREATE TABLE "past_papers" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"subject_id" text NOT NULL,
	"level" "level_type",
	"year" integer NOT NULL,
	"paper_number" integer,
	"file_url" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"past_paper_year_id" text
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"enrollment_id" text,
	"resource_id" text,
	"resource_type" text,
	"amount" real NOT NULL,
	"currency" text DEFAULT 'USD',
	"status" "payment_status" DEFAULT 'PENDING',
	"stripe_payment_intent_id" text,
	"payment_method" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_enrollment_id_unique" UNIQUE("enrollment_id")
);
--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"grade_level" text,
	"level" "level_type",
	"interests" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "student_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "student_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"progress_percentage" real DEFAULT 0,
	"completed_at" timestamp,
	"last_watched_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subject_specializations" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"level" "level_type",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "syllabus" (
	"id" text PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "syllabus_class_id_unique" UNIQUE("class_id")
);
--> statement-breakpoint
CREATE TABLE "teacher_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"status" "application_status" DEFAULT 'PENDING',
	"credentials" json,
	"identification" json,
	"qualifications" text NOT NULL,
	"experience" text,
	"rejection_reason" text,
	"reviewed_by_id" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_applications_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "teacher_invites" (
	"id" text PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"message" text,
	"status" "invitation_status" DEFAULT 'PENDING',
	"sent_at" timestamp DEFAULT now(),
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"bio" text,
	"expertise" text,
	"qualifications" text NOT NULL,
	"experience" integer,
	"availability_status" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"chapter_id" text NOT NULL,
	"teacher_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"topic_number" integer NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatar" text,
	"role" "user_role" DEFAULT 'STUDENT',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "watch_history" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"watch_time_seconds" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_class_subject_chapter" ON "chapters" USING btree ("class_id","subject_id","chapter_number");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_student_class" ON "class_enrollments" USING btree ("student_id","class_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_class_subject" ON "class_subjects" USING btree ("class_id","subject_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_class_teacher_subject" ON "class_teachers" USING btree ("class_id","teacher_id","subject_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_exercise_student" ON "exercise_submissions" USING btree ("exercise_id","student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_topic_lesson" ON "lessons" USING btree ("topic_id","lesson_number");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_teacher_level" ON "level_specializations" USING btree ("teacher_id","level");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_subject_year_paper" ON "past_papers" USING btree ("subject_id","year","paper_number");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_student_lesson" ON "student_progress" USING btree ("student_id","lesson_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_teacher_subject" ON "subject_specializations" USING btree ("teacher_id","subject_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_chapter_topic" ON "topics" USING btree ("chapter_id","topic_number");