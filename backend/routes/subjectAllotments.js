import express from "express";
import {
  createSubjectAllotment,
  getAllSubjectAllotments,
  getSubjectAllotmentById,
  updateSubjectAllotment,
  deleteSubjectAllotment
} from "../controller/subjectAllotments.js";

const router = express.Router();

router.post("/", createSubjectAllotment);
router.get("/", getAllSubjectAllotments);
router.get("/:id", getSubjectAllotmentById);
router.put("/:id", updateSubjectAllotment);
router.delete("/:id", deleteSubjectAllotment);

export default router;
