import { Router } from "express"; 
import passport from "passport";
import {
    creatpost,
    getpost,
}from '../controller/PostController'

const router = Router();

router.post('/createpost',passport.authenticate("jwt", { session: false }),creatpost);

export default router;