import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import db from "./sqldbconnnect";
import dotenv from "dotenv";

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await db.User.findByPk(payload.user_id);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
