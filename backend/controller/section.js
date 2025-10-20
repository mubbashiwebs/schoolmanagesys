import Section from "../models/section.js";
// Add Section
// section.js

// Add Section
export const addSection = async (req, res) => {
  try {
    // Check if section already exists
    const isSectionExist = await Section.findOne({
      schoolId: req.body.schoolId,
      name: req.body.name,
      campusId: req.body.campusId,
    });

    if (isSectionExist) {
      return res.json({ message: "Section Already Exist" });
    }

    // Save new section
    const sectionData = new Section(req.body);
    await sectionData.save();

    // Fetch newly added section with populated school & campus
    const newSection = await Section.findOne({
      name: sectionData.name,
      schoolId: sectionData.schoolId,
      campusId: sectionData.campusId,
    })
      .populate("schoolId", "name")
      .populate("campusId", "name");

    res.json({ data: newSection, message: "Successfully added" });
  } catch (error) {
    console.error("Add Section Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Sections by School (Admin)
export const getSectionsBySchool = async (req, res) => {
  try {
    const sections = await Section.find({ schoolId: req.params.schoolId })
      .populate("schoolId", "name")
      .populate("campusId", "name");

    if (sections.length > 0) {
      res.json({ data: sections, message: "Successfully Found" });
    } else {
      res.json({ data: [], message: "Data not Found" });
    }
  } catch (error) {
    console.error("Get Sections by School Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Sections (Super Admin)
export const getAllSectionsByCampus = async (req, res) => {
  try {
    const sections = await Section.find({ schoolId: req.params.schoolId, campusId: req.params.campusId })
      .populate("schoolId", "name")
      .populate("campusId", "name");

    if (sections.length > 0) {
      res.json({ data: sections, message: "Successfully Found" });
    } else {
      res.json({ data: [], message: "Data not Found" });
    }
  } catch (error) {
    console.error("Get All Sections Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete Section
export const deleteSection = async (req, res) => {
    console.log('reach')
  try {
    await Section.findByIdAndDelete(req.params.id);
    res.json({ message: "Section deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Section
export const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, schoolId } = req.body;

    // Check if another section with the same name exists in the same school
    const existingSection = await Section.findOne({
      _id: { $ne: id },
      name: name,
      schoolId: schoolId
    });

    if (existingSection) {
      return res.json({ message: "Section with this name already exists in the same school." });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      id,
      { name, schoolId },
      { new: true }
    ).populate('schoolId', 'name').populate('campusId', 'name');

    if (!updatedSection) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json({ data: updatedSection, message: "Section updated successfully" });
  } catch (error) {
    console.error("Update Section Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
