import mongoose from 'mongoose';

const feeReceiptSchema = new mongoose.Schema({
  grno: { type: Number, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  name: String,
  fatherName: String,
  class: String,
  section: String,
  totalFee: Number,
  paymentType: { type: String, enum: ['full', 'balance'], required: true },
  paidAmount: Number,
  month: String,
  year: String,
  paymentMethod: String,
  schoolId : String,
  createdAt: { type: Date, default: Date.now },
   createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
});

const FeeReceipt = mongoose.model('FeeReceipt', feeReceiptSchema);
export default FeeReceipt;
