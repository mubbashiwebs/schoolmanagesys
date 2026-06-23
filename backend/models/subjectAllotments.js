import mongoose from "mongoose";

const subjectAllotmentSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  isClassTeacher: {
    type: Boolean,
    default: false   // by default false hoga
  },
    schoolId: {type: mongoose.Schema.Types.ObjectId, ref: 'school', required: true },
      campusId: {type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true },
   createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
}, { timestamps: true });

const SubjectAllotment = mongoose.model("SubjectAllotment", subjectAllotmentSchema);
export default SubjectAllotment;
