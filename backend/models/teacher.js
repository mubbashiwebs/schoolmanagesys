import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
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

  
    Salary : {type: Number , required:true},
      schoolClassesRec: [
    {
      class: String,
      section: String,
      subject: String,
      isClassTeacher: Boolean,
    },
  ],
    schooltuitionRec: [
    {
      class: String,
      subject: String,
      
    },
  ],

    englishCourses: [
    {
      courseName: String,
      
    },
  ],

     computerCourses: [
    {
      courseName: String,
      
    },
  ],

  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "school",
    required: true
  },
    status:{type:String , required: true , default:'Available'},
  leftReason:{type:String }
});

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
