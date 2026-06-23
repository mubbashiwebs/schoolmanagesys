import express from "express";
import {
  createSubjectAllotment,
  getAllSubjectAllotments,
  getSubjectAllotmentById,
  updateSubjectAllotment,
  deleteSubjectAllotment
} from "../controller/subjectAllotments.js";
import { checkAuth } from "../middleware/auth.js";
const router = express.Router();

router.post("/", checkAuth, createSubjectAllotment);
router.get("/", checkAuth, getAllSubjectAllotments);
router.get("/:id", checkAuth, getSubjectAllotmentById);
router.put("/:id", checkAuth, updateSubjectAllotment);
router.delete("/:id", checkAuth, deleteSubjectAllotment);

export default router;
