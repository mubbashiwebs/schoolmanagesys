import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,   
    required: true,
    unique: true
  },
  class: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Class", // 👈 class model ka name
   },
   section: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Section", // 👈 section model ka name
   },
    date: {
    type: Date,
    required: true
    },
    amount: {
    type: Number,
    required: true
    },
    student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
    },
    paymentMethod: {
    type: String,
    default: "Cash"
    },
    type: {
    type: String,
    required: true
    },
    schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "school",
    required: true
    },
    campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus",
    required: true
    },

        createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
      
})
const Receipt = mongoose.model("Receipts", receiptSchema);
export default Receipt;   