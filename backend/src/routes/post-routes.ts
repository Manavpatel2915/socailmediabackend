import { Router } from "express"; 
import passport from "passport";
import {
    creatpost,
    getpost,
    deletepost,
    updatepost,
}from '../controller/post-controller'
import {validate} from '../middleware/validate-middleware'
import {createPostSchema,updatePostSchema} from '../validation/post-validation'


const router = Router();

router.post('/createpost',passport.authenticate("jwt", { session: false }),validate(createPostSchema),creatpost);

router.get('/:postid',getpost);


router.get('/delete/:postid',passport.authenticate("jwt", { session: false }),deletepost);

router.patch('/updatepost/:postid',passport.authenticate("jwt", { session: false }),validate(updatePostSchema),updatepost);


export default router;
