import express from 'express';
import {
  addCourse,
  getCoursesBySchool,
  getAllCoursesByCampus,
  deleteCourse,
  updateCourse
} from '../controller/computercourse.js';
import { checkAuth } from '../middleware/auth.js';
const router = express.Router();

router.post('/add', checkAuth, addCourse);
router.get('/school', checkAuth, getCoursesBySchool);
router.get('/getbyCampus/:campusId', checkAuth, getAllCoursesByCampus);
router.delete('/delete/:id', checkAuth, deleteCourse);
router.put('/update/:id', checkAuth, updateCourse);


export default router;