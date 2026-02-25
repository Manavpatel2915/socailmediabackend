import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
  deleteUserAccount,
  getUserDetailsWithPostandComment,
  updateUserProfile,
  getUser,
  allUser,

} from '../controller/user-controller'
import { userParamsSchema, userPostCommentQuerySchema } from "../validation/params-validatiion";
import { validate } from '../middleware/validate-middleware';
import { ratelimmiter } from "../middleware/ratelimiter";
import { getCachedData } from "../middleware/getchacedata";
const router = Router();
//admin routes
router.get('/', authenticate, getCachedData, ratelimmiter, allUser);

router.get('/userProfile', authenticate, ratelimmiter, getCachedData, getUser);

router.delete('/', authenticate, deleteUserAccount);

router.patch('/', authenticate, updateUserProfile);

router.get('/user-post-comment/:userId', authenticate, validate(userParamsSchema, 'params'), validate(userPostCommentQuerySchema, 'query'), ratelimmiter, getCachedData, getUserDetailsWithPostandComment);

export default router;

