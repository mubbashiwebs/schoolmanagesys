import express from "express";
import {
  addSubject,
  getSubjectsBySchool,
  getAllSubjectsByCampus,
  deleteSubject,
  updateSubject,
} from "../controller/subject.js";

const router = express.Router();

// ✅ Add Subject
// POST http://localhost:3000/api/subject/add
router.post("/add", addSubject);

// ✅ Get Subjects by School
// GET http://localhost:3000/api/subject/getBySchool/:schoolId
router.get("/getBySchool/:schoolId", getSubjectsBySchool);

// ✅ Get Subjects by Campus
// GET http://localhost:3000/api/subject/getByCampus/:schoolId/:campusId
router.get("/getByCampus/:schoolId/:campusId", getAllSubjectsByCampus);

// ✅ Update Subject
// PUT http://localhost:3000/api/subject/update/:id
router.put("/update/:id", updateSubject);

// ✅ Delete Subject
// DELETE http://localhost:3000/api/subject/delete/:id
router.delete("/delete/:id", deleteSubject);

export default router;
