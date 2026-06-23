import Teacher from "../models/teacher.js";
import { generateStaffId } from "../utils/generateStaffId.js";

/* ================= CREATE TEACHER ================= */
export const createTeacher = async (req, res) => {
  try {
    const schoolId = req.user.school; // 🔐 auth se
    const {
      email,
      campus,
      role
    } = req.body;

    const exist = await Teacher.findOne({ email, campus, schoolId });
    if (exist) {
      return res.status(409).json({ message: "Teacher already exists" });
    }

    const staffCode = await generateStaffId(schoolId, campus, role);

    const teacher = new Teacher({
      ...req.body,
      schoolId,
      staffCode
    });

    await teacher.save();

    res.status(201).json({
      message: "Teacher created successfully",
      data: teacher
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ================= GET BY SCHOOL ================= */
export const getTeacherBySchoolId = async (req, res) => {
  try {
    const schoolId = req.user.school;

    const teachers = await Teacher
      .find({ schoolId })
      .populate("campus", "name");

    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET BY CAMPUS ================= */
export const getTeacherByCampus = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const { campus } = req.params;

    const teachers = await Teacher.find({ schoolId, campus });

    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET BY STAFF CODE ================= */
export const getTeacherById = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const { staffCode } = req.body;
    console.log("Fetching teacher with staffCode:", req.body, "for school:", schoolId);
    const teacher = await Teacher.findOne({ staffCode ,schoolId});
    console.log("Found teacher:", teacher)
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= UPDATE TEACHER ================= */
export const updateTeacher = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const { id } = req.params;

    // ❌ staffCode update block
    delete req.body.staffCode;
    delete req.body.schoolId;

    const teacher = await Teacher.findOneAndUpdate(
      { _id: id, schoolId },
      req.body,
      { new: true }
    ).populate("campus", "name");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({
      message: "Teacher updated successfully",
      teacher
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ================= DELETE TEACHER ================= */
export const deleteTeacher = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const { id } = req.params;

    const teacher = await Teacher.findOneAndDelete({ _id: id, schoolId });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ message: "Teacher deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
