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
import upload  from "../middleware/uplod";
const router = Router();

router.get('/:postId', validate(postParamsSchema, 'params'), getPost);// this is correct api need auth middleware here?

router.post('/', authenticate, upload.single("image"), validate(createPostSchema, 'body'), createNewPost);

router.delete('/:postId', authenticate, validate(postParamsSchema, 'params'), deletePostById);

router.patch('/:postId', authenticate, validate(postParamsSchema, 'params'), upload.single("image"), updatePostById);

export default router;

