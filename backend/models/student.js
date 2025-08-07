import mongoose from "mongoose";
const feeDetailSchema = new mongoose.Schema({
  originalFee: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  payableFee: {
    type: Number,
    required: true,
  }
}, { _id: false }); 

const studentSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  grno: { type:Number, required: true },
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  dob: { type: Date, required: true },
  cnic: { type: String, required: true },
  email: String,
  phone: String,
  gender: { type: String, enum: ["Male", "Female"] },
  address: String,

  lastQualification: String,
  lastSchool: String,
  admissionDate: Date,

  admissionTypes: [String], // ['school', 'computer', 'tuition', 'english']
  class: String,
  section: String,
  computerCourse: String,
  englishCourse: String,

  feeDetails: {
    school: { type: feeDetailSchema, required: false },
    tuition: { type: feeDetailSchema, required: false },
    computer: { type: feeDetailSchema, required: false },
    english: { type: feeDetailSchema, required: false },
  },

  totalFee: {
    type: Number,
    required: true
  },

  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "school",
    required: true
  },
  status:{type:String , required: true , default:'Available'},
  leftReason:{type:String }
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
