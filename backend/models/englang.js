// models/EnglishCourse.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const EnglishCourseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  schoolId: {
    type: Schema.Types.ObjectId,
    ref: 'school',
    required: true
  },
  campusId: {
    type: Schema.Types.ObjectId,
    ref: 'Campus',
    required: true
  },
   createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
 
}, {
  timestamps: true
});

const EnglishCourse = model('EnglishCourse', EnglishCourseSchema);

export default EnglishCourse;
