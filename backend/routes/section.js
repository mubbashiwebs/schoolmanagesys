import express from 'express';
import { addSection, getSectionsBySchool, getAllSections, deleteSection, updateSection } from '../controller/section.js';

const router = express.Router();

router.post('/add', addSection);
router.get('/school/:schoolId', getSectionsBySchool);
router.get('/all', getAllSections);
router.delete('/delete/:id', deleteSection);
router.put('/update/:id', updateSection);


export default router;
