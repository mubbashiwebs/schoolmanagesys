import express from 'express';
import { addSection, getSectionsBySchool, getAllSectionsByCampus, deleteSection, updateSection } from '../controller/section.js';

const router = express.Router();

router.post('/add', addSection);
router.get('/school/:schoolId', getSectionsBySchool);
router.get('/getByCampus/:schoolId/:campusId', getAllSectionsByCampus);
router.delete('/delete/:id', deleteSection);
router.put('/update/:id', updateSection)


export default router;
