import { Router } from "express";
import passport from "passport";
import {
    register,
    login,
    deleteuser,
} from '../controller/UserController'


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/delete/:id',passport.authenticate("jwt", { session: false }),deleteuser);

export default router;