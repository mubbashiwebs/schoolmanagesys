import express from "express";
import {
  addSubject,
  getSubjectsBySchool,
  getAllSubjectsByCampus,
  deleteSubject,
  updateSubject,
} from "../controller/subject.js";
  import { checkAuth } from "../middleware/auth.js";

const router = express.Router();

// ✅ Add Subject
// POST http://localhost:3000/api/subject/add
router.post("/add", checkAuth, addSubject);

// ✅ Get Subjects by School
// GET http://localhost:3000/api/subject/getBySchool/:schoolId
router.get("/getBySchool", checkAuth, getSubjectsBySchool);
// ✅ Get Subjects by Campus
// GET http://localhost:3000/api/subject/getByCampus/:schoolId/:campusId
router.get("/getByCampus/:campusId", checkAuth, getAllSubjectsByCampus);

// ✅ Update Subject
// PUT http://localhost:3000/api/subject/update/:id
router.put("/update/:id", checkAuth, updateSubject);
// ✅ Delete Subject
// DELETE http://localhost:3000/api/subject/delete/:id
router.delete("/delete/:id", checkAuth, deleteSubject);

export default router;
