// import mongoose from "mongoose";
// const feeDetailSchema = new mongoose.Schema({
//   originalFee: {
//     type: Number,
//      ,
//   },
//   discount: {
//     type: Number,
//     default: 0,
//   },
//   payableFee: {
//     type: Number,
//      ,
//   }
// }, { _id: false }); 

// const grNumbersSchema = new mongoose.Schema({
//   school: { type: String },
//   tuition: { type: String },
//   computer: { type: String },
//   english: { type: String },
// });

// const studentSchema = new mongoose.Schema({
//   imageUrl: { type: String,   },
//   name: { type: String,   },
//   fatherName: { type: String,   },
//   dob: { type: Date,   },
//   cnic: { type: String },
//   email: String,
//   phone: String,
//   gender: { type: String, enum: ["Male", "Female"] },
//   address: String,
//       masterId: { type: String, unique: true },
//     grNumbers: grNumbersSchema,

//   lastQualification: String,
//   lastSchool: String,
//   admissionDate: Date,


//   admissionTypes: [String], // ['school', 'computer', 'tuition', 'english']
//   admissionClass : {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Class", // 👈 class model ka name
//   },

//  class: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Class", // 👈 class model ka name
//   },
//   section: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Section", // 👈 section model ka name
//   },
//       admissionSection: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Section", // 👈 section model ka name
//   },
//   computerCourse: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Course", // 👈 your computer course model name
//   },
//   englishCourse: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "EnglishCourse", // 👈 english course model name
//   },
//   engCourseBatch: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Batch", // 👈 english batch model name
//   },
//   computerCourseBatch: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Batch", // 👈 computer batch model name
//   },
//  coachingClass: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "CoachClass", // 👈 computer batch model name
//   },
//   feeDetails: {
//     school: { type: feeDetailSchema, required: false },
//     tuition: { type: feeDetailSchema, required: false },
//     computer: { type: feeDetailSchema, required: false },
//     english: { type: feeDetailSchema, required: false },
//   },

//   totalFee: {
//     type: Number,
//      
//   },

//   schoolId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "school",
//      
//   },
//   campusId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Campus",
//      
//   },
//   status:{type:String ,    default:'Active'},
//   leftReason:{type:String },
//    createdBy:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//          ,
//       }
// });

// const Student = mongoose.model("Student", studentSchema);
// export default Student;


import mongoose from "mongoose";
const feeDetailSchema = new mongoose.Schema({
  originalFee: {
    type: Number,
     
  },
  discount: {
    type: Number,
    default: 0,
  },
  payableFee: {
    type: Number,
     
  }
}, { _id: false }); 

const grNumbersSchema = new mongoose.Schema({
  school: { type: Number },
  tuition: { type: Number },
  computer: { type: Number },
  english: { type: Number },
});

const studentSchema = new mongoose.Schema({
  imageUrl: { type: String,   },
  name: { type: String,   },
  fatherName: { type: String,   },
  dob: { type: Date,   },
  cnic: { type: String },
  email: String,
  phone: String,
  gender: { type: String, enum: ["Male", "Female"] },
  address: String,
      masterId: { type: String,  },
    grNumbers: grNumbersSchema,

  lastQualification: String,
  lastSchool: String,
  admissionDate: Date,


  admissionTypes: [String], // ['school', 'computer', 'tuition', 'english']
  admissionClass : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class", // 👈 class model ka name
  },

 class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class", // 👈 class model ka name
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section", // 👈 section model ka name
  },
      admissionSection: {
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
 coachingClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoachClass", // 👈 computer batch model name
  },
  feeDetails: {
    school: { type: feeDetailSchema, required: false },
    tuition: { type: feeDetailSchema, required: false },
    computer: { type: feeDetailSchema, required: false },
    english: { type: feeDetailSchema, required: false },
  },

  totalFee: {
    type: Number,
     
  },

  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "school",
     
  },
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus",
     
  },
  status:{type:String ,    default:'Active'},
  leftReason:{type:String },
   createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
         
      },

      educationLevel:{
        type:String
      }

});

const Student = mongoose.model("Student", studentSchema);
export default Student;
