import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDb } from './db/config.js'
import schoolRouter from './routes/school.js'
import userRouter from './routes/user.js'
import classRouter from './routes/class.js'
import sectionRouter from './routes/section.js'
import courseRouter from './routes/computercourse.js'
import studentRouter from './routes/student.js'
import teacherRouter from './routes/teacher.js'
import englishCourseRoutes from './routes/englang.js'
import teacherSalaryRouter from './routes/teacherSalary.js'
// import feeReceiptRouter from './routes/stdFeeReceipt.js'
import userForReqRouter from './routes/userforreq.js'
import campusRouter from './routes/campus.js'
import batchRouter from './routes/batch.js'
import subjectRouter from './routes/subject.js'
import subjectAllotmentRouter from './routes/subjectAllotments.js'
import CoachingClassRouter from './routes/coachClass.js'
import voucherRouter from './routes/voucher.js'
import feeReceiptRouter from './routes/receipt.js'
import generalRegisterRouter from './routes/generalregister.js'
import feeStructureRouter from './routes/feeStructure.js'
import receiptsRouter from './routes/receipts.js'
import { checkAuth } from './middleware/auth.js'
import dotenv from "dotenv";
import Student from './models/student.js'
dotenv.config();
connectDb()

const app = express()
app.use(cors({
  origin: [
    "http://127.0.0.1:5501",
    "http://localhost:5501",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())

const port = process.env.PORT || 3000;
app.use('/api/school',schoolRouter)
app.use('/api/user' , userRouter)
app.use('/api/class' , classRouter)
app.use('/api/coachingClass' , CoachingClassRouter)
app.use('/api/section', sectionRouter);
app.use('/api/course', courseRouter);
app.use("/api/student", studentRouter);
app.use('/api/teacher' , teacherRouter )
app.use('/api/english-courses', englishCourseRoutes);
app.use('/api/teacherSalary', teacherSalaryRouter);
// app.use('/api/feeReceipt', feeReceiptRouter);
app.use('/api/auth',userForReqRouter)
app.use("/api/campus", campusRouter);
app.use('/api/batch',batchRouter)
app.use('/api/subject', subjectRouter);
app.use('/api/subject-allotments', subjectAllotmentRouter);
app.use('/api/voucher',voucherRouter);
app.use('/api/receipt',feeReceiptRouter)
app.use('/api/general-register' ,generalRegisterRouter)
app.use('/api/fee-structure',  feeStructureRouter);
app.use('/api/receipts', receiptsRouter);
app.get('/', checkAuth,(req, res) => {
   res.json(req.user)
});


app.put("/update-masterid", async (req, res) => {
  try {
    // 1️⃣ Fetch all students sorted by insertion order
    const students = await Student.find({}).sort({ "grNumbers.school": 1 });

    if (!students.length) {
      return res.status(404).json({ success: false, message: "No students found" });
    }

    // 2️⃣ Prepare bulk operations
    const bulkOps = students.map((student, index) => ({
      updateOne: {
        filter: { _id: student._id },
        update: { $set: { masterId: index + 1 } } // 1 se counting
      }
    }));

    // 3️⃣ Execute bulk write
    await Student.bulkWrite(bulkOps);

    return res.status(200).json({
      success: true,
      message: `MasterId updated for ${students[0].name} ${students[0].grNumbers.school} students`,
    });
  } catch (err) {
    console.error("Bulk MasterId Update Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating masterId",
    });
  }
});




app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})