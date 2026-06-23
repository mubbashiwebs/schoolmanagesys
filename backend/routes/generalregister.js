import express from "express";
import {
  addGeneralRegister,
  getAllRegisters,
  getAllRegistersByCampus,
  deleteRegister,
  updateRegister
} from "../controller/generalregister.js";
import { checkAuth } from "../middleware/auth.js";
const router = express.Router();

router.post("/add", checkAuth, addGeneralRegister);
router.get("/all", checkAuth, getAllRegisters);
router.get("/getByCampus", checkAuth, getAllRegistersByCampus);
router.put('/update/:id' , checkAuth, updateRegister)
router.delete("/delete/:id", checkAuth, deleteRegister);

export default router;
