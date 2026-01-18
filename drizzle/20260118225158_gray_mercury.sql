CREATE TYPE "public"."application_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."enrollment_status" AS ENUM('CLOSED', 'IN_PROGRESS', 'STARTING_SOON', 'ACTIVE', 'INACTIVE', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."level_type" AS ENUM('PRIMARY', 'JUNIOR', 'SENIOR', 'COLLEGE', 'SKILLS');--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('USER', 'ASSISTANT');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('PDF', 'VIDEO', 'IMAGE', 'LINK', 'DOCUMENT', 'EXERCISE', 'EXAM', 'BOOK');--> statement-breakpoint
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
	"module_id" text,
	"title" text NOT NULL,
	"description" text,
	"lesson_number" integer NOT NULL,
	"video_url" text,
	"duration" integer,
	"order_index" integer NOT NULL,
	"brief_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
	"past_paper_year_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
	"created_at" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "watch_history" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"watch_time_seconds" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "account_userId_idx";--> statement-breakpoint
DROP INDEX "session_userId_idx";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'GENERAL_USER'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_syllabus_id_syllabus_id_fk" FOREIGN KEY ("syllabus_id") REFERENCES "public"."syllabus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_teacher_id_teacher_profiles_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_enrollments" ADD CONSTRAINT "class_enrollments_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_enrollments" ADD CONSTRAINT "class_enrollments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_previews" ADD CONSTRAINT "class_previews_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_teachers" ADD CONSTRAINT "class_teachers_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_teachers" ADD CONSTRAINT "class_teachers_teacher_id_teacher_profiles_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_teachers" ADD CONSTRAINT "class_teachers_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "educational_resources" ADD CONSTRAINT "educational_resources_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "educational_resources" ADD CONSTRAINT "educational_resources_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_papers" ADD CONSTRAINT "exam_papers_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_papers" ADD CONSTRAINT "exam_papers_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_submissions" ADD CONSTRAINT "exercise_submissions_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_submissions" ADD CONSTRAINT "exercise_submissions_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_resources" ADD CONSTRAINT "lesson_resources_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_teacher_id_teacher_profiles_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "level_specializations" ADD CONSTRAINT "level_specializations_teacher_id_teacher_profiles_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modules" ADD CONSTRAINT "modules_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "past_papers" ADD CONSTRAINT "past_papers_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "past_papers" ADD CONSTRAINT "past_papers_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "past_papers" ADD CONSTRAINT "past_papers_past_paper_year_id_past_paper_years_id_fk" FOREIGN KEY ("past_paper_year_id") REFERENCES "public"."past_paper_years"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_enrollment_id_class_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."class_enrollments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_progress" ADD CONSTRAINT "student_progress_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_progress" ADD CONSTRAINT "student_progress_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject_specializations" ADD CONSTRAINT "subject_specializations_teacher_id_teacher_profiles_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject_specializations" ADD CONSTRAINT "subject_specializations_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "syllabus" ADD CONSTRAINT "syllabus_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_applications" ADD CONSTRAINT "teacher_applications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_applications" ADD CONSTRAINT "teacher_applications_reviewed_by_id_user_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_invites" ADD CONSTRAINT "teacher_invites_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_invites" ADD CONSTRAINT "teacher_invites_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_invites" ADD CONSTRAINT "teacher_invites_receiver_id_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_invites" ADD CONSTRAINT "teacher_invites_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_teacher_id_teacher_profiles_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "book_subject_idx" ON "books" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "book_isbn_idx" ON "books" USING btree ("isbn");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_class_subject_chapter" ON "chapters" USING btree ("class_id","subject_id","chapter_number");--> statement-breakpoint
CREATE INDEX "chat_message_session_idx" ON "chat_messages" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "chat_message_created_at_idx" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "chat_session_student_idx" ON "chat_sessions" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "chat_session_lesson_idx" ON "chat_sessions" USING btree ("lesson_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_student_class" ON "class_enrollments" USING btree ("student_id","class_id");--> statement-breakpoint
CREATE INDEX "class_preview_class_id_idx" ON "class_previews" USING btree ("class_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_class_subject" ON "class_subjects" USING btree ("class_id","subject_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_class_teacher_subject" ON "class_teachers" USING btree ("class_id","teacher_id","subject_id");--> statement-breakpoint
CREATE INDEX "class_level_idx" ON "classes" USING btree ("level");--> statement-breakpoint
CREATE INDEX "class_enrollment_status_idx" ON "classes" USING btree ("enrollment_status");--> statement-breakpoint
CREATE INDEX "class_created_by_idx" ON "classes" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "class_starts_on_idx" ON "classes" USING btree ("starts_on");--> statement-breakpoint
CREATE INDEX "educational_resource_subject_idx" ON "educational_resources" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "educational_resource_level_idx" ON "educational_resources" USING btree ("level");--> statement-breakpoint
CREATE INDEX "educational_resource_created_by_idx" ON "educational_resources" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "exam_paper_subject_year_idx" ON "exam_papers" USING btree ("subject_id","year");--> statement-breakpoint
CREATE INDEX "exam_paper_level_idx" ON "exam_papers" USING btree ("level");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_exercise_student" ON "exercise_submissions" USING btree ("exercise_id","student_id");--> statement-breakpoint
CREATE INDEX "exercise_lesson_id_idx" ON "exercises" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_resource_lesson_id_idx" ON "lesson_resources" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_resource_type_idx" ON "lesson_resources" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_topic_lesson" ON "lessons" USING btree ("topic_id","lesson_number");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_teacher_level" ON "level_specializations" USING btree ("teacher_id","level");--> statement-breakpoint
CREATE INDEX "module_class_id_idx" ON "modules" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "module_order_idx" ON "modules" USING btree ("class_id","order_index");--> statement-breakpoint
CREATE INDEX "past_paper_year_year_idx" ON "past_paper_years" USING btree ("year");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_subject_year_paper" ON "past_papers" USING btree ("subject_id","year","paper_number");--> statement-breakpoint
CREATE INDEX "payment_student_idx" ON "payments" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "payment_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_enrollment_idx" ON "payments" USING btree ("enrollment_id");--> statement-breakpoint
CREATE INDEX "student_profile_user_id_idx" ON "student_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_student_lesson" ON "student_progress" USING btree ("student_id","lesson_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_teacher_subject" ON "subject_specializations" USING btree ("teacher_id","subject_id");--> statement-breakpoint
CREATE INDEX "subject_name_idx" ON "subjects" USING btree ("name");--> statement-breakpoint
CREATE INDEX "subject_level_idx" ON "subjects" USING btree ("level");--> statement-breakpoint
CREATE INDEX "syllabus_class_id_idx" ON "syllabus" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "teacher_application_user_id_idx" ON "teacher_applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "teacher_application_status_idx" ON "teacher_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "teacher_invite_status_idx" ON "teacher_invites" USING btree ("status");--> statement-breakpoint
CREATE INDEX "teacher_invite_receiver_idx" ON "teacher_invites" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "teacher_invite_class_idx" ON "teacher_invites" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "teacher_profile_user_id_idx" ON "teacher_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_chapter_topic" ON "topics" USING btree ("chapter_id","topic_number");--> statement-breakpoint
CREATE INDEX "watch_history_student_idx" ON "watch_history" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "watch_history_lesson_idx" ON "watch_history" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");