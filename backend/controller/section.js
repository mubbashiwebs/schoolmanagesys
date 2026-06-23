

import Section from "../models/section.js";

// ================= ADD SECTION =================
export const addSection = async (req, res) => {
  try {
    const { name, campusId } = req.body;
    const schoolId = req.user.school;

    // Duplicate check
    const isSectionExist = await Section.findOne({
      name,
      campusId,
      schoolId
    });

    if (isSectionExist) {
      return res.status(409).json({ message: "Section already exists" });
    }

    const section = await Section.create({
      name,
      campusId,
      schoolId,
      createdBy: req.user._id
    });

    const populatedSection = await Section.findById(section._id)
      .populate("schoolId", "name")
      .populate("campusId", "name");

    res.status(201).json({
      data: populatedSection,
      message: "Section added successfully"
    });

  } catch (error) {
    console.error("Add Section Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET SECTIONS BY SCHOOL =================
export const getSectionsBySchool = async (req, res) => {
  try {
    const schoolId = req.user.school;

    const sections = await Section.find({ schoolId })
      .populate("schoolId", "name")
      .populate("campusId", "name");

    res.status(200).json({
      data: sections,
      message: sections.length ? "Data found" : "No data found"
    });

  } catch (error) {
    console.error("Get Sections Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET SECTIONS BY CAMPUS =================
export const getAllSectionsByCampus = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const { campusId } = req.params;

    const sections = await Section.find({ schoolId, campusId })
      .populate("schoolId", "name")
      .populate("campusId", "name");

    res.status(200).json({
      data: sections,
      message: sections.length ? "Data found" : "No data found"
    });

  } catch (error) {
    console.error("Get Sections By Campus Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= UPDATE SECTION =================
export const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, campusId } = req.body;
    const schoolId = req.user.school;

    // Ownership + existence check
    const exist = await Section.findOne({ _id: id, schoolId });
    if (!exist) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Duplicate check
    const duplicate = await Section.findOne({
      _id: { $ne: id },
      name,
      campusId,
      schoolId
    });

    if (duplicate) {
      return res.status(409).json({ message: "Section already exists" });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      id,
      { name, campusId },
      { new: true }
    )
      .populate("schoolId", "name")
      .populate("campusId", "name");

    res.status(200).json({
      data: updatedSection,
      message: "Section updated successfully"
    });

  } catch (error) {
    console.error("Update Section Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= DELETE SECTION =================
export const deleteSection = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const { id } = req.params;

    const section = await Section.findOne({ _id: id, schoolId });
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    await section.deleteOne();

    res.status(200).json({ message: "Section deleted successfully" });

  } catch (error) {
    console.error("Delete Section Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
