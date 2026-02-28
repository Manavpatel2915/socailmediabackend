import { Router } from "express";
import {
  registerUser,
  loginUser,
} from '../controller/auth-controller'
import { validate } from '../middleware/validate-middleware';
import { createUserSchema } from '../validation/user-validation';
// import { ratelimmiter } from "../middleware/ratelimiter";
const router = Router();

router.post('/register', validate(createUserSchema), registerUser);

router.post('/login', loginUser);

export default router;