// comment-routes.ts
import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
  createComment,
  updateComment,
  deleteComment,
} from '../controller/comment-controller'
import { optionalJwt } from "../middleware/optinaljwt-middleware";
import { postParamsSchema, commentParamsSchema } from '../validation/params-validatiion'
import { validate } from "../middleware/validate-middleware";

const router = Router();

router.post("/:postId", optionalJwt, validate(postParamsSchema, 'params'), createComment);

router.patch('/:commentId', authenticate, validate(commentParamsSchema, 'params'), updateComment);

router.delete('/:commentId', authenticate, validate(commentParamsSchema, 'params'), deleteComment);

export default router;