import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  getStudentBySchoolId,
  updateStudent,
  deleteStudent,
  getStudentByCampusId,
  getLeisureReport,
  bulkUploadStudents,
  getStdGr,
  getStudentSortedDataByCampus
} from "../controller/student.js";
import upload from "../middleware/uploadExcel.js";
// import { get } from "mongoose";

const router = express.Router();

router.post("/add", createStudent);
router.get("/get", getStudents);
router.get("/getBySchool/:id", getStudentBySchoolId);
router.get("/getByCampus/:schoolId/:campusId", getStudentByCampusId);
router.get("/get/:id", getStudentById);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);
router.post('/leisurereport',getLeisureReport)

router.post("/bulk-upload", upload.single("file"), bulkUploadStudents);
router.get('/getGrno/:schoolId/:campusId/:type/:class' , getStdGr)

router.get("/getStdSortedByCampus/:schoolId/:campusId", getStudentSortedDataByCampus);

export default router;
