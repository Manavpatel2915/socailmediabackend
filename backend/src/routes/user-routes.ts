import { Router } from "express";
import { authenticate } from '../middleware/passport-middleware';
import {
    deleteUserAccount,
    getUserDetails,
    updateUserProfile,
} from '../controller/user-controller'

const router = Router();

router.delete('/:id', authenticate, deleteUserAccount);

router.get('/:id', authenticate, getUserDetails);

router.patch('/:id', authenticate, updateUserProfile);

export default router;