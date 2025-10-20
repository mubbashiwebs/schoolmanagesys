import express from "express";
import { createTeacher, deleteTeacher, getTeacherById, getTeacherBySchoolId, getTeacherByCampus, updateTeacher } from "../controller/teacher.js";
const router = express.Router();

router.post("/add", createTeacher);
router.get("/get/:schoolId/:campus", getTeacherByCampus);
router.get("/school/:id", getTeacherBySchoolId);
router.post("/getById", getTeacherById);
router.put("/update/:id", updateTeacher);
router.delete("/delete/:id", deleteTeacher);

export default router;
