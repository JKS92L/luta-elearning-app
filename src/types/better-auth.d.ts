import "better-auth"
import type { UserRole } from "@/db/schema"

declare module "better-auth" {
  interface User {
    role: UserRole
  }
}
