import Campus from "../models/campus.js";

// Create Campus
export const createCampus = async (req, res) => {
  try {
    const {  name, address, contact, email, principalName , code , createdBy} = req.body;
    const schoolId = req.user.school;
    if (!schoolId || !name || !address || !contact || !code || !principalName) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const campus = new Campus({
      schoolId,
      name,
      address,
      contact,
      email,
      code,
      principalName,
      createdBy
    });

    await campus.save();

    res.status(201).json({ message: "Campus created successfully.", campus });
  } catch (error) {
    console.error("Error creating campus:", error);
    res.status(500).json({ message: "S  erver error." });
  }
};

// Get All Campuses for a School
export const getCampusesBySchool = async (req, res) => {
  try {
   
   let schoolId = req.user.school
    // console.log(schoolId)
    const campuses = await Campus.find({ schoolId });
    // console.log(campuses)
    res.status(200).json(campuses);
  } catch (error) {
    console.error("Error fetching campuses:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update Campus
export const updateCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCampus = await Campus.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCampus) {
      return res.status(404).json({ message: "Campus not found." });
    }

    res.status(200).json({ message: "Campus updated successfully.", campus: updatedCampus });
  } catch (error) {
    console.error("Error updating campus:", error); 
    res.status(500).json({ message: "Server error." });
  }
};

// Delete Campus
export const deleteCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const campus = await Campus.findByIdAndDelete(id);

    if (!campus) {
      return res.status(404).json({ message: "Campus not found." });
    }

    res.status(200).json({ message: "Campus deleted successfully." });
  } catch (error) {
    console.error("Error deleting campus:", error);
    res.status(500).json({ message: "Server error." });
  }
};
