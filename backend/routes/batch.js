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

const router = express.Router();

// Add Batch
router.post("/add", addBatch);

// Get All Batches by School
router.get("/all/:schoolId", getAllBatches);

// Get All Batches by Campus
router.get("/getByCampus/:schoolId/:campusId", getAllBatchesByCampus);

// Get All Computer Batches by Campus
router.get("/getAllComputerBatchesByCampus/:schoolId/:campusId", getAllComputerBatchesByCampus);

// Get All English Batches by Campus
router.get("/getAllEnglishBatchesByCampus/:schoolId/:campusId", getAllEnglishBatchesByCampus);


// Delete Batch
router.delete("/delete/:id", deleteBatch);

// Update Batch
router.put("/update/:id", updateBatch);

export default router;
