import express from 'express'
import cors from 'cors'
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
import dotenv from "dotenv";
dotenv.config();
connectDb()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
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
app.get('/', (req, res) => {
    res.send('Hello World!');
});




// app.post('/generate', async (req, res) => {
//   try {
//     const payload = req.body;
//     const { feeType, month, session: acadSession  } = payload;

//     // 1) FILTER STUDENTS
//   let studentsQuery = {
//   class: null,
//   section: null,
//   coachingClass: null,
//   computerCourse: null,
//   computerCourseBatch: null,
//   englishCourse: null,
//   engCourseBatch: null,
//   campusId: null,
//   schoolId: null
// };

// // Filter according to feeType
// if (feeType === "school") {
//   studentsQuery.class = payload.class || null;
//   if (payload.section) studentsQuery.section = payload.section || null;
//   if (payload.campusId) studentsQuery.campusId = payload.campusId;
//   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;

// } else if (feeType === "tuition") {
//   studentsQuery.coachingClass = payload.coachingClass || null;
//   if (payload.campusId) studentsQuery.campusId = payload.campusId;
//   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;

// } else if (feeType === "computer") {
//   studentsQuery.computerCourse = payload.courseId || null;
//   studentsQuery.computerCourseBatch = payload.batchId || null;
//   if (payload.campusId) studentsQuery.campusId = payload.campusId;
//   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;

// } else if (feeType === "english") {
//   studentsQuery.englishCourse = payload.engCourseId || null;
//   studentsQuery.engCourseBatch = payload.engBatchId || null;
//   if (payload.campusId) studentsQuery.campusId = payload.campusId;
//   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;
// }

// // Remove null fields before querying
// Object.keys(studentsQuery).forEach(
//   (key) => studentsQuery[key] === null && delete studentsQuery[key]
// );

// // finally get matching students
// const students = await Student.find(studentsQuery);

//     console.log(students)
//     if (!students.length)
//       return res.status(404).json({ message: "No students found" });

//     const createdVouchers = [];

//     for (const st of students) {

//       // 2) Prevent duplicate for same month
//       const exists = await Voucher.findOne({
//         student: st._id,
//         feeType,
//         month,
//         session: acadSession
//       });

//       if (exists) {
//         createdVouchers.push({
//           student: st._id,
//           skipped: true,
//           reason: "voucher exists"
//         });
//         continue;
//       }

//       // 3) Calculate previous dues
//       const { total: previousDuesTotal, detail: previousDuesDetail } =
//         await computePreviousDuesForStudent(st._id, feeType);

//       // 4) Calculate current month breakdown
//       const monthlyFee = Number(payload.monthlyFee || 0);
//       const extras = Array.isArray(payload.extras) ? payload.extras : [];
//       const extrasTotal = extras.reduce((s, e) => s + Number(e.amount || 0), 0);

//       const totalPayable = monthlyFee + extrasTotal + previousDuesTotal;

//       // 5) Save voucher
//      const voucherData = {
//   student: st._id,
//   feeType,
//   month,
//   session: acadSession,
//   class: null,
//   coachingClass: null,
//   computerCourse: null,
//   computerCourseBatch: null,
//   englishCourse: null,
//   engCourseBatch: null,
//   campus: st.campusId || null,
//   school: st.schoolId || null,
//   breakdown: {
//     monthlyFee:st.feeDetails?.[feeType]?.payableFee || monthlyFee,
//     extras,
//     previousDuesTotal,
//   },
//   previousDuesDetail,
//   totalPayable,
//   issueDate: payload.issueDate,
//   dueDate: payload.dueDate ,
//   expireDate: payload.expireDate ,
//   status: totalPayable === 0 ? "Paid" : "Unpaid",
//   createdBy: payload.generatedBy || null,
// };

// // map fields based on feeType
// if (feeType === "school") {
//   voucherData.class = st.class || null;

// } else if (feeType === "tuition") {
//   voucherData.coachingClass = st.coachingClass || null;

// } else if (feeType === "computer") {
//   voucherData.computerCourse = payload.courseId || st.computerCourse || null;
//   voucherData.computerCourseBatch = payload.batchId || st.computerCourseBatch || null;

// } else if (feeType === "english") {
//   voucherData.englishCourse = payload.engCourseId || st.englishCourse || null;
//   voucherData.engCourseBatch = payload.engBatchId || st.engCourseBatch || null;
// }

// voucherData.campus = st.campusId || null;
// voucherData.school = st.schoolId || null;
// // finally create the voucher
// const voucherDoc = await Voucher.create(voucherData);

//       createdVouchers.push({
//         student: st._id,
//         voucherId: voucherDoc._id,
//         skipped: false
//       });
//     }

//     return res.json({ success: true, created: createdVouchers });

//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})