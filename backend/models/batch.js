import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    timings: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    courseType: {
      type: String,
      enum: ["computer", "english"], // restrict values
      required: true,
    },
    courseName: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "courseTypeModel", // <- yahan se dynamic ref hoga
    },
    courseTypeModel: {
      type: String,
      required: true,
      enum: ["Course", "EnglishCourse"], // models ke naam
    },
    campusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campus",
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
      required: true,
    },
    createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
