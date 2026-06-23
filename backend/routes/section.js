import express from 'express';
import { addSection, getSectionsBySchool, getAllSectionsByCampus, deleteSection, updateSection } from '../controller/section.js';
import { checkAuth } from '../middleware/auth.js';
const router = express.Router();

router.post('/add', checkAuth, addSection);
router.get('/bySchool', checkAuth, getSectionsBySchool);
router.get('/getByCampus/:campusId', checkAuth, getAllSectionsByCampus);
router.delete('/delete/:id', checkAuth, deleteSection);
router.put('/update/:id', checkAuth, updateSection)

export default router;
