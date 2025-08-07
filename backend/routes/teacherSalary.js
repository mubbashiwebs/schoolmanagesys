import express from 'express';
import {
  getTeacherSalaryByMonthAndYear,
  addTeacherSalary
} from '../controller/teacherSalary.js';

const router = express.Router();

router.get('/getByMonthYear', getTeacherSalaryByMonthAndYear);
router.post('/add', addTeacherSalary);

export default router;
