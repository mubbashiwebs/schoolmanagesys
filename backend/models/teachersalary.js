import mongoose from 'mongoose'


const teacherSalarySchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  salaryMonth: {
    type: String, // Example: "June 2025"
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Cheque', 'JazzCash', 'EasyPaisa'],
    required: true
  },
  paidBy: {
    type: String, // Name of admin or user who made the payment
    required: true
  },
 
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
      required: true
    }

});

const teacherSalary = mongoose.model('TeacherSalary', teacherSalarySchema);

export default teacherSalary