import Course from "../models/computercourse.js";
// Add Course
// course.js

// Add Course
export const addCourse = async (req, res) => {
  try {
    // Check if course already exists
    const isCourseExist = await Course.findOne({
      schoolId: req.body.schoolId,
      name: req.body.name,
      campusId: req.body.campusId,
    });

    if (isCourseExist) {
      return res.json({ message: "Course Already Exist" });
    }

    // Save new course
    const courseData = new Course(req.body);
    await courseData.save();

    // Fetch newly added course with populated school & campus
    const newCourse = await Course.findOne({
      name: courseData.name,
      schoolId: courseData.schoolId,
      campusId: courseData.campusId,
    })
      .populate("schoolId", "name")
      .populate("campusId", "name")

    res.json({ data: newCourse, message: "Successfully added" });
  } catch (error) {
    console.error("Add Course Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Courses by School (Admin)
export const getCoursesBySchool = async (req, res) => {
  try {
    const courses = await Course.find({ schoolId: req.params.schoolId })
      .populate("schoolId", "name")
      .populate("campusId", "name")

    if (courses.length > 0) {
      res.json({ data: courses, message: "Successfully Found" });
    } else {
      res.json({ data: [], message: "Data not Found" });
    }
  } catch (error) {
    console.error("Get Courses by School Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Courses
export const getAllCoursesByCampus = async (req, res) => {
  try {
    const courses = await Course.find({ schoolId: req.params.schoolId, campusId: req.params.campusId })
   
    if (courses.length > 0) {
      res.json({ data: courses, message: "Successfully Found" });
    } else {
      res.json({ data: [], message: "Data not Found" });
    }
  } catch (error) {
    console.error("Get All Courses Error:", error);
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
    ).populate('schoolId', 'name').populate('campusId', 'name')

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ data: updatedCourse, message: "Course updated successfully" });
  } catch (error) {
    console.error("Update Course Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
