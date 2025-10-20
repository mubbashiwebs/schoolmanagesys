import Teacher from "../models/teacher.js";
import { generateStaffId } from "../utils/generateStaffId.js";
export const createTeacher = async (req, res) => {
  const {
      imageUrl,
      name,
      fatherName,
      dob,
      cnic,
      email,
      phone,
      gender,
      address,
      lastQualification,
      lastSchool,
      admissionDate,
      admissionTypes,
     
      Salary,
      designation,
      role,
      campus,
    
      schoolId
    } = req.body;
  try {
    const isTeacherExist = await Teacher.findOne({email,schoolId , campus})
    if(isTeacherExist){
      return res.json({message:'teacher already exist' })
    }

        const staffCode = await generateStaffId(schoolId, campus, role);


    // Check for duplicate subject assignments (same class+section+subject) for any teacher
//     if(role === 'teacher') {
// for (const entry of schoolClassesRec) {
//   const conflict = await Teacher.findOne({
//     schoolId,
//     'schoolClassesRec': {
//       $elemMatch: {
//         class: entry.class,
//         section: entry.section,
//         subject: entry.subject
//       }
//     }
//   });

//   if (conflict) {
//     return res.json({
//       success: false,
//       message: `Subject "${entry.subject}" already assigned in Class ${entry.class}, Section ${entry.section} to ${conflict.name}.`,
//     });
//   }
// }
//     }
  var data = req.body
  data.staffCode = staffCode
    const teacher = new Teacher(data);
    await teacher.save();
    res.json({ message: "Teacher created", data:teacher });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTeacherByCampus = async (req, res) => {
  try {
    const teachers = await Teacher.find({ schoolId: req.params.schoolId, campus: req.params.campus })
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeacherById = async (req, res) => {
  const {id } = req.body

  console.log('yes I am working')
  try {
    const teacher = await Teacher.findOne({staffCode: id})
    console.log(teacher)
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeacherBySchoolId = async (req, res) => {
    console.log('reach')
    // console.log(req.params.id)
  try {
    const teachers = await Teacher.find({schoolId:req.params.id}).populate('campus','name');
    console.log(teachers)
    if (!teachers) return res.status(404).json({ message: "Teacher not found" });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('campus','name');
    if (!teacher) return res.json({ message: "Teacher not found" });
    res.json({ message: "Teacher updated", teacher });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.json({ message: "Teacher not found" });
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
