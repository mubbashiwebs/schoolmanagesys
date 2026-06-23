import express from "express";
import {
  createReceipt,
  getAllReceipts,
  getSingleReceipt,
  deleteReceipt,
  getAllReceiptsByCampus
} from "../controller/receipts.js";

import { checkAuth } from "../middleware/auth.js";
const router = express.Router();

// ===============================
// 📌 CREATE RECEIPT
// POST /api/receipts
// ===============================
router.post("/", checkAuth, createReceipt);

// ===============================
// 📌 GET ALL RECEIPTS
// GET /api/receipts
// ===============================
router.get("/", checkAuth, getAllReceipts);

router.get("/byCampus/:campusId", checkAuth, getAllReceiptsByCampus);

// ===============================
// 📌 GET SINGLE RECEIPT
// GET /api/receipts/:id
// ===============================
router.get("/:id", checkAuth, getSingleReceipt);

// ===============================
// 📌 DELETE RECEIPT
// DELETE /api/receipts/:id
// ===============================
router.delete("/:id", checkAuth, deleteReceipt);

export default router;
