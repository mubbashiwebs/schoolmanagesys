import EnglishCourse from "../models/englang.js";
// Create a new English course
export const createEnglishCourse = async (req, res) => {
  try {
    const { levelName, fee, schoolId } = req.body;
     const isEngCourseExist = await EnglishCourse.findOne({
                levelName,schoolId
            });
    
            if (isEngCourseExist) {
                return res.json({ message: "Course Already Exist" });
            }


    const course = new EnglishCourse({ levelName, fee, schoolId });
    await course.save();
    var newCourse = await EnglishCourse.findOne({levelName : course.levelName, schoolId : course.schoolId}).populate('schoolId', 'name')
    res.json({ success: true, message: 'English course created successfully', data: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create course', error: error.message });
  }
};

// Get all English courses
export const getAllEnglishCourses = async (req, res) => {
  try {
    const courses = await EnglishCourse.find().populate('schoolId', 'name'); // populates only school name
    res.json({ success: true, data:courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch courses', error: error.message });
  }
};

// Get all English courses
export const getEnglishCoursesBySchool = async (req, res) => {
    console.log(req.params.schoolId)
  try {
    const courses = await EnglishCourse.find({schoolId:req.params.schoolId}).populate('schoolId', 'name'); // populates only school name
    res.json({ success: true, data:courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch courses', error: error.message });
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
//     const { levelName, fee, schoolId } = req.body;

//     const updatedCourse = await EnglishCourse.findByIdAndUpdate(
//       req.params.id,
//       { levelName, fee, schoolId },
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
    const { levelName, fee, schoolId } = req.body;

    // Check if another course with the same levelName and schoolId exists (excluding current one)
    const existingCourse = await EnglishCourse.findOne({
      _id: { $ne: req.params.id },
      levelName,
      schoolId
    });

    if (existingCourse) {
      return res.json({ success: false, message: 'Course with this level name already exists in the selected school' });
    }

    const updatedCourse = await EnglishCourse.findByIdAndUpdate(
      req.params.id,
      { levelName, fee, schoolId },
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
