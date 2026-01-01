
import mongoose from "mongoose";
const VoucherSchema = new mongoose.Schema({
voucherNo:{type:Number, required:true},
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeType: { type: String, enum: ['school','tuition','computer','english'], required: true },
  month: { type: String, required: true },    // format: '2025-10' (YYYY-MM)
 
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", default: null },
  coachingClass: { type: mongoose.Schema.Types.ObjectId, ref: "CoachClass", default: null },
  computerCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
  computerCourseBatch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", default: null },
  englishCourse: { type: mongoose.Schema.Types.ObjectId, ref: "EnglishCourse", default: null },
  engCourseBatch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", default: null },
  breakdown: {                                // detailed charge items
    monthlyFee: { type: Number, default: 0 },
    extras: [{ name: String, amount: Number }], // admission, annual, transport, ...
    previousDuesTotal: { type: Number, default: 0 },
  },
  previousDuesDetail: [{ month: String, amount: Number, voucherId: mongoose.Schema.Types.ObjectId }],
  totalPayable: { type: Number, required: true },
  totalPayableWithLateFee: { type: Number, required: true },
  status: { type: String, enum: ['Unpaid','Partial','Paid'], default: 'Unpaid' },
  issueDate: { type: Date},
    dueDate: { type: Date },
    expireDate: { type: Date },
    showArrears:{type:Boolean , default:true},
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    campus: { type: mongoose.Schema.Types.ObjectId, ref: "Campus", default: null },
  school: { type: mongoose.Schema.Types.ObjectId, ref: "school", default: null },
}, { timestamps: true });

// Prevent duplicate voucher creation: unique per student+feeType+month+session
VoucherSchema.index({ student: 1, feeType: 1, month: 1, session: 1 }, { unique: true });

const Voucher = mongoose.model('Voucher', VoucherSchema);
export default Voucher