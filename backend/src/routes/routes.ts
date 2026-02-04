import UserRouter from './user-routes';
import PostRouter from './post-routes';
import CommentRouter from './comment-routes';

import { Router } from "express";

const router = Router();


router.use('/user', UserRouter);
router.use('/post', PostRouter);
router.use('/comment', CommentRouter);

export default router;
