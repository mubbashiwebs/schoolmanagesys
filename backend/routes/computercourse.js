import express from 'express';
import {
  addCourse,
  getCoursesBySchool,
  getAllCoursesByCampus,
  deleteCourse,
  updateCourse
} from '../controller/computercourse.js';

const router = express.Router();

router.post('/add', addCourse);
router.get('/school/:schoolId', getCoursesBySchool);
router.get('/getbyCampus/:schoolId/:campusId', getAllCoursesByCampus);
router.delete('/delete/:id', deleteCourse);
router.put('/update/:id', updateCourse);


export default router;