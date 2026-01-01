import express from 'express';
import { addUser, getUsers, deleteUser , loginUser , getUsersBySchool , getUsersByCampus , editUser} from '../controller/user.js';

const router = express.Router();

router.post('/add', addUser);
router.post('/login', loginUser);
router.get('/get', getUsers);
router.get('/getBySchool/:schoolId' , getUsersBySchool)
router.get('/getBYCampus/:campusId' , getUsersByCampus)
router.delete('/delete/:id', deleteUser);
router.put('/update/:id',editUser)

export default router;