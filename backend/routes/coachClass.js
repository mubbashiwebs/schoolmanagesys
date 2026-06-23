import express from 'express';
import { addClass,getAllClasses,getAllClassesByCampus,deleteClass,updateClass } from '../controller/coachClass.js';
import { checkAuth } from '../middleware/auth.js';
const router = express.Router();

// Add a new class
router.post('/add', checkAuth, addClass);
// Get all classes (for super admin)
router.get('/school', checkAuth, getAllClasses);

// Get all classes by school ID
router.get('/getByCampus/:campusId', checkAuth, getAllClassesByCampus);

// Delete class by class ID
router.delete('/delete/:id', checkAuth, deleteClass);

router.put('/update/:id', checkAuth, updateClass);


export default router;
