import express from "express";
import {
  createCampus,
  getCampusesBySchool,
  updateCampus,
  deleteCampus
} from "../controller/campus.js";

const router = express.Router();

router.post("/add", createCampus); // Create new campus
router.get("/getBySchool/:schoolId", getCampusesBySchool); // Get all campuses for a school
router.put("/update/:id", updateCampus); // Update campus
router.delete("/delete/:id", deleteCampus); // Delete campus

export default router;
