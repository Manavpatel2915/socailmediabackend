import express from 'express';
import passport from "passport";
import "./middleware/passport-middleware";
import type { Request, Response } from 'express';
import connectdb from './config/connectdb'
import UserRoutes from './routes/user-routes';
import PostRoutes from './routes/post-routes';
import CommentRoutes from './routes/comment-routes';
import { morganMongoLogger } from "./middleware/morgan-logger-middleware";
import { errorHandler } from "./middleware/error-handler-midddleware";
import routes from "./routes/routes";
const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectdb();
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morganMongoLogger);
    app.use(passport.initialize());
   
    app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    });
    app.use('/',routes);
    
    app.use(errorHandler);

    

  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
})();



