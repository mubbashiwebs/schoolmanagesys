import EnglishCourse from "../models/englang.js";
// Create a new English course
// Add English Course
export const createEnglishCourse = async (req, res) => {
  try {
    const { name,  schoolId, campusId  , createdBy} = req.body;

    // Check for duplicate
    const isEngCourseExist = await EnglishCourse.findOne({
      name,
      schoolId,
      campusId,
      
    });

    if (isEngCourseExist) {
      return res.json({ message: "Course Already Exist" });
    }

    // Save new English course
    const courseData = new EnglishCourse({ name, schoolId, campusId, createdBy });
    await courseData.save();

    // Fetch and populate new course
    const newCourse = await EnglishCourse.findOne({
      name: courseData.name,
      schoolId: courseData.schoolId,
      campusId: courseData.campusId,
    })
      .populate("schoolId", "name")
      .populate("campusId", "name")

    res.json({
      data: newCourse,
      message: "English Course Successfully Added",
    });
  } catch (error) {
    console.error("Create English Course Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All English Courses
export const getAllEnglishCoursesByCampus = async (req, res) => {
  try {
    const courses = await EnglishCourse.find({schoolId: req.params.schoolId, campusId: req.params.campusId })
      

    if (courses.length > 0) {
      res.json({ data: courses, message: "Successfully Found" });
    } else {
      res.json({ data: [], message: "Data not Found" });
    }
  } catch (error) {
    console.error("Get All English Courses Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get English Courses by School (Admin)
export const getEnglishCoursesBySchool = async (req, res) => {
  try {
    const courses = await EnglishCourse.find({
      schoolId: req.params.schoolId,
    })
      .populate("schoolId", "name")
      .populate("campusId", "name")


    if (courses.length > 0) {
      res.json({ data: courses, message: "Successfully Found" });
    } else {
      res.json({ data: [], message: "Data not Found" });
    }
  } catch (error) {
    console.error("Get English Courses by School Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get a single course by ID
export const getEnglishCourseById = async (req, res) => {
  try {
    const course = await EnglishCourse.findById(req.params.id).populate('schoolId');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get course', error: error.message });
  }
};

// Update a course
// export const updateEnglishCourse = async (req, res) => {
//   try {
//     const { name, fee, schoolId } = req.body;

//     const updatedCourse = await EnglishCourse.findByIdAndUpdate(
//       req.params.id,
//       { name, fee, schoolId },
//       { new: true }
//     );

//     if (!updatedCourse) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }

//     res.status(200).json({ success: true, message: 'Course updated', course: updatedCourse });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to update course', error: error.message });
//   }
// };

// Delete a course
export const deleteEnglishCourse = async (req, res) => {
  try {
    const deletedCourse = await EnglishCourse.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete course', error: error.message });
  }
};

// Update a course
export const updateEnglishCourse = async (req, res) => {
  try {
    const { name, fee, schoolId } = req.body;

    // Check if another course with the same name and schoolId exists (excluding current one)
    const existingCourse = await EnglishCourse.findOne({
      _id: { $ne: req.params.id },
      name,
      schoolId
    });

    if (existingCourse) {
      return res.json({ success: false, message: 'Course with this level name already exists in the selected school' });
    }

    const updatedCourse = await EnglishCourse.findByIdAndUpdate(
      req.params.id,
      { name, fee, schoolId },
      { new: true }
    ).populate('schoolId', 'name');

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, message: 'Course updated successfully', data: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update course', error: error.message });
  }
};
