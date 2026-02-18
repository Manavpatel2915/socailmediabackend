import { Router } from "express";
import {
  registerUser,
  loginUser,
} from '../controller/auth-controller'
import { validate } from '../middleware/validate-middleware';
import { createUserSchema } from '../validation/user-validation';

const router = Router();

router.post('/register', validate(createUserSchema), registerUser);
router.post('/login', loginUser);

export default router;