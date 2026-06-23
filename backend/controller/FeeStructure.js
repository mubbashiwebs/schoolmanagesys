import FeeStructure from "../models/feeStructure.js";
import Student from "../models/student.js";
/* ================= CREATE / UPDATE FEE STRUCTURE ================= */
export const AddFeeStructure = async (req, res) => {
  try {
    const { name, classFees, campusId } = req.body;

    if (!name || !campusId || !classFees?.length || !req.user.school) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Required fields missing"
      });
    }

    const existing = await FeeStructure.findOne({
      name,
      schoolId: req.user.school,
      campusId
    });

    if (existing) {
      return res.status(409).json({
        status: 409,
        success: false,
        message: "Fee structure already exists",
        data: null
      });
    }

    const feeStructure = await FeeStructure.create({
      name,
      classFees,
      schoolId: req.user.school,
      campusId,
      createdBy: req.user._id
    });

    res.status(201).json({
      status: 201,
      success: true,
      message: "Fee structure created successfully",
      data: feeStructure
    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message
    });
  }
};

/* ================= GET ALL FEE STRUCTURES ================= */
export const getFeeStructures = async (req, res) => {
  try {
    const { campusId } = req.query;

    const filter = { schoolId: req.user.school };
    if (campusId) filter.campusId = campusId;

    const data = await FeeStructure.find(filter)
      .populate("classFees.classId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 200,
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message
    });
  }
};



//   try {
//     const { type } = req.params;
//     const { schoolId, campusId } = req.query;

//     const feeStructure = await FeeStructure.findOne({
//       type,
//       schoolId,
//       campusId,
//       status: "Active"
//     }).populate("classFees.classId", "name");

//     if (!feeStructure) {
//       return res.status(404).json({
//         success: false,
//         message: "Fee structure not found"
//       });
//     }

//     res.json({ success: true, data: feeStructure });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

/* ================= DELETE FEE STRUCTURE ================= */
export const deleteFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findOne({
      _id: req.params.id,
      schoolId: req.user.school
    });

    if (!feeStructure) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Fee structure not found"
      });
    }

    await feeStructure.deleteOne();

    res.status(200).json({
      status: 200,
      success: true,
      message: "Fee structure deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message
    });
  }
};


export const updateFeeStructure = async (req, res) => {
  try {
    const { name, classFees, campusId } = req.body;

    if (!name || !campusId || !classFees?.length) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Required fields missing"
      });
    }

    const feeStructure = await FeeStructure.findOne({
      _id: req.params.id,
      schoolId: req.user.school
    });

    if (!feeStructure) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Fee structure not found"
      });
    }

    const duplicate = await FeeStructure.findOne({
      _id: { $ne: req.params.id },
      name,
      campusId,
      schoolId: req.user.school
    });

    if (duplicate) {
      return res.status(409).json({
        status: 409,
        success: false,
        message: "Fee structure already exists"
      });
    }

    feeStructure.name = name;
    feeStructure.classFees = classFees;
    feeStructure.campusId = campusId;

    await feeStructure.save();

    const students = await Student.find({ feeStructure: feeStructure._id });

    await Promise.all(
      students.map(async (std) => {
        const matchedClass = classFees.find(
          cls => String(cls.classId) === String(std.class)
        );

        if (matchedClass) {
          std.feeDetails.school.originalFee = matchedClass.Fee;
          await std.save();
        }
      })
    );

    res.status(200).json({
      status: 200,
      success: true,
      message: "Fee structure updated successfully",
      data: feeStructure
    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message
    });
  }
};
