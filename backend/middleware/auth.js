import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

export const checkAuth = async (req, res, next) => {
  try {
    const { aToken } = req.cookies;

    if (!aToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const decoded = jwt.verify(aToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
};
