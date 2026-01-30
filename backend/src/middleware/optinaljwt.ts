import passport from "passport";
import type { NextFunction, Request, Response } from "express";

const optionalJwt = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: unknown, user: Express.User | false | null | undefined) => {
      if (err) {
        return next(err as Error);
      }

      if (user) {
        req.user = user;
      }

      next();
    }
  )(req, res, next);
};

export default optionalJwt;
