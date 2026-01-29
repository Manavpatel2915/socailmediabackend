import { Router } from "express";
import passport from "passport";
import {
    register,
    login,
    deleteuser,
} from '../controller/UserController'
import { validate } from '../middleware/validatemiddleware';
import { createUserSchema } from '../validation/user.validation';

const router = Router();

router.post('/register', validate(createUserSchema), register);
router.post('/login', login);
router.get('/delete/:id', passport.authenticate("jwt", { session: false }), deleteuser);

export default router;