import { Router } from "express";
import { authenticate } from '../middleware/auth-middleware';
import {
  createPosts,
  getPost,
  deletePostById,
  updatePostById,
  allPost,
  schedulePost
} from '../controller/post-controller'
import { validate } from '../middleware/validate-middleware'
import { createPostSchema } from '../validation/post-validation'
import { postParamsSchema } from '../validation/params-validation'
import upload from "../middleware/upload";
import { rateLimiter } from "../middleware/rate-limiter";
import { getCachedData } from "../middleware/get-cached-data";

const router = Router();

router.post('/allpost', rateLimiter, getCachedData, allPost);

router.get('/:postId', validate(postParamsSchema, 'params'), rateLimiter, getCachedData, getPost);// this is correct api need auth middleware here?

router.post('/', authenticate, upload.single("image"), validate(createPostSchema, 'body'), createPosts);

router.delete('/:postId', authenticate, validate(postParamsSchema, 'params'), deletePostById);

router.patch('/:postId', authenticate, validate(postParamsSchema, 'params'), upload.single("image"), updatePostById);

router.post('/schedulePost', authenticate, upload.single("image"), validate(createPostSchema, 'body'), schedulePost)

export default router;

