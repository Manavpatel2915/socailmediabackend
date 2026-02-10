    import UserRouter from './user-routes';
    import PostRouter from './post-routes';
    import CommentRouter from './comment-routes';
    import AuthRouter from './auth-routes';

    import { Router } from "express";

    const router = Router();


    router.use('/user'/*
    #swagger.tags = ['User']*/, UserRouter);

    router.use('/post'/*
    #swagger.tags = ['Post']*/, PostRouter);

    router.use('/comment'/*
    #swagger.tags = ['Comment']*/, CommentRouter);

    router.use('/auth'/*
    #swagger.tags = ['Auth']*/, AuthRouter);


    export default router;
