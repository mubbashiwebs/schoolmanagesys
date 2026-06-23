import mongoose from "mongoose";
import Receipt from "../models/receipts.js";
import Student from "../models/student.js";

// ===============================
// 🔢 Generate Receipt Number
// ===============================
const generateReceiptNumber = async (schoolId) => {
  const count = await Receipt.countDocuments({ schoolId });
  return `RCPT-${schoolId.toString().slice(-4)}-${count + 1}`;
};

// ===============================
// ✅ CREATE RECEIPT
// ===============================
export const createReceipt = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { date, amount, student, paymentMethod , campusId , classId , sectionId, receiptType } = req.body;

    // 🔒 Backend School & Campus (Never trust frontend)
    const schoolId = req.user.school;
   
    const createdBy = req.user._id;

    // ================= VALIDATION =================
    if (!date || !amount || !student) {
      return res.status(400).json({
        success: false,
        message: "Date, Amount and Student are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // ================= STUDENT CHECK =================
    const existingStudent = await Student.findOne({
      _id: student,
      schoolId,
      campusId,
    }).session(session);

    if (!existingStudent) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Student not found or unauthorized",
      });
    }

    // ================= GENERATE RECEIPT NUMBER =================
    const receiptNumber = await generateReceiptNumber(schoolId);

    // ================= CREATE RECEIPT =================
    const newReceipt = await Receipt.create(
      [
        {
          receiptNumber,
          date,
          amount,
          student,
          paymentMethod,
          schoolId,
          campusId,
          createdBy,
          class: classId,
          section: sectionId,
          type: receiptType,
          status: "Paid",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Receipt created successfully",
      data: newReceipt[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Create Receipt Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating receipt",
    });
  }
};

// ===============================
// ✅ GET ALL RECEIPTS (School + Campus Filtered)
// ===============================
export const getAllReceipts = async (req, res) => {
  try {
    const schoolId = req.user.school;
   

    const receipts = await Receipt.find({
      schoolId,
    
    })
     
          .populate({
  path: "student",
  select: "name fatherName  grNumbers class section",   // 👈 Only these fields
  populate: [
    { path: "class", select: "name" },
    { path: "section", select: "name" }
  ]
})
      .populate('class', 'name')
      .populate('section', 'name')
      .populate("createdBy", "username email")
    
      
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: receipts.length,
      data: receipts,
    });
  } catch (error) {
    console.error("Get Receipts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching receipts",
    });
  }
};

export const getAllReceiptsByCampus = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const campusId = req.params.campusId;

    const receipts = await Receipt.find({
      schoolId,
      campusId,
    })
          .populate({
  path: "student",
  select: "name fatherName  grNumbers class section",   // 👈 Only these fields
  populate: [
    { path: "class", select: "name" },
    { path: "section", select: "name" }
  ]
})

   .populate('class', 'name')
      .populate('section', 'name')
      .populate("createdBy", "username email")
   
      
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: receipts.length,
      data: receipts,
    });
  } catch (error) {
    console.error("Get Receipts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching receipts",
    });
  }
};

// ===============================
// ✅ GET SINGLE RECEIPT
// ===============================
export const getSingleReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user.school;
    const campusId = req.user.campus;

    const receipt = await Receipt.findOne({
      _id: id,
      schoolId,
      campusId,
    })
      .populate("student", "name fatherName class section")
      .populate("createdBy", "username role");

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    console.error("Get Single Receipt Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching receipt",
    });
  }
};

// ===============================
// ✅ DELETE RECEIPT (Admin Only Recommended)
// ===============================
export const deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.user.school;
    const campusId = req.user.campus;

    const receipt = await Receipt.findOne({
      _id: id,
      schoolId,
      campusId,
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found or unauthorized",
      });
    }

    await receipt.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Receipt deleted successfully",
    });
  } catch (error) {
    console.error("Delete Receipt Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting receipt",
    });
  }
};
