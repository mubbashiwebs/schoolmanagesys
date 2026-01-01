import mongoose from "mongoose";

const generalRegisterSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "school",
    required: true,
  },
    campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus",
    required: true,
  },
  registerName: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const GeneralRegister = mongoose.model("GeneralRegister", generalRegisterSchema);
export default GeneralRegister;
