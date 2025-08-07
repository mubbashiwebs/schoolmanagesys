import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  getStudentBySchoolId,
  updateStudent,
  deleteStudent
} from "../controller/student.js";

const router = express.Router();

router.post("/add", createStudent);
router.get("/get", getStudents);
router.get("/school/:id", getStudentBySchoolId);
router.get("/get/:id", getStudentById);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);

export default router;
