// // src/lib/auth/types.ts
// import { auth } from "@/lib/auth";

// // Extend Better Auth session types
// declare module "better-auth" {
//   interface User {
//     role: string; // or use your specific type: "ADMIN" | "TEACHER" | "STUDENT" | etc.
//   }
// }

// // Or if you want more specific typing
// declare module "better-auth" {
//   interface User {
//     role: 
//       | "SYS_ADMIN"
//       | "TEACHER"
//       | "STUDENT"
//       | "EDUCATION_RESEARCHER"
//       | "LECTURER"
//       | "GENERAL_USER"
//       | "CONTENT_CREATOR"
//       | "CLASS_LEAD"
//       | "SYSTEM_DEVELOPER"
//       | "CUSTOMER_RELATION";
//   }
// }