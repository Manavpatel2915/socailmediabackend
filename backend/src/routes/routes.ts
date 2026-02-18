import userRouter from './user-routes';
import postRouter from './post-routes';
import commentRouter from './comment-routes';
import authRouter from './auth-routes';

import { Router } from "express";

const router = Router();

router.use('/user'/*
    #swagger.tags = ['User']*/, userRouter);

router.use('/post'/*
    #swagger.tags = ['Post']*/, postRouter);

router.use('/comment'/*
    #swagger.tags = ['Comment']*/, commentRouter);

router.use('/auth'/*
    #swagger.tags = ['Auth']*/, authRouter);

export default router;
