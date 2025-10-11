export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "STUDENT" | "TEACHER" | "ADMIN"| "GUEST" | "CONTENT_CREATOR" | "GENERAL_USER";
}

export interface Class {
  id: string;
  name: string;
  description: string;
  price: number;
  subject: Subject;
  teacher: TeacherProfile;
  modules: Module[];
  enrollmentCount: number;
}

export interface TeacherProfile {
  id: string;
  name: string;
  bio: string;
  // Add other relevant fields
}
export interface Subject {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  orderIndex: number;
  progress?: StudentProgress;
}

export interface StudentProgress {
  progressPercentage: number;
  completedAt?: Date;
  lastWatchedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
