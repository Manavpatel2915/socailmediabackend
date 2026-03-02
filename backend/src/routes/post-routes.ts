import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
  createNewPost,
  getPost,
  deletePostById,
  updatePostById,
  allPost,
  createPostAtSpecificTime
} from '../controller/post-controller'
import { validate } from '../middleware/validate-middleware'
import { createPostSchema } from '../validation/post-validation'
import { postParamsSchema } from '../validation/params-validation'
import upload  from "../middleware/upload";
import { rateLimiter } from "../middleware/rate-limiter";
import { getCachedData } from "../middleware/get-cached-data";

const router = Router();

router.post('/allpost', rateLimiter, getCachedData, allPost);

router.get('/:postId', validate(postParamsSchema, 'params'), rateLimiter, getCachedData, getPost);// this is correct api need auth middleware here?

router.post('/', authenticate, upload.single("image"), validate(createPostSchema, 'body'), createNewPost);

router.delete('/:postId', authenticate, validate(postParamsSchema, 'params'), deletePostById);

router.patch('/:postId', authenticate, validate(postParamsSchema, 'params'), upload.single("image"), updatePostById);

router.post('/createNewPostAtSpecificTime', authenticate, upload.single("image"), validate(createPostSchema, 'body'), createPostAtSpecificTime)
export default router;

