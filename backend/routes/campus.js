import express from "express";
import {
  createCampus,
  getCampusesBySchool,
  updateCampus,
  deleteCampus
} from "../controller/campus.js";
import { checkAuth } from "../middleware/auth.js";
const router = express.Router();

router.post("/add", checkAuth, createCampus); // Create new campus
router.get("/getBySchool", checkAuth, getCampusesBySchool); // Get all campuses for a school
router.put("/update/:id", checkAuth, updateCampus); // Update campus
router.delete("/delete/:id", checkAuth, deleteCampus); // Delete campus

export default router;
