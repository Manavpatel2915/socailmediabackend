import { Router } from "express";
import passport from "passport";
import {
    createcomment,
    updatecomment,
    deletecomment,
    
}from '../controller/comment-controller'
import optionalJwt from "../middleware/optinaljwt-middleware";
import { asyncHandler } from "../utils/asyncHandler";
const router = Router();

router.post("/create_comment/:postId",optionalJwt, asyncHandler(createcomment));
router.patch('/update_comment/:commentId',passport.authenticate("jwt", { session: false }),asyncHandler(updatecomment));
router.get('/delete_comment/:id',passport.authenticate("jwt", { session: false }),asyncHandler(deletecomment));
export default router;