// models/EnglishCourse.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const EnglishCourseSchema = new Schema({
  levelName: {
    type: String,
    required: true,
    trim: true
  },
  fee: {
    type: Number,
    required: true,
    min: 0
  },
  schoolId: {
    type: Schema.Types.ObjectId,
    ref: 'school',
    required: true
  }
}, {
  timestamps: true
});

const EnglishCourse = model('EnglishCourse', EnglishCourseSchema);

export default EnglishCourse;
