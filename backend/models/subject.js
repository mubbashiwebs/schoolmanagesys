import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name:{type:String , required:true},
    schoolId: {type: mongoose.Schema.Types.ObjectId, ref: 'school', required: true },
    campusId: {type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true },
     createdBy:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        }
})

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;