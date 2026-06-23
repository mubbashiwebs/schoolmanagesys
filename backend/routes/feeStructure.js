import express from "express";
import { AddFeeStructure , getFeeStructures ,updateFeeStructure,deleteFeeStructure } from "../controller/FeeStructure.js";
import { checkAuth } from "../middleware/auth.js";
const router = express.Router();

/* ================= CREATE ================= */
router.post("/add", checkAuth, AddFeeStructure);
/* ================= GET ALL ================= */
router.get("/", checkAuth, getFeeStructures);

/* ================= UPDATE ================= */
router.put("/:id", checkAuth, updateFeeStructure);

/* ================= DELETE ================= */
router.delete("/:id", checkAuth, deleteFeeStructure);

export default router;
