import express from "express";
import { createTeacher, deleteTeacher, getTeacherByEmail, getTeacherBySchoolId, getTeachers, updateTeacher } from "../controller/teacher.js";
const router = express.Router();

router.post("/add", createTeacher);
router.get("/get", getTeachers);
router.get("/school/:id", getTeacherBySchoolId);
router.post("/getByEmail", getTeacherByEmail);
router.put("/update/:id", updateTeacher);
router.delete("/delete/:id", deleteTeacher);

export default router;
