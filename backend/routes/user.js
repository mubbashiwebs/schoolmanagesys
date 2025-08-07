import express from 'express';
import { addUser, getUsers, deleteUser , loginUser } from '../controller/user.js';

const router = express.Router();

router.post('/add', addUser);
router.post('/login', loginUser);
router.get('/get', getUsers);
router.delete('/delete/:id', deleteUser);

export default router;