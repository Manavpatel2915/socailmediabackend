import { Router } from "express";
import passport from "passport";
import {
    create_comment,
    update_comment,
    
}from '../controller/CommentController'
import optionalJwt from "../middleware/optinaljwt";
const router = Router();

router.post("/create_comment/:postId",optionalJwt, create_comment);
router.patch('/update_comment/:commentId',passport.authenticate("jwt", { session: false }),update_comment);

export default router;