import express from "express";
import {
  addBatch,
  getAllBatches,
  getAllBatchesByCampus,
  getAllComputerBatchesByCampus,
  getAllEnglishBatchesByCampus,
  deleteBatch,
  updateBatch,
} from "../controller/batch.js";
import { checkAuth } from "../middleware/auth.js";
const router = express.Router();

// Add Batch
router.post("/add",checkAuth, addBatch);

// Get All Batches by School
router.get("/all",checkAuth,getAllBatches);

// Get All Batches by Campus
router.get("/getByCampus/:campusId", checkAuth, getAllBatchesByCampus);

// Get All Computer Batches by Campus
router.get("/getAllComputerBatchesByCampus/:campusId", checkAuth, getAllComputerBatchesByCampus);

// Get All English Batches by Campus
router.get("/getAllEnglishBatchesByCampus/:campusId", checkAuth, getAllEnglishBatchesByCampus);
// Delete Batch
router.delete("/delete/:id", checkAuth, deleteBatch);

// Update Batch
router.put("/update/:id", checkAuth, updateBatch);

export default router;
