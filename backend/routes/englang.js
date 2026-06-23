import express from 'express';
import {
  createEnglishCourse,
  getAllEnglishCoursesByCampus,
  getEnglishCourseById,
  getEnglishCoursesBySchool,
  updateEnglishCourse,
  deleteEnglishCourse
} from '../controller/englang.js';
import { checkAuth } from '../middleware/auth.js';
const router = express.Router();

// Create a new course
router.post('/add', checkAuth, createEnglishCourse);
// Get all courses
router.get('/getByCampus/:campusId', checkAuth, getAllEnglishCoursesByCampus);
// Get courses by school ID
router.get('/school', checkAuth, getEnglishCoursesBySchool);

// Get a course by ID
router.get('/get/:id', checkAuth, getEnglishCourseById);

// Update a course by ID
router.put('/update/:id', checkAuth, updateEnglishCourse);

// Delete a course by ID
router.delete('/delete/:id', checkAuth, deleteEnglishCourse);

export default router;
