import crypto from "crypto";
import User from "../models/userforreq.js";
import { sendVerificationEmail } from "../utils/sendMail.js";
import { generateUniqueId } from "../utils/generateUniqueId.js";

export const registerUser = async (req, res) => {
  const { name, email, contact } = req.body;
  console.log('working fine')

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email exists" });

    // const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const verificationTokenExpires = Date.now() + 1000 * 60 * 15; // 15 min

    const userId = await generateUniqueId();

    const user = await User.create({
      name,
      email,
      contact,
      
      userId,
      verificationToken,
      verificationTokenExpires,
    });

    console.log(user)
    await sendVerificationEmail(email, verificationToken);

    res.json({ message: "Registration successful. Please verify email." , userId : user.userId });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    console.log(token)
    // Check if token exists
    if (!token || token != null) {
      console.log('token nhi hai')
      return res.status(400).json({ message: "Verification token is missing." });
    }

    const user = await User.findOne({ verificationToken: token });

    // Check if user with token exists
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Check if token is expired
    if (user.verificationTokenExpires < Date.now()) {
      return res.status(400).json({
        message: "Token expired",
        expired: true,
        email: user.email,
      });
    }

    // Mark email as verified
    user.isVerified = true;
    user.verificationToken = "";
    user.verificationTokenExpires = null;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully!",
      userId: user.userId,
    });

  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const resendVerification = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.isVerified)
    return res.status(400).json({ message: "User not found or already verified" });

  const token = crypto.randomBytes(20).toString("hex");
  const expires = Date.now() + 1000 * 60 * 15; // 15 min

  user.verificationToken = token;
  user.verificationTokenExpires = expires;
  await user.save();

  await sendVerificationEmail(email, token);

  res.json({ message: "Verification email resent." });
};
