import Student from "../models/student.js";
import { generateGR } from "../utils/generateGrNo.js";
export const createStudent = async (req, res) => {
  console.log('student working')
  try {
       const isStudentExist = await Student.findOne({ email: req.body.email , schoolId : req.body.schoolId });
        if (isStudentExist) {
      return res.json({ message: 'student already exists' });

        }

    //      if (!Array.isArray(admissionTypes) || admissionTypes.length === 0) {
    //   return res.status(400).json({ success: false, message: "Admission types required" });
    // }

    // Master Student ID (unique)
    const count = await Student.countDocuments();
    const masterId = `STU-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

    // Generate GR numbers for each admission type
    const grNumbers = {};
    for (const type of req.body.admissionTypes) {
      grNumbers[type] = await generateGR(req.body.schoolId, req.body.campusId, type);
    }
    req.body.masterId = masterId;
    req.body.grNumbers = grNumbers;
        
    const student = new Student(req.body);
    await student.save();
    res.json({ message: "Student created", student });
  } catch (err) {
    console.error(err.message);
    res.json({ error: err.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('schoolId', 'name').populate('campusId', 'name');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudentBySchoolId = async (req, res) => {
    console.log('reach')
    console.log(req.params.id)
  try {
    const students = await Student.find({schoolId:req.params.id}).populate('schoolId', 'name').populate('campusId', 'name').populate('class', 'name').populate('section', 'name').populate('computerCourse', 'name').populate('englishCourse', 'name').populate('engCourseBatch', 'name').populate('computerCourseBatch', 'name');
    console.log(students)
    if (!students) return res.json({ message: "Student not found" });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudentByCampusId = async (req, res) => {
    console.log('reach')
    console.log(req.params.id)
  try {
    const students = await Student.find({schoolId:req.params.schoolId,campusId:req.params.campusId}).populate('class', 'name').populate('section', 'name').populate('computerCourse', 'name').populate('englishCourse', 'name').populate('engCourseBatch', 'name').populate('computerCourseBatch', 'name');
    console.log(students)
    if (!students) return res.json({ message: "Student not found" });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.json({ message: "Student not found" });
    res.json({ message: "Student updated", student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
