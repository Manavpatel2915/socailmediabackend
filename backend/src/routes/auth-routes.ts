import { Router } from "express";
import {
    register,
    login,
} from '../controller/aurh-controller'
import { validate } from '../middleware/validate-middleware';
import { createUserSchema } from '../validation/user-validation';

const router = Router();

router.post('/register', validate(createUserSchema), register);

router.post('/login', login);

export default router;