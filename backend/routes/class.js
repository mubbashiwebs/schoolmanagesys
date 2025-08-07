import express from 'express';
import { addClass,getAllClasses,getAllClassesBySchool,deleteClass,updateClass } from '../controller/class.js';

const router = express.Router();

// Add a new class
router.post('/add', addClass);

// Get all classes (for super admin)
router.get('/all', getAllClasses);

// Get all classes by school ID
router.get('/getBySchool/:schoolId', getAllClassesBySchool);

// Delete class by class ID
router.delete('/delete/:id', deleteClass);

router.put('/update/:id', updateClass);


export default router;
