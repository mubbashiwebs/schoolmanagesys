import Course from "../models/computercourse.js";
// Add Course
export const addCourse = async (req, res) => {
  try {
    const existingCourse = await Course.find({
      schoolId: req.body.schoolId,
      name: req.body.name
    });

    if (existingCourse.length > 0) {
      return res.json({ data: [], message: "Course already exists" });
    }

    const newCourseEntry = new Course(req.body);
    await newCourseEntry.save();
          var newCourse = await Course.findOne({name : newCourseEntry.name, schoolId : newCourseEntry.schoolId}).populate('schoolId', 'name')
  
    res.json({ data: newCourse, message: "Successfully added" });
  } catch (error) {
    console.error("Add Course Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Courses by School
export const getCoursesBySchool = async (req, res) => {
  try {
    const courses = await Course.find({ schoolId: req.params.schoolId });
    res.json({ data: courses });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Courses (Super Admin)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('schoolId',"name")
    res.json({ data: courses });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Course
export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { name, schoolId } = req.body;

    // Check if another course with the same name and schoolId exists
    const existingCourse = await Course.findOne({
      _id: { $ne: courseId }, // exclude the current course
      name,
      schoolId
    });

    if (existingCourse) {
      return res.json({ data: [], message: "Course with this name already exists in the selected school" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      req.body,
      { new: true }
    ).populate('schoolId', 'name');

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ data: updatedCourse, message: "Course updated successfully" });
  } catch (error) {
    console.error("Update Course Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
