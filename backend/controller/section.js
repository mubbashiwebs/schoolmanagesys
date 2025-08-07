import Section from "../models/section.js";
// Add Section
export const addSection = async (req, res) => {
  try {
    const isSectionExist = await Section.find({ schoolId: req.body.schoolId, name: req.body.name });

    if (isSectionExist.length > 0) {
      return res.json({ data: [], message: "Section Already Exist" });
    }

    const newSectionEntry = new Section(req.body);
    await newSectionEntry.save();
            var newSection = await Section.findOne({name : newSectionEntry.name, schoolId : newSectionEntry.schoolId}).populate('schoolId', 'name')
    
    res.json({ data: newSection, message: 'Successfully added' });
  } catch (error) {
    console.error("Add Section Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Sections by School
export const getSectionsBySchool = async (req, res) => {
  try {
    const sections = await Section.find({ schoolId: req.params.schoolId });
    res.json({ data: sections });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Sections (Super Admin)
export const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find().populate('schoolId', 'name')
    res.json({ data: sections });
  } catch (error) {
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
    ).populate('schoolId', 'name');

    if (!updatedSection) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json({ data: updatedSection, message: "Section updated successfully" });
  } catch (error) {
    console.error("Update Section Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
