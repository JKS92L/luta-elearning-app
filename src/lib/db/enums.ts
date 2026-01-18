// ===============================
// TYPE-SAFE ENUMS
// ===============================

export const UserRole = {
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  SYSTEM_SUPER_ADMIN: "SYSTEM_SUPER_ADMIN",
  SYSTEM_DEVELOPER: "SYSTEM_DEVELOPER",
  CUSTOMER_RELATION: "CUSTOMER_RELATION",
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  EDUCATION_RESEARCHER: "EDUCATION_RESEARCHER",
  GUEST: "GUEST",
  CONTENT_CREATOR: "CONTENT_CREATOR",
  GENERAL_USER: "GENERAL_USER",
  LECTURER: "LECTURER",
  OTHER: "OTHER",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const LevelType = {
  PRIMARY: "PRIMARY",
  JUNIOR: "JUNIOR",
  SENIOR: "SENIOR",
  COLLEGE: "COLLEGE",
  SKILLS: "SKILLS",
} as const;

export type LevelType = typeof LevelType[keyof typeof LevelType];

export const EnrollmentStatus = {
  CLOSED: "CLOSED",
  IN_PROGRESS: "IN_PROGRESS",
  STARTING_SOON: "STARTING_SOON",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  COMPLETED: "COMPLETED",
} as const;

export type EnrollmentStatus = typeof EnrollmentStatus[keyof typeof EnrollmentStatus];

export const PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const ResourceType = {
  PDF: "PDF",
  VIDEO: "VIDEO",
  IMAGE: "IMAGE",
  LINK: "LINK",
  DOCUMENT: "DOCUMENT",
  EXERCISE: "EXERCISE",
  EXAM: "EXAM",
  BOOK: "BOOK",
} as const;

export type ResourceType = typeof ResourceType[keyof typeof ResourceType];

export const MessageRole = {
  USER: "USER",
  ASSISTANT: "ASSISTANT",
} as const;

export type MessageRole = typeof MessageRole[keyof typeof MessageRole];

export const ApplicationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export const InvitationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

export type InvitationStatus = typeof InvitationStatus[keyof typeof InvitationStatus];

// ===============================
// HELPER TYPES
// ===============================

export type SystemRole = 
  | typeof UserRole.SYSTEM_ADMIN
  | typeof UserRole.SYSTEM_SUPER_ADMIN
  | typeof UserRole.SYSTEM_DEVELOPER
  | typeof UserRole.CUSTOMER_RELATION;

export type StudentRole = typeof UserRole.STUDENT;
export type TeacherRole = typeof UserRole.TEACHER;

// ===============================
// VALIDATION FUNCTIONS
// ===============================

export function isValidUserRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}

export function isSystemRole(role: UserRole): role is SystemRole {
  return [
    UserRole.SYSTEM_ADMIN,
    UserRole.SYSTEM_SUPER_ADMIN,
    UserRole.SYSTEM_DEVELOPER,
    UserRole.CUSTOMER_RELATION,
  ].includes(role as SystemRole);
}

export function isTeacherRole(role: UserRole): role is TeacherRole {
  return role === UserRole.TEACHER;
}

export function isStudentRole(role: UserRole): role is StudentRole {
  return role === UserRole.STUDENT;
}