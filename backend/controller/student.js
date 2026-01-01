import XLSX from "xlsx";
import Student from "../models/student.js";

import Course from "../models/computercourse.js";
import EnglishCourse from "../models/englang.js";
import Batch from "../models/batch.js";
import ClassModel from "../models/class.js";
import Section from "../models/Section.js";

import Voucher from "../models/voucher.js";
import Receipt from "../models/receipt.js";
import { generateGR } from "../utils/generateGrNo.js";
export const createStudent = async (req, res) => {
  console.log('student working')
  try {
       const isStudentExist = await Student.findOne({name: req.body.name, fatherName: req.body.fatherName,  schoolId: req.body.schoolId, campusId: req.body.campusId});
        if (isStudentExist) {
      return res.json({ message: 'student already exists' });

        }

        const selectedClass = await ClassModel.findById(req.body.class).populate('generalRegister')
        console.log(selectedClass , 'selected class')
        let educationLevel = selectedClass.generalRegister.registerName
        ;
        const grNumbers = {};
        for (let type of req.body.admissionTypes) {
          console.log(type , 'type here')
          grNumbers[type] = 1

          console.log(grNumbers , 'gr number before')
          if(grNumbers['school'] && req.body.schoolGrno !== ''){
            var isGrnoExist = await Student.findOne({ 'grNumbers.school': req.body.schoolGrno , schoolId: req.body.schoolId, campusId: req.body.campusId , class: req.body.class}); ;
            console.log(isGrnoExist , 'is gr no exist')
            if(isGrnoExist){
              return res.status(400).json({message:'School Grno already exists'})
            }
            else{
            grNumbers[type] = req.body.schoolGrno
            }
          }
           if(grNumbers[type] == 'tuition' && req.body.tuitionGrno !== ''){
            grNumbers[type] = req.body.tuitionGrno
          }
        }
    // Master Student ID (unique)
    const count = await Student.countDocuments();
    const masterId = `STU-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

    // Generate GR numbers for each admission type
    // for (const type of req.body.admissionTypes) {
    //   grNumbers[type] = await generateGR(req.body.schoolId, req.body.campusId, type ,educationLevel);
    // }
    req.body.masterId = masterId;
    req.body.grNumbers = grNumbers;
    //   for (const type of req.body.admissionTypes) {
    //   grNumbers[type] = await generateGR(req.body.schoolId, req.body.campusId, type ,educationLevel=student.educationLevel);
    // }
        
    const student = new Student(req.body);
    await student.save();
    res.json({ message: "Student created", student });
  } catch (err) {
    console.error(err.message);
    res.json({ message: err.message });
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
    // console.log(req.body)
    const studentData = await Student.findById(req.params.id);
    if (!studentData) {
      return res.json({ message: "Student not found" });
    }

    // Old and New Types
    const oldTypes = studentData.admissionTypes || [];
    const newTypes = req.body.admissionTypes || [];

    // Find which types are newly added
    const newAdmTypes = newTypes.filter(
      (type) => !oldTypes.includes(type)
    );

    // Find which types are removed
    const removedAdmTypes = oldTypes.filter(
      (type) => !newTypes.includes(type)
    );
    console.log({...studentData.grNumbers})
    // Copy old GR numbers
    const updatedGRs = {...studentData.grNumbers.toObject()};
    console.log(updatedGRs ,'updated Gr')
    // ✅ 1. Delete GR for removed types
    for (const removedType of removedAdmTypes) {
      delete updatedGRs[removedType];
    }

    console.log(updatedGRs ,'removing')

   
    for (const newType of newAdmTypes) {
      console.log(newType)
      updatedGRs[newType] = await generateGR(
        req.body.schoolId,
        req.body.campusId,
        newType
      );
    }
    console.log(updatedGRs , 'new ')
    // Set final GR object
    req.body.grNumbers = updatedGRs;
    // console.log(req.body.grNumbers , 'here is gr')
    // ✅ 3. Update the student
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Student updated", student: updatedStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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


export const getLeisureReport = async (req, res) => {
  try {
    const { grNo, feeType, session, campusId, schoolId } = req.body;
    console.log('req.body', req.body);
    // 1️⃣ Student find karo
    const student = await Student.findOne({
      [`grNumbers.${feeType}`]: grNo,
     
       campusId,
    schoolId,
    }).populate('schoolId', 'name').populate('campusId', 'name').populate('class', 'name').populate('section', 'name');

    console.log('student', student);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Student ke vouchers find karo
    const vouchers = await Voucher.find({
      student: student._id,
    
      feeType,
      campus: campusId,
      school: schoolId,
    }).sort({ createdAt: -1 });

    // 3️⃣ Student ke receipts find karo
    const receipts = await Receipt.find({
      student: student._id,

      campus: campusId,
      school: schoolId,
    }).sort({ createdAt: -1 });

    // 4️⃣ Final response
    return res.status(200).json({
      success: true,
      student,
      vouchers,
      receipts,
    });
  } catch (error) {
    console.error("Error fetching leisure report:", error);
    res.status(500).json({ message: "Server error", error });
  }
};




export const bulkUploadStudents = async (req, res) => {
  try {
  console.log('reach Here')
    console.log(req.file)
    if (!req.file) {
      return res.status(400).json({ message: "Excel file is required!" });
    }

    // Buffer se Excel read
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let inserted = [];
    let errors = [];

    for (let row of rows) {
      try {
        // === Class, Section, Course IDs Find ===

        const admissionClass = row.admissionClass
          ? await ClassModel.findOne({ name: row.admissionClass })
          : null;

        const admissionSection = row.admissionSection
          ? await Section.findOne({ name: row.admissionSection })
          : null;

              const cClass = row.class
          ? await ClassModel.findOne({ name: row.class })
          : null;
        

        const csection = row.section
          ? await Section.findOne({ name: row.section })
          : null;

        // console.log(cclass , 'classes here')
        const computerCourse = row.computerCourse
          ? await Course.findOne({ name: row.computerCourse })
          : null;

        const englishCourse = row.englishCourse
          ? await EnglishCourse.findOne({ name: row.englishCourse })
          : null;

        const engCourseBatch = row.engCourseBatch
          ? await Batch.findOne({ name: row.engCourseBatch })
          : null;

        const computerCourseBatch = row.computerCourseBatch
          ? await Batch.findOne({ name: row.computerCourseBatch })
          : null;

        const coachingClass = row.coachingClass
          ? await CoachClass.findOne({ name: row.coachingClass })
          : null;
        let educationLevel = "";
        let className = cClass.name
const prePrimaryClasses = [
  "Play Group",
  "Kids Junior",
  "Kids Senior",
  "E.C.D."
];

const primaryClasses = [
  "Class I",
  "Class II",
  "Class III",
  "Class IV",
  "Class V"
];

if (prePrimaryClasses.includes(className)) {
  educationLevel = "pre-primary";
} 
else if (primaryClasses.includes(className)) {
  educationLevel = "primary";
} 
else {
  educationLevel = "secondary";
}
        // === Student Document Create ===
        const stu = await Student.create({
          imageUrl: row.imageUrl,
          name: row.name,
          fatherName: row.fatherName,
          dob:  new Date(row.dob),
          cnic: row.cnic,
          email: row.email,
          phone: row.phone,
          gender: row.gender,
          address: row.address,
          masterId: row.masterId || `STU${Date.now()}${Math.floor(Math.random()*1000)}`,

          
          grNumbers: {
            school: row.schoolGr,
            tuition: row.tuitionGr,
            computer: row.computerGr,
            english: row.englishGr,
          },

          lastQualification: row.lastQualification,
          lastSchool: row.lastSchool,
          admissionDate: row.admissionDate? new Date(row.admissionDate) : Date.now(),

          admissionTypes: row.admissionTypes?.split(",").map(s => s.trim()),

          admissionClass: admissionClass?._id,
          admissionSection: admissionSection?._id,
          class: cClass?._id,
          section: csection?._id,

          computerCourse: computerCourse?._id,
          englishCourse: englishCourse?._id,
          engCourseBatch: engCourseBatch?._id,
          computerCourseBatch: computerCourseBatch?._id,

          coachingClass: coachingClass?._id,

          feeDetails: {
            school: {
              originalFee: row.schoolOriginalFee || 0,
              discount: row.schoolDiscount || 0,
              payableFee: row.schoolPayableFee || 0,
            },
            tuition: {
              originalFee: row.tuitionOriginalFee || 0,
              discount: row.tuitionDiscount || 0,
              payableFee: row.tuitionPayableFee || 0,
            },
            computer: {
              originalFee: row.computerOriginalFee || 0,
              discount: row.computerDiscount || 0,
              payableFee: row.computerPayableFee || 0,
            },
            english: {
              originalFee: row.englishOriginalFee || 0,
              discount: row.englishDiscount || 0,
              payableFee: row.englishPayableFee || 0,
            },
          },

          educationLevel: educationLevel ,

          totalFee: row.totalFee,
          schoolId: "68fa7661806efee8527bdc2d",
          campusId: "68fa7662806efee8527bdc2f",
          status: row.status || "Active",
          leftReason: row.leftReason,
          createdBy: row.createdBy

        });

        inserted.push(stu);
      } catch (err) {
        console.log(err.message)
        errors.push({
          row,
          error: err.message,
        });
      }
    }

    return res.json({
      success: true,
      insertedCount: inserted.length,
      errorCount: errors.length,
      errors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getStdGr = async (req,res)=>{
  try {
     let educationLevel = "";
        let className = req.params.class
const prePrimaryClasses = [
  "Play Group",
  "Kids Junior",
  "Kids Senior",
  "E.C.D."
];

const primaryClasses = [
  "Class I",
  "Class II",
  "Class III",
  "Class IV",
  "Class V"
];

if (prePrimaryClasses.includes(className)) {
  educationLevel = "pre-primary";
} 
else if (primaryClasses.includes(className)) {
  educationLevel = "primary";
} 
else {
  educationLevel = "secondary";
}
    const lastGrno = await generateGR(req.params.schoolId, req.params.campusId, req.params.type ,educationLevel)
    res.json({message:'Successfuly get Last Grno' , Grno :lastGrno})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}


// student sorted  by class and section
export const getStudentSortedDataByCampus = async (req, res) => {
  try {
    const students = await Student.find({
      schoolId: req.params.schoolId,
      campusId: req.params.campusId,
      status: "Active"
    })
      .populate("class", "name")
      .populate("section", "name");

    if (!students || students.length === 0)
      return res.json({ message: "No students found" });

    // -----------------------------------
    // 🔥 1. DYNAMIC CLASS LIST
    // -----------------------------------
    const dynamicClasses = [
      ...new Set(students.map((s) => s.class?.name).filter(Boolean))
    ];

    // -----------------------------------
    // 🔥 2. CUSTOM CLASS ORDER PRIORITY
    // -----------------------------------
    const priority = {
      "Play Group": 1,
      "Kids Senior": 2,
      "Kids Junior": 3,
      "E.C.D.": 3.5,
      "Class I": 4,
      "Class II": 5,
      "Class III": 6,
      "Class IV": 7,
      "Class V": 8,
      "Class VI": 9,
      "Class VII": 10,
      "Class VIII": 11,
      "Class IX": 12,
      "Class X": 13
    };

    // Jo custom priority me nahi, unko last me alphabetical
    const sortedClasses = dynamicClasses.sort((a, b) => {
      const pA = priority[a] || 999;
      const pB = priority[b] || 999;

      if (pA !== pB) return pA - pB;
      return a.localeCompare(b);
    });

    // -----------------------------------
    // 🔥 3. GROUP CLASS -> SECTION -> STUDENTS
    // -----------------------------------
    const result = [];

    sortedClasses.forEach((cls) => {
      const classStudents = students.filter((s) => s.class?.name === cls);

      // Unique section list inside the class
      const sections = [
        ...new Set(classStudents.map((s) => s.section?.name).filter(Boolean))
      ];

      // Section alphabetical sort (A → Z)
      const sortedSections = sections.sort((a, b) => a.localeCompare(b));

      const sectionData = sortedSections.map((sec) => ({
        sectionName: sec,
        students: classStudents
          .filter((s) => s.section?.name === sec)
          .map((stu) => ({
            name: stu.name,
            fatherName: stu.fatherName,
            grNo: stu.grNumbers?.school ?? "",
            originalFee: stu.feeDetails?.school?.originalFee ?? 0,
            discount: stu.feeDetails?.school?.discount ?? 0,
            payableFee: stu.feeDetails?.school?.payableFee ?? 0
          }))
      }));

      result.push({
        className: cls,
        sections: sectionData
      });
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
