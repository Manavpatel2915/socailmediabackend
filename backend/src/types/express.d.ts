import type { AuthUser } from "./auth";

declare global {
  namespace Express {
    // Added by passport-jwt strategy (and optionalJwt).
    // Declare the fields we read in controllers.
    interface User {
      user_id: AuthUser["user_id"];
      role: AuthUser["role"];
    }
  }
}

export {};

