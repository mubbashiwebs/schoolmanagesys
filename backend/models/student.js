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

const grNumbersSchema = new mongoose.Schema({
  school: { type: String },
  tuition: { type: String },
  computer: { type: String },
  english: { type: String },
});

const studentSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  dob: { type: Date, required: true },
  cnic: { type: String, required: true },
  email: String,
  phone: String,
  gender: { type: String, enum: ["Male", "Female"] },
  address: String,
      masterId: { type: String, unique: true },
      grNumbers: grNumbersSchema,

  lastQualification: String,
  lastSchool: String,
  admissionDate: Date,

  admissionTypes: [String], // ['school', 'computer', 'tuition', 'english']
 class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class", // 👈 class model ka name
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section", // 👈 section model ka name
  },
  computerCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // 👈 your computer course model name
  },
  englishCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EnglishCourse", // 👈 english course model name
  },
  engCourseBatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch", // 👈 english batch model name
  },
  computerCourseBatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch", // 👈 computer batch model name
  },

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
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus",
    required: true
  },
  status:{type:String , required: true , default:'Active'},
  leftReason:{type:String },
   createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
