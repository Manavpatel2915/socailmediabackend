import { Router } from "express"; 
import passport from "passport";
import {
    creatpost,
    getpost,
    deletepost,
    updatepost,
}from '../controller/PostController'

const router = Router();

router.post('/createpost',passport.authenticate("jwt", { session: false }),creatpost);
router.get('/:postid',getpost);
router.get('/delete/:postid',passport.authenticate("jwt", { session: false }),deletepost);
router.patch('/updatepost/:postid',passport.authenticate("jwt", { session: false }),updatepost);


export default router;