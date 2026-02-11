// comment-routes.ts
import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
  createComment,
  updateComment,
  deleteComment,
} from '../controller/comment-controller'
import { optionalJwt } from "../middleware/optinaljwt-middleware";

const router = Router();

router.post("/create_comment/:postId", optionalJwt, createComment);

router.patch('/update_comment/:commentId', authenticate, updateComment);

router.delete('/:id', authenticate, deleteComment);

export default router;