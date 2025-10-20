import mongoose from "mongoose";

const campusSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    principalName: {
      type: String,
      trim: true
    },
     createdBy:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        }
  },
  { timestamps: true }
);

export default mongoose.model("Campus", campusSchema);
