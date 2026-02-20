import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
  deleteUserAccount,
  getUserDetailsWithPostandComment,
  updateUserProfile,
  getUser,
  allUser,
  homepage
} from '../controller/user-controller'
import { userParamsSchema, userPostCommentQuerySchema } from "../validation/params-validatiion";
import { validate } from '../middleware/validate-middleware';

const router = Router();

router.get('/', homepage);

router.get('/alluser', authenticate, allUser);

router.get('/userProfile', authenticate, getUser);

router.delete('/', authenticate, deleteUserAccount);

router.patch('/', authenticate, updateUserProfile);

router.get('/user-post-comment/:userId', authenticate, validate(userParamsSchema, 'params'), validate(userPostCommentQuerySchema, 'query'), getUserDetailsWithPostandComment);

export default router;

