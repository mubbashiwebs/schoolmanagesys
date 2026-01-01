import express from "express";
import {
  addGeneralRegister,
  getAllRegisters,
  getAllRegistersByCampus,
  deleteRegister,
  updateRegister
} from "../controller/generalregister.js";

const router = express.Router();

router.post("/add", addGeneralRegister);
router.get("/all", getAllRegisters);
router.get("/getByCampus", getAllRegistersByCampus);
router.put('/update/:id' , updateRegister)
router.delete("/delete/:id", deleteRegister);

export default router;
