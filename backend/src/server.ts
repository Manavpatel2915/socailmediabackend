import express from 'express';
import passport from "passport";
import "./config/passport";
import type { Request, Response } from 'express';
import connectdb from './config/connectdb'
import UserRoutes from './routes/UserRoutes';
import PostRoutes from './routes/PostRoutes';
import CommentRoutes from './routes/CommentRoutes';

const app = express();
const PORT = process.env.PORT || 3306;

// Initialize database connections before starting server
(async () => {
  try {
    await connectdb();
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(passport.initialize());
    app.use('/user', UserRoutes);
    app.use('/post', PostRoutes);
    app.use('/comment', CommentRoutes);

    app.get('/', (req: Request, res: Response) => {
      res.send('hello');
    });

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
})();



