import Receipt from "../models/receipt.js";
import Student from "../models/student.js";

/* ================= CREATE RECEIPT ================= */
export const createReceipt = async (req, res) => {
  try {
    const {
      voucher,
      student,
      amount,
      totalPayable,
      paymentMethod,
      balanceAfterPayment,
      note,
      month,
      feeType,
      session,
      campusId
    } = req.body;

    if (!voucher || !student || !amount || !feeType || !month || !session || !campusId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const schoolId = req.user.school;

    // 🔢 Generate receipt number (feeType wise)
    const count = await Receipt.countDocuments({ feeType, school: schoolId, campus: campusId });
    const receiptNo = String(count + 1).padStart(3, "0");

    const newReceipt = await Receipt.create({
      receiptNo,
      voucher,
      student,
      amount,
      totalPayable,
      paymentMethod,
      balanceAfterPayment,
      note,
      month,
      feeType,
      session,
      school: schoolId,
      campus: campusId,
      createdBy: req.user._id
    });

    const receipt = await Receipt.findById(newReceipt._id)
      .populate("voucher")
      .populate("student", "name fatherName grNumbers class section")
      .populate("createdBy", "username email")
      .populate("school", "name")
      .populate("campus", "name contact");

    res.status(201).json({
      success: true,
      message: "Receipt created successfully",
      receipt
    });
  } catch (error) {
    console.error("Create Receipt Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= GET RECEIPTS ================= */
export const getReceipts = async (req, res) => {
  try {
    const { studentId, voucherId, month, feeType, campusId } = req.query;

    const filter = {
      school: req.user.school
    };

    if (campusId) filter.campus = campusId;
    if (studentId) filter.student = studentId;
    if (voucherId) filter.voucher = voucherId;
    if (month) filter.month = month;
    if (feeType) filter.feeType = feeType;

    const receipts = await Receipt.find(filter)
      .populate("voucher")
      .populate("student", "name fatherName grNumbers class section")
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      receipts
    });
  } catch (error) {
    console.error("Get Receipts Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= GET SINGLE RECEIPT ================= */
export const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      school: req.user.school
    })
      .populate("voucher")
      .populate("student", "name fatherName grNumbers class section")
      .populate("createdBy", "username email")
      .populate("school", "name")
      .populate("campus", "name contact");

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found"
      });
    }

    res.status(200).json({
      success: true,
      receipt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Update receipt
export const updateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Receipt.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: "Receipt not found" });

    res.json({ success: true, receipt: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= DELETE RECEIPT ================= */
export const deleteReceipt = async (req, res) => {
  try {
    const deleted = await Receipt.findOneAndDelete({
      _id: req.params.id,
      school: req.user.school
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Receipt deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
 }
};


/* ================= GET RECEIPT BY GR NUMBER ================= */
export const getReceiptForStudent = async (req, res) => {
  try {
    const { stdGrno, feeType, month, session, campusId } = req.body;

    if (!stdGrno || !feeType || !month || !session || !campusId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const schoolId = req.user.school;

    const student = await Student.findOne({
      [`grNumbers.${feeType}`]: stdGrno,
      schoolId,
      campusId
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const receipt = await Receipt.findOne({
      student: student._id,
      feeType,
      month,
      session,
      school: schoolId,
      campus: campusId
    })
      .populate("student", "name fatherName class section grNumbers")
      .populate("voucher")
      .populate("school", "name")
      .populate("campus", "name contact");

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found"
      });
    }

    res.status(200).json({
      success: true,
      data: receipt
    });
  } catch (error) {
    console.error("Get Receipt Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




