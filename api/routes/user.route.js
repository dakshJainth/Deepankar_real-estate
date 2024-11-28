import express from 'express';
import { test } from '../controllers/user.controller.js';
import { test2 } from '../controllers/user.controller.js';
import { updateUser, deleteUser, getUserListings } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.get('/update/:id', test2);
router.post('/update/:id', verifyToken,updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);

export default router;