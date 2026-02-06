import { Router } from "express";
import passport from "passport";
import {
    createcomment,
    updatecomment,
    deletecomment,
    
}from '../controller/comment-controller'
import optionalJwt from "../middleware/optinaljwt-middleware";
const router = Router();


router.post("/create_comment/:postId",optionalJwt, createcomment);

router.patch('/update_comment/:commentId',passport.authenticate("jwt", { session: false }),updatecomment);

router.get('/delete_comment/:id',passport.authenticate("jwt", { session: false }),deletecomment);
export default router;