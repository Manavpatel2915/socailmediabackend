import { Router } from "express"; 
import passport from "passport";
import {
    creatpost,
    getpost,
}from '../controller/PostController'

const router = Router();

router.post('/createpost',passport.authenticate("jwt", { session: false }),creatpost);
router.get('/:postid',getpost);
router.get('/:postid',passport.authenticate("jwt", { session: false }),getpost);
export default router;