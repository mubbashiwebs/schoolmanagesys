import Receipt from "../models/receipt.js";
import Voucher from "../models/voucher.js";
import Student from "../models/student.js";

// ✅ Add new receipt
export const createReceipt = async (req, res) => {
  try {
    const { voucher, student, amount, totalPayable,paymentMethod, balanceAfterPayment ,note, month ,feeType,session,createdBy ,school,campus } = req.body;

    if (!voucher || !student || !amount) {
      return res.status(400).json({ message: "Voucher, student, and amount are required" });
    }

    var receiptNo
    
    const existingR = await Receipt.find({feeType})
    // console.log('existingV',existingV.length)
    
        receiptNo = (existingR.length + 1).toString().padStart(3,'0')

    // Save receipt
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
      school,
        campus,
      session,
      createdBy,
    });
    const receipt = await Receipt.findById(newReceipt._id)
    .populate("voucher")
    .populate("student", "name fatherName grNumbers class section")
    .populate("createdBy", "username email")
    .populate("school", "name")
    .populate("campus", "name contact");
    res.status(201).json({ success: true, receipt: receipt, message: "Receipt created successfully" });
  } catch (err) {
    console.error("Error creating receipt:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get all receipts (with filters)
export const getReceipts = async (req, res) => {
  try {
    const { studentId, voucherId, month, feeType } = req.query;

    let query = {};

    if (studentId) query.student = studentId;
    if (voucherId) query.voucher = voucherId;

    // Filter by feeType or month (join through voucher)
    if (feeType || month) {
      query = {
        ...query,
        ...(feeType && { feeType }),
        ...(month && { month }),
      };
    }

    const receipts = await Receipt.find(query)
      .populate("voucher")
      .populate("student", "name fatherName grNumber class section")
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    res.json({ success: true, receipts });
  } catch (err) {
    console.error("Error fetching receipts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get single receipt
export const getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await Receipt.findById(id)
      .populate("voucher")
      .populate("student")
      .populate("createdBy", "username email");

    if (!receipt) return res.status(404).json({ message: "Receipt not found" });

    res.json({ success: true, receipt });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
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

// ✅ Delete receipt
export const deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Receipt.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Receipt not found" });

    res.json({ success: true, message: "Receipt deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// controllers/receiptController.js

export const getReceiptForStudent = async (req, res) => {
  try {
    const { stdGrno, feeType, month, session, school, campus } = req.body;

    // Validation check
    if (!stdGrno || !feeType || !month || !session || !school || !campus) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // 1️⃣ Student find by GR number + school + campus
    const student = await Student.findOne({
      [`grNumbers.${feeType}`]: stdGrno,
      schoolId: school,
      campusId: campus,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // 2️⃣ Receipt find by student id + other filters
    const receipt = await Receipt.findOne({
      student: student._id,
      feeType,
      month,
      session,
      school,
      campus,
    })
      .populate("student", "name fatherName class section grNumbers") // optional
      .populate('voucher')
      .populate("school", "name")
      .populate("campus", "name contact")
      .lean();

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found." });
    }

    // 3️⃣ Return response
    res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    console.error("Error fetching receipt:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



