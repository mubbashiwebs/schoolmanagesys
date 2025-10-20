
import Subject from "../models/subject.js";
// Add Subject
export const addSubject = async (req, res) => {
  try {
    // Check if subject already exists
    const isSubjectExist = await Subject.findOne({
      schoolId: req.body.schoolId,
      name: req.body.name,
      campusId: req.body.campusId,
    });

    if (isSubjectExist) {
      return res.json({ message: "Subject Already Exist" });
    }

    // Save new subject
    const subjectData = new Subject(req.body);
    await subjectData.save();

    // Fetch newly added subject with populated school & campus
    const newSubject = await Subject.findOne({
      name: subjectData.name,
      schoolId: subjectData.schoolId,
      campusId: subjectData.campusId,
    })
      .populate("schoolId", "name")
      .populate("campusId", "name");

    res.json({ data: newSubject, message: "Successfully added" });
  } catch (error) {
    console.error("Add Subject Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get Subjects by School (Admin)
export const getSubjectsBySchool = async (req, res) => {
  try {
    const subjects = await Subject.find({ schoolId: req.params.schoolId })
      .populate("schoolId", "name")
      .populate("campusId", "name");

    if (subjects.length > 0) {
      res.json({ data: subjects, message: "Successfully Found" });
    } else {
      res.json({ data: [], message: "Data not Found" });
    }
  } catch (error) {
    console.error("Get Subjects by School Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get All Subjects
export const getAllSubjectsByCampus = async (req, res) => {
  try {
    const subjects = await Subject.find({ schoolId: req.params.schoolId, campusId: req.params.campusId });  
    if (subjects.length > 0) {
      res.json({ data: subjects, message: "Successfully Found" });
    } else {
      res.json({ data: [], message: "Data not Found" });
    }
  } catch (error) {
    console.error("Get All Subjects by Campus Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Delete Subject
export const deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Subject deleted" });
  } catch (error) {
    console.error("Delete Subject Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Update Subject
export const updateSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;
    const { name, schoolId } = req.body;
    // Check if another subject with the same name and schoolId exists
    const existingSubject = await Subject.findOne({
      _id: { $ne: subjectId }, // exclude the current subject
      name,
      schoolId,
      campusId
    });
    if (existingSubject) {
      return res.json({ data: [], message: "Subject with this name already exists in the selected school" });
    }
    const updatedSubject = await Subject.findByIdAndUpdate(
      subjectId,
      req.body,
      { new: true }
    ).populate('schoolId', 'name').populate('campusId', 'name')

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ data: updatedSubject, message: "Subject updated successfully" });
  } catch (error) {
    console.error("Update Subject Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
