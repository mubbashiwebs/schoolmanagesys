import Student from "../models/student.js";
export const createStudent = async (req, res) => {
  try {
       const isStudentExist = await Student.findOne({ email: req.body.email , schoolId : req.body.schoolId });
        if (isStudentExist) {
      return res.json({ message: 'student already exists' });

        }
    const student = new Student(req.body);
    await student.save();
    res.json({ message: "Student created", student });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
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
    const students = await Student.find({schoolId:req.params.id});
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
