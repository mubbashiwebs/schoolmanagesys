
import mongoose from "mongoose";
const ReceiptSchema = new mongoose.Schema({
    receiptNo:{type:String,required:true},
  voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', required: true },
  student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  month: { type: String }, // e.g., 'January 2024'
  session: { type: String }, // e.g., '2023-2024'
  amount: { type: Number, required: true },
  totalPayable: { type: Number },
  paymentMethod: { type: String }, // Cash, Bank, Easypaisa, etc
  date: { type: Date, default: Date.now },
  balanceAfterPayment: { type: Number },
  note: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'school', required: true },
    feeType: { type: String, required: true } ,// tuition, admission, transport, etc
    campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true }
}, { timestamps: true });

// Index receipts by voucher for fast aggregation
// ReceiptSchema.in/dex({ voucher: 1 });
const Receipt = mongoose.model('Receipt', ReceiptSchema);
export default Receipt