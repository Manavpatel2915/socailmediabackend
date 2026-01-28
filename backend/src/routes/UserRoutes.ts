import { Router } from "express";
import passport from "passport";
import {
    register,
    login,
    
} from '../controller/UserController'


const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;