import passport from "passport"; 

const optionalJwt = (req: any, res: any, next: any) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: any) => {
      if (err) {
        return next(err);
      }

      if (user) {
        req.user = user; 
      }

      next();
    }
  )(req, res, next);
};

export default optionalJwt;
