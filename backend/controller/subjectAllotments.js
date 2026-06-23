import SubjectAllotment from "../models/subjectAllotments.js";

/* ================= CREATE SUBJECT ALLOTMENT ================= */
export const createSubjectAllotment = async (req, res) => {
  try {
    const {
      classId,
      sectionId,
      subjectId,
      teacherId,
      isClassTeacher,
      campusId
    } = req.body;

    const schoolId = req.user.school;

    // 🔒 One class → one class teacher
    if (isClassTeacher) {
      const existingClassTeacher = await SubjectAllotment.findOne({
        classId,
        schoolId,
        campusId,
        isClassTeacher: true
      });

      if (existingClassTeacher) {
        return res.status(400).json({
          message: "This class already has a class teacher assigned"
        });
      }
    }

    // 🚫 Duplicate subject allotment check
    const duplicate = await SubjectAllotment.findOne({
      classId,
      sectionId,
      subjectId,
      schoolId,
      campusId
    });

    if (duplicate) {
      return res.status(409).json({
        message: "This subject is already allotted to this class/section"
      });
    }

    const allotment = await SubjectAllotment.create({
      classId,
      sectionId,
      subjectId,
      teacherId,
      isClassTeacher: isClassTeacher || false,
      campusId,
      schoolId,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Subject allotment created successfully",
      data: allotment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating subject allotment",
      error: error.message
    });
  }
};

/* ================= GET ALL SUBJECT ALLOTMENTS ================= */
export const getAllSubjectAllotments = async (req, res) => {
  console.log("Fetching subject allotments for school:", req.user.school);
  try {
    const { campusId } = req.query;
    console.log("Fetching subject allotments for school:", req.user.school, "campus:", campusId);
    const schoolId = req.user.school;

    const filter = { schoolId };
    if (campusId) filter.campusId = campusId;

    const allotments = await SubjectAllotment.find(filter)
      .populate("classId", "name fee tuitionFee admissionFee")
      .populate("sectionId", "name")
      .populate("subjectId", "name")
      .populate("teacherId", "name staffCode fatherName email")
      .populate("campusId", "name");

    res.status(200).json({
      message: "Subject allotments fetched successfully",
      data: allotments
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching subject allotments",
      error: error.message
    });
  }
};

/* ================= GET SINGLE SUBJECT ALLOTMENT ================= */
export const getSubjectAllotmentById = async (req, res) => {
  try {
    const allotment = await SubjectAllotment.findOne({
      _id: req.params.id,
      schoolId: req.user.school
    })
      .populate("classId", "name fee tuitionFee admissionFee")
      .populate("sectionId", "name")
      .populate("subjectId", "name")
      .populate("teacherId", "name staffCode fatherName email")
      .populate("campusId", "name");

    if (!allotment) {
      return res.status(404).json({
        message: "Subject allotment not found"
      });
    }

    res.status(200).json({
      message: "Subject allotment fetched successfully",
      data: allotment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching subject allotment",
      error: error.message
    });
  }
};

/* ================= UPDATE SUBJECT ALLOTMENT ================= */
export const updateSubjectAllotment = async (req, res) => {
  try {
    const {
      classId,
      sectionId,
      subjectId,
      teacherId,
      isClassTeacher,
      campusId
    } = req.body;

    const schoolId = req.user.school;

    // 🔒 One class → one class teacher
    if (isClassTeacher) {
      const existingClassTeacher = await SubjectAllotment.findOne({
        classId,
        campusId,
        schoolId,
        isClassTeacher: true,
        _id: { $ne: req.params.id }
      });

      if (existingClassTeacher) {
        return res.status(400).json({
          message: "This class already has a class teacher assigned"
        });
      }
    }

    // 🚫 Duplicate check
    const duplicate = await SubjectAllotment.findOne({
      _id: { $ne: req.params.id },
      classId,
      sectionId,
      subjectId,
      campusId,
      schoolId
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Duplicate subject allotment not allowed"
      });
    }

    const updatedAllotment = await SubjectAllotment.findOneAndUpdate(
      { _id: req.params.id, schoolId },
      { classId, sectionId, subjectId, teacherId, isClassTeacher, campusId },
      { new: true }
    )
      .populate("classId", "name fee tuitionFee admissionFee")
      .populate("sectionId", "name")
      .populate("subjectId", "name")
      .populate("teacherId", "name staffCode fatherName email")
      .populate("campusId", "name");

    if (!updatedAllotment) {
      return res.status(404).json({
        message: "Subject allotment not found"
      });
    }

    res.status(200).json({
      message: "Subject allotment updated successfully",
      data: updatedAllotment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating subject allotment",
      error: error.message
    });
  }
};

/* ================= DELETE SUBJECT ALLOTMENT ================= */
export const deleteSubjectAllotment = async (req, res) => {
  try {
    const deleted = await SubjectAllotment.findOneAndDelete({
      _id: req.params.id,
      schoolId: req.user.school
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Subject allotment not found"
      });
    }

    res.status(200).json({
      message: "Subject allotment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting subject allotment",
      error: error.message
    });
  }
};
