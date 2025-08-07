import express from 'express';
import {
  createEnglishCourse,
  getAllEnglishCourses,
  getEnglishCourseById,
  getEnglishCoursesBySchool,
  updateEnglishCourse,
  deleteEnglishCourse
} from '../controller/englang.js';

const router = express.Router();

// Create a new course
router.post('/add', createEnglishCourse);

// Get all courses
router.get('/all', getAllEnglishCourses);
router.get('/school/:schoolId', getEnglishCoursesBySchool);

// Get a course by ID
router.get('/get/:id', getEnglishCourseById);

// Update a course by ID
router.put('/update/:id', updateEnglishCourse);

// Delete a course by ID
router.delete('/delete/:id', deleteEnglishCourse);

export default router;
