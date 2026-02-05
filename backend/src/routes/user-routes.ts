import { Router } from "express";
import passport from "passport";
import {
    register,
    login,
    deleteuser,
} from '../controller/user-controller'
import { validate } from '../middleware/validate-middleware';
import { createUserSchema } from '../validation/user-validation';
import { asyncHandler } from "../utils/asyncHandler";


const router = Router();


router.post('/register', validate(createUserSchema), asyncHandler(register));


router.post('/login', asyncHandler(login));


router.get('/delete/:id', passport.authenticate("jwt", { session: false }), asyncHandler(deleteuser));

export default router;