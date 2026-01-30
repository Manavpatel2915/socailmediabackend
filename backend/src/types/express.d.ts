import type { AuthUser } from "./auth";

declare global {
  namespace Express {
    // Added by passport-jwt strategy (and optionalJwt)
    // We only rely on these fields in controllers.
    interface User extends AuthUser {}
  }
}

export {};

