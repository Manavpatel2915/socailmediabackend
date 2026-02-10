import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
    deleteuser,
    userdetails,
    update,
} from '../controller/user-controller'

const router = Router();

router.delete('/:id', authenticate, deleteuser);

router.get('/:id', authenticate, userdetails);

router.patch('/:id', authenticate, update);



export default router;