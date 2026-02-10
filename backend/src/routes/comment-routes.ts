import { Router } from "express";
import  { authenticate }   from '../middleware/passport-middleware';
import {
    createcomment,
    updatecomment,
    deletecomment,

} from '../controller/comment-controller'
import { optionalJwt } from "../middleware/optinaljwt-middleware";
const router = Router();


router.post("/create_comment/:postId"/*
    #swagger.tags = ['Comment']*/, optionalJwt, createcomment);

router.patch('/update_comment/:commentId'/*
    #swagger.tags = ['Comment']*/, authenticate, updatecomment);

router.get('/delete_comment/:id'/*
    #swagger.tags = ['Comment']*/, authenticate, deletecomment);
export default router;