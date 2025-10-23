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
import feeReceiptRouter from './routes/stdFeeReceipt.js'
import userForReqRouter from './routes/userforreq.js'
import campusRouter from './routes/campus.js'
import batchRouter from './routes/batch.js'
import subjectRouter from './routes/subject.js'
import subjectAllotmentRouter from './routes/subjectAllotments.js'
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
app.use('/api/section', sectionRouter);
app.use('/api/course', courseRouter);
app.use("/api/student", studentRouter);
app.use('/api/teacher' , teacherRouter )
app.use('/api/english-courses', englishCourseRoutes);
app.use('/api/teacherSalary', teacherSalaryRouter);
app.use('/api/feeReceipt', feeReceiptRouter);
app.use('/api/auth',userForReqRouter)
app.use("/api/campus", campusRouter);
app.use('/api/batch',batchRouter)
app.use('/api/subject', subjectRouter);
app.use('/api/subject-allotments', subjectAllotmentRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})