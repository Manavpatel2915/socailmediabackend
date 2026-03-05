// comment-routes.ts
import { Router } from "express";
import { authenticate } from '../middleware/auth-middleware';
import {
  createComment,
  updateComment,
  deleteComment,
  getComment,
} from '../controller/comment-controller'
import { optionalJwt } from "../middleware/optional-auth-middleware";
import { postParamsSchema, commentParamsSchema } from '../validation/params-validation'
import { validate } from "../middleware/validate-middleware";
import { rateLimiter } from "../middleware/rate-limiter";
import { getCachedData } from "../middleware/get-cached-data";

const router = Router();

router.post("/:postId", optionalJwt, validate(postParamsSchema, 'params'), createComment);

router.patch('/:commentId', authenticate, validate(commentParamsSchema, 'params'), updateComment);

router.delete('/:commentId', authenticate, validate(commentParamsSchema, 'params'), deleteComment);

router.get("/:postId", authenticate, validate(postParamsSchema, 'params'), rateLimiter, getCachedData, getComment)

export default router;