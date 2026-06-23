import mongoose from "mongoose";

/* =================== CLASS FEE =================== */
const classFeeSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },

  Fee: {
    type: Number,
    required: true
  }

}, { _id: false });

/* =================== FEE STRUCTURE =================== */
const feeStructureSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  classFees: {
    type: [classFeeSchema],
    required: true
  },

  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true
  },

  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus"
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("FeeStructure", feeStructureSchema);
