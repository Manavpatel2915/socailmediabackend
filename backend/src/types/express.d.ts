import type { AuthUser } from "./auth";

declare global {
  namespace Express {
    interface User {
      user_id: AuthUser["user_id"];
      role: AuthUser["role"];
    }
  }
}

export {};

