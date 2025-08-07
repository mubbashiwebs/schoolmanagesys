import crypto from "crypto";
import UserForReq from "../models/userforreq.js";

export const generateUniqueId = async () => {
  let unique = false;
  let userId;

  while (!unique) {
    userId = crypto.randomBytes(4).toString("hex"); // 8 char ID
    const existing = await UserForReq.findOne({ userId });
    if (!existing) unique = true;
  }

  return userId;
};
