import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
    deleteuser,
    getuser,
    update,
} from '../controller/user-controller'



const router = Router();




router.delete('/:id', authenticate, deleteuser);

router.get('/:id', authenticate, getuser);

router.patch('/:id', authenticate, update);



export default router;