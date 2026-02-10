import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
    creatpost,
    getpost,
    deletepost,
    updatepost,
} from '../controller/post-controller'
import { validate } from '../middleware/validate-middleware'
import { createPostSchema, updatePostSchema } from '../validation/post-validation'


const router = Router();

router.post('/createpost'/*
    #swagger.tags = ['Post']*/, authenticate, validate(createPostSchema), creatpost);

router.get('/:postid'/*
    #swagger.tags = ['Post']*/, getpost);


router.get('/delete/:postid'/*
    #swagger.tags = ['Post']*/, authenticate, deletepost);

router.patch('/updatepost/:postid'/*
    #swagger.tags = ['Post']*/, authenticate, validate(updatePostSchema), updatepost);


export default router;
