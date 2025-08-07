import mongoose from "mongoose";

const userForReqSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  contact: String,
  userId: { type: String, unique: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
    verificationTokenExpires: Date,

});

const UserForReq = new mongoose.model("UserForReq", userForReqSchema);
export default UserForReq
