import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
  deleteUser,
  getUserWithPostAndComment,
  updateUserProfile,
  getUser,
  allUser,
  userAllData,
  getNotifications,
} from '../controller/user-controller'
import { userParamsSchema, userPostCommentQuerySchema } from "../validation/params-validation";
import { validate } from '../middleware/validate-middleware';
import { rateLimiter } from "../middleware/rate-limiter";
import { getCachedData } from "../middleware/get-cached-data";
const router = Router();
//admin routes
router.get('/', authenticate, getCachedData, rateLimiter, allUser);

router.get('/userProfile', authenticate, rateLimiter, getCachedData, getUser);

router.delete('/', authenticate, deleteUser);

router.patch('/', authenticate, updateUserProfile);

router.get('/user-post-comment/:userId', authenticate, validate(userParamsSchema, 'params'), validate(userPostCommentQuerySchema, 'query'), rateLimiter, getCachedData, getUserWithPostAndComment);

router.get('/UserAllData', authenticate, rateLimiter, userAllData);

router.get('/notification', authenticate, rateLimiter, getCachedData, getNotifications);

export default router;

