import Subject from "../models/subject.js";

// ➕ Add Subject
export const addSubject = async (req, res) => {
  try {
    const { name, campusId } = req.body;
    const schoolId = req.user.school;

    // Duplicate check
    const isExist = await Subject.findOne({
      name,
      campusId,
      schoolId,
    });

    if (isExist) {
      return res.status(409).json({ message: "Subject already exists" });
    }

    const subject = await Subject.create({
      name,
      campusId,
      schoolId,
      createdBy: req.user._id

    });

    const populatedSubject = await Subject.findById(subject._id)
      .populate("schoolId", "name")
      .populate("campusId", "name");

    res.status(201).json({
      data: populatedSubject,
      message: "Subject added successfully"
    });
  } catch (error) {
    console.error("Add Subject Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📚 Get All Subjects of Logged-in School
export const getSubjectsBySchool = async (req, res) => {
  try {
    const schoolId = req.user.school;

    const subjects = await Subject.find({ schoolId })
      .populate("schoolId", "name")
      .populate("campusId", "name");

    res.status(200).json({
      data: subjects,
      message: subjects.length ? "Successfully Found" : "No data found"
    });
  } catch (error) {
    console.error("Get Subjects Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🏫 Get Subjects by Campus (same school)
export const getAllSubjectsByCampus = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const { campusId } = req.params;

    const subjects = await Subject.find({ schoolId, campusId })
      .populate("schoolId", "name")
      .populate("campusId", "name");

    res.status(200).json({
      data: subjects,
      message: subjects.length ? "Successfully Found" : "No data found"
    });
  } catch (error) {
    console.error("Get Subjects By Campus Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ Delete Subject (ownership check)
export const deleteSubject = async (req, res) => {
  try {
    const schoolId = req.user.school;

    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      schoolId
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Delete Subject Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ Update Subject
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, campusId } = req.body;
    const schoolId = req.user.school;

    // Duplicate check
    const isExist = await Subject.findOne({
      _id: { $ne: id },
      name,
      campusId,
      schoolId
    });

    if (isExist) {
      return res.status(409).json({ message: "Subject already exists" });
    }

    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: id, schoolId },
      { name, campusId },
      { new: true }
    )
      .populate("schoolId", "name")
      .populate("campusId", "name");

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({
      data: updatedSubject,
      message: "Subject updated successfully"
    });
  } catch (error) {
    console.error("Update Subject Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
