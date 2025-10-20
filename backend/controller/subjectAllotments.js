import SubjectAllotment from "../models/subjectAllotments.js";
// ✅ Create new Subject Allotment
export const createSubjectAllotment = async (req, res) => {
  try {
    const { classId, sectionId, subjectId, teacherId, isClassTeacher , createdBy } = req.body;

    // (Optional Rule) ek class me ek hi classTeacher allowed ho
    if (isClassTeacher) {
      const existingClassTeacher = await SubjectAllotment.findOne({
        classId,
        isClassTeacher: true
      });
      if (existingClassTeacher) {
        return res.status(400).json({
          message: "This class already has a class teacher assigned."
        });
      }
    }

    const newAllotment = await SubjectAllotment.create({
      classId,
      sectionId,
      subjectId,
      teacherId,
      isClassTeacher: isClassTeacher || false,
      createdBy

    });

    res.status(201).json({
      message: "Subject allotment created successfully",
      data: newAllotment
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating subject allotment", error: error.message });
  }
};

// ✅ Get All Subject Allotments
export const getAllSubjectAllotments = async (req, res) => {
  try {
    const allotments = await SubjectAllotment.find()
      .populate("classId", "name fee tuitionFee admissionFee")
      .populate("sectionId", "name")
      .populate("subjectId", "name")
      .populate("teacherId", "name staffCode fatherName email");

    res.status(200).json({
      message: "All subject allotments fetched",
      data: allotments
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching subject allotments", error: error.message });
  }
};

// ✅ Get Single Subject Allotment
export const getSubjectAllotmentById = async (req, res) => {
  try {
    const allotment = await SubjectAllotment.findById(req.params.id)
      .populate("classId", "name fee tuitionFee admissionFee")
      .populate("sectionId", "name")
      .populate("subjectId", "name")
      .populate("teacherId", "name staffCode fatherName email");

    if (!allotment) {
      return res.status(404).json({ message: "Subject allotment not found" });
    }

    res.status(200).json({
      message: "Subject allotment fetched",
      data: allotment
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching subject allotment", error: error.message });
  }
};

// ✅ Update Subject Allotment
export const updateSubjectAllotment = async (req, res) => {
  try {
    const { classId, sectionId, subjectId, teacherId, isClassTeacher } = req.body;

    // (Optional Rule) ek class me ek hi classTeacher allowed ho
    if (isClassTeacher) {
      const existingClassTeacher = await SubjectAllotment.findOne({
        classId,
        isClassTeacher: true,
        _id: { $ne: req.params.id } // apna record exclude karna
      });
      if (existingClassTeacher) {
        return res.status(400).json({
          message: "This class already has a class teacher assigned."
        });
      }
    }

    const updatedAllotment = await SubjectAllotment.findByIdAndUpdate(
      req.params.id,
      { classId, sectionId, subjectId, teacherId, isClassTeacher },
      { new: true }
    )
      .populate("classId", "name fee tuitionFee admissionFee")
      .populate("sectionId", "name")
      .populate("subjectId", "name")
      .populate("teacherId", "name staffCode fatherName email");

    if (!updatedAllotment) {
      return res.status(404).json({ message: "Subject allotment not found" });
    }

    res.status(200).json({
      message: "Subject allotment updated successfully",
      data: updatedAllotment
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating subject allotment", error: error.message });
  }
};

// ✅ Delete Subject Allotment
export const deleteSubjectAllotment = async (req, res) => {
  try {
    const deletedAllotment = await SubjectAllotment.findByIdAndDelete(req.params.id);

    if (!deletedAllotment) {
      return res.status(404).json({ message: "Subject allotment not found" });
    }

    res.status(200).json({
      message: "Subject allotment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subject allotment", error: error.message });
  }
};
