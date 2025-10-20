import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  getStudentBySchoolId,
  updateStudent,
  deleteStudent,
  getStudentByCampusId
} from "../controller/student.js";

const router = express.Router();

router.post("/add", createStudent);
router.get("/get", getStudents);
router.get("/getBySchool/:id", getStudentBySchoolId);
router.get("/getByCampus/:schoolId/:campusId", getStudentByCampusId);
router.get("/get/:id", getStudentById);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);

export default router;
