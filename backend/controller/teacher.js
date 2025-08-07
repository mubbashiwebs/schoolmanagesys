import Teacher from "../models/teacher.js";
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
      computerCourse,
      Salary,
      schoolClassesRec,
      schooltuitionRec,
      schoolId
    } = req.body;
  try {
    const isTeacherExist = await Teacher.findOne({email,schoolId})
    if(isTeacherExist){
      return res.json({message:'teacher already exist' })
    }

    // Check for duplicate subject assignments (same class+section+subject) for any teacher
for (const entry of schoolClassesRec) {
  const conflict = await Teacher.findOne({
    schoolId,
    'schoolClassesRec': {
      $elemMatch: {
        class: entry.class,
        section: entry.section,
        subject: entry.subject
      }
    }
  });

  if (conflict) {
    return res.json({
      success: false,
      message: `Subject "${entry.subject}" already assigned in Class ${entry.class}, Section ${entry.section} to ${conflict.name}.`,
    });
  }
}


    const teacher = new Teacher(req.body);
    await teacher.save();
    res.json({ message: "Teacher created", data:teacher });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeacherByEmail = async (req, res) => {
  const {email ,schoolId} = req.body

  console.log('yes I am working')
  try {
    const teacher = await Teacher.findOne({email,schoolId}).populate('schoolId','name')
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
    const teachers = await Teacher.find({schoolId:req.params.id});
    console.log(teachers)
    if (!teachers) return res.status(404).json({ message: "Teacher not found" });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
