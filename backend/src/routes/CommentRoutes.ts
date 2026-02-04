import { Router } from "express";
import passport from "passport";
import {
    createcomment,
    updatecomment,
    deletecomment,
    
}from '../controller/CommentController'
import optionalJwt from "../middleware/optinaljwt";
import { asyncHandler } from "../utils/asyncHandler";
const router = Router();

router.post("/create_comment/:postId",optionalJwt, asyncHandler(createcomment));
router.patch('/update_comment/:commentId',passport.authenticate("jwt", { session: false }),asyncHandler(updatecomment));
router.get('/delete_comment/:id',passport.authenticate("jwt", { session: false }),asyncHandler(deletecomment));
export default router;