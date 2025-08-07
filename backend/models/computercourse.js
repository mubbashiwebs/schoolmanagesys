import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true
  }
}, { timestamps: true });

 const Course = mongoose.model('Course', courseSchema);
export default Course