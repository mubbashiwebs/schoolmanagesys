import express from 'express';
import { addClass,getAllClasses,getAllClassesByCampus,deleteClass,updateClass } from '../controller/class.js';

const router = express.Router();

// Add a new class
router.post('/add', addClass);

// Get all classes (for super admin)
router.get('/school/:schoolId', getAllClasses);

// Get all classes by school ID
router.get('/getByCampus/:schoolId/:campusId', getAllClassesByCampus);

// Delete class by class ID
router.delete('/delete/:id', deleteClass);

router.put('/update/:id', updateClass);


export default router;
