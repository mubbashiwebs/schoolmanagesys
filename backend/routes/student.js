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
  getStudentSortedDataByCampus,
  getStudentsByClass,
  getStudentsByClsAndSec,
  migrateClass,
  getStudentsByMasterId,
  getStudentLedger
} from "../controller/student.js";
import upload from "../middleware/uploadExcel.js";

import { checkAuth } from "../middleware/auth.js";
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
router.get('/getByClass/:classId', getStudentsByClass)
router.get('/getByClsAndSec/:classId/:sectionId', getStudentsByClsAndSec)
router.post("/migrateClass", migrateClass);

router.post('/getByMasterId/:masterId', checkAuth, getStudentsByMasterId)
router.post('/student-ledger/:masterId',getStudentLedger)
export default router;
