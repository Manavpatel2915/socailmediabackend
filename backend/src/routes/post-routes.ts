import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
    createNewPost,
    getPostDetails,
    deletePostById,
    updatePostById,
} from '../controller/post-controller'
import { validate } from '../middleware/validate-middleware'
import { createPostSchema, updatePostSchema } from '../validation/post-validation'

const router = Router();

router.post('/createpost', authenticate, validate(createPostSchema), createNewPost);

router.get('/:postid', getPostDetails);

router.delete('/:postid', authenticate, deletePostById);

router.patch('/updatepost/:postid', authenticate, validate(updatePostSchema), updatePostById);

export default router;