import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
  deleteUserAccount,
  getUserDetailsWithPostandComment,
  updateUserProfile,
  getUser,
  allUser
} from '../controller/user-controller'
import { userParamsSchema, userPostCommentQuerySchema } from "../validation/params-validatiion";
import { validate } from '../middleware/validate-middleware';

const router = Router();

router.get('/', authenticate, allUser);

router.get('/userProfile', authenticate, getUser);//need to give id here like userid?

router.delete('/', authenticate, deleteUserAccount);//need to give id user ?

router.patch('/', authenticate, updateUserProfile);//need to give id user here???????

router.get('/user-post-comment/:userId', authenticate, validate(userParamsSchema, 'params'), validate(userPostCommentQuerySchema, 'query'), getUserDetailsWithPostandComment);

export default router;