import express from "express";
import { createTeacher, deleteTeacher, getTeacherById, getTeacherBySchoolId, getTeacherByCampus, updateTeacher } from "../controller/teacher.js";
import { checkAuth } from "../middleware/auth.js";
const router = express.Router();

router.post("/add", checkAuth, createTeacher);
router.get("/get/:schoolId/:campus", checkAuth, getTeacherByCampus);
router.get("/school/:id", checkAuth, getTeacherBySchoolId);
router.post("/getById", checkAuth, getTeacherById);
router.put("/update/:id", checkAuth, updateTeacher);
router.delete("/delete/:id", checkAuth, deleteTeacher);

export default router;
