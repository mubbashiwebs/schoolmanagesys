import express from 'express';
import { addUser, getUsers, getUser,deleteUser , loginUser , getUsersBySchool , getUsersByCampus , editUser} from '../controller/user.js';
import { checkAuth } from '../middleware/auth.js';
const router = express.Router();

router.post('/add', addUser);
router.post('/login', loginUser);
router.get('/get', getUsers);
router.get('/getBySchool/:schoolId' , getUsersBySchool)
router.get('/getBYCampus/:campusId' , getUsersByCampus)
router.delete('/delete/:id', deleteUser);
router.put('/update/:id',editUser)
router.get('/',checkAuth,getUser)

export default router;