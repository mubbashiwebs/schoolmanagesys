import express from "express";
import { registerUser, resendVerification, verifyEmail } from "../controller/userforreq.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

export default router;