import express from 'express'
import cors from 'cors'
import { connectDb } from './db/config.js'
import schoolRouter from es/school.js'
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
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
connectDb()
const port = 3000
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
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})