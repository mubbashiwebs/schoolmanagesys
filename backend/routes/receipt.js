import express from "express";
import { createReceipt, deleteReceipt, getReceiptById, getReceiptForStudent, getReceipts, updateReceipt } from "../controller/receipt.js";

const router = express.Router();

// ✅ Add new receipt
router.post("/", createReceipt);

router.post ('/student', getReceiptForStudent);

// ✅ Get all receipts (optional filters)
router.get("/", getReceipts);

// ✅ Get single receipt by ID
router.get("/:id", getReceiptById);

// ✅ Update receipt by ID
router.put("/:id", updateReceipt);

// ✅ Delete receipt by ID
router.delete("/:id", deleteReceipt);

export default router;
