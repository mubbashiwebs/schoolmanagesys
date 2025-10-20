import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

    campusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campus',
      required: true
    },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true
  },
   createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
  
}, { timestamps: true });

 const Course = mongoose.model('Course', courseSchema);
export default Course