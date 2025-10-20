import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    name:{type:String,required:true},
    schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true
  },
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campus',
    required: true
  },
  fee:{type:Number , required:true},
  tuitionFee:{type:Number , required:true},
  admissionFee:{type:Number , required:true},
 createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
})

const Class = new mongoose.model('Class',classSchema)
export default Class