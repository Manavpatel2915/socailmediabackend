import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
  createNewPost,
  getPost,
  deletePostById,
  updatePostById,
} from '../controller/post-controller'
import { validate } from '../middleware/validate-middleware'
import { createPostSchema } from '../validation/post-validation'
import { postParamsSchema } from '../validation/params-validatiion'
const router = Router();


router.get('/:postId', validate(postParamsSchema, 'params'), getPost);// this is correct api need auth middleware here?

router.post('/', authenticate, validate(createPostSchema, 'params'), createNewPost);

router.delete('/:postId', authenticate, validate(postParamsSchema, 'params'), deletePostById);

router.patch('/:postId', authenticate, validate(postParamsSchema, 'params'), updatePostById);

export default router;

