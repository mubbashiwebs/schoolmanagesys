import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true
  }
}, { timestamps: true });

const Section = mongoose.model('Section', sectionSchema);
export default Section