import XLSX from "xlsx";
import Student from "../models/student.js";

import Course from "../models/computercourse.js";
import EnglishCourse from "../models/englang.js";
import Batch from "../models/batch.js";
import ClassModel from "../models/class.js";
import Section from "../models/section.js";
import FeeStructure from "../models/feeStructure.js";

import Voucher from "../models/voucher.js";
import Receipt from "../models/receipts.js";
import { generateGR } from "../utils/generateGrNo.js";
import school from "../models/school.js";
export const createStudent = async (req, res) => {
  console.log('student working')
  try {
    const isStudentExist = await Student.findOne({ name: req.body.name, fatherName: req.body.fatherName, schoolId: req.body.schoolId, campusId: req.body.campusId });
    if (isStudentExist) {
      return res.json({ message: 'student already exists' });

    }
    if (req.body.admissionTypes.includes('school') || req.body.admissionTypes.includes('School')) {
      const selectedClass = await ClassModel.findById(req.body.class).populate('generalRegister')
      console.log(selectedClass, 'selected class')
      let educationLevel = selectedClass.generalRegister.registerName
    }
    ;
    const grNumbers = {};
    for (let type of req.body.admissionTypes) {
      console.log(type, 'type here')
      grNumbers[type] = 1

      console.log(grNumbers, 'gr number before')
      if (grNumbers['school'] && req.body.schoolGrno !== '') {
        var isGrnoExist = await Student.findOne({ 'grNumbers.school': req.body.schoolGrno, schoolId: req.body.schoolId, campusId: req.body.campusId, educationLevel });;
        console.log(isGrnoExist, 'is gr no exist')
        if (isGrnoExist) {
          return res.status(400).json({ message: 'School Grno already exists' })
        }
        else {
          grNumbers[type] = req.body.schoolGrno
        }
      }
      if (grNumbers[type] == 'tuition' && req.body.tuitionGrno !== '') {
        grNumbers[type] = req.body.tuitionGrno
      }
    }
    // Master Student ID (unique)
    const count = await Student.countDocuments();
    const masterId = `STU-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

    req.body.masterId = masterId;

    req.body.grNumbers = grNumbers;

    req.body.educationLevel = educationLevel;
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
    const students = await Student.find({ schoolId: req.params.id }).populate('schoolId', 'name').populate('campusId', 'name').populate('class', 'name').populate('section', 'name').populate('computerCourse', 'name').populate('englishCourse', 'name').populate('engCourseBatch', 'name').populate('computerCourseBatch', 'name').populate('coachingClass', 'name').populate('feeStructure');
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
    const students = await Student.find({ schoolId: req.params.schoolId, campusId: req.params.campusId }).populate('class', 'name').populate('section', 'name').populate('computerCourse', 'name').populate('englishCourse', 'name').populate('engCourseBatch', 'name').populate('computerCourseBatch', 'name').populate('feeStructure').populate('coachingClass', 'name');
    console.log(students)
    if (!students) return res.json({ message: "Student not found" });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const oldStudent = await Student.findById(req.params.id);
    if (!oldStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    /* ===============================
       ADMISSION TYPE & GR LOGIC
    =============================== */
    /* ===============================
         EDUCATION LEVEL CHECK
      =============================== */

    const newClass = await ClassModel
      .findById(req.body.class)
      .populate("generalRegister");

    const newEducationLevel = newClass.generalRegister.registerName;
    const oldEducationLevel = oldStudent.educationLevel;

    const oldTypes = oldStudent.admissionTypes || [];
    const newTypes = req.body.admissionTypes || [];
    console.log(oldTypes, 'old types')
    console.log(newTypes, 'new types')
    const newAdmTypes = newTypes.filter(t => !oldTypes.includes(t));
    console.log(newAdmTypes, 'new adm types here')
    const removedAdmTypes = oldTypes.filter(t => !newTypes.includes(t));
    console.log(removedAdmTypes, 'removed adm types here')
    const updatedGRs = { ...oldStudent.grNumbers.toObject() };
    console.log(updatedGRs, 'updated gr nos here')
    // remove GRs
    removedAdmTypes.forEach(type => delete updatedGRs[type]);
    // generate new GRs
    if (newAdmTypes.length === 0) {
      if (newTypes.includes('school') || newTypes.includes('School')) {
        console.log(req.body.schoolGrno, 'school gr no here')
        var isGrnoExist = await Student.findOne({ _id: { $ne: oldStudent._id }, 'grNumbers.school': req.body.schoolGrno, schoolId: req.body.schoolId, campusId: req.body.campusId, educationLevel: newEducationLevel });;
        console.log(isGrnoExist)
        if (isGrnoExist) {
          return res.status(400).json({ message: 'School Grno already exists' })
        }
        else {
          updatedGRs[newTypes[0]] = req.body.schoolGrno
        }

      }

      else {
        updatedGRs[newTypes[0]] = await generateGR(
          req.body.schoolId,
          req.body.campusId,
          newTypes[0]

        );
      }

    }
    else {

      for (const type of newAdmTypes) {
        console.log(type, 'type here in update')
        if (type === 'school' || type === 'School') {
          console.log(req.body.schoolGrno, 'school gr no here')
          var isGrnoExist = await Student.findOne({ _id: { $ne: oldStudent._id }, 'grNumbers.school': req.body.schoolGrno, schoolId: req.body.schoolId, campusId: req.body.campusId, educationLevel: newEducationLevel });;
          if (isGrnoExist) {
            return res.status(400).json({ message: 'School Grno already exists' })
          }
          else {
            updatedGRs[type] = req.body.schoolGrno
          }


        }
        else {
          updatedGRs[type] = await generateGR(
            req.body.schoolId,
            req.body.campusId,
            type

          );
        }

      }
    }

    /* ===============================
       CASE 1: EDUCATION LEVEL CHANGED
    =============================== */

    if (newEducationLevel !== oldEducationLevel) {

      // 1️⃣ Mark old student as Left
      await Student.findByIdAndUpdate(
        oldStudent._id,
        { status: "Left" }
      );

      // 2️⃣ Create new student record
      const newStudent = new Student({
        ...oldStudent.toObject(),
        _id: undefined,
        class: req.body.class,
        section: req.body.section,
        admissionTypes: newTypes,
        grNumbers: updatedGRs,
        educationLevel: newEducationLevel,
        status: "Active",
        createdAt: new Date()
      });

      await newStudent.save();

      return res.json({
        message: `Student shifted from ${oldEducationLevel} to ${newEducationLevel}`,
        student: newStudent
      });
    }

    /* ===============================
       CASE 2: SAME EDUCATION LEVEL
    =============================== */

    const updatedStudent = await Student.findByIdAndUpdate(
      oldStudent._id,
      {
        ...req.body,
        grNumbers: updatedGRs
      },
      { new: true }
    );

    res.json({
      message: "Student updated successfully",
      student: updatedStudent
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.json({ message: "Student not found" });
    await Voucher.deleteMany({ student: req.params.id });
    await Receipt.deleteMany({ student: req.params.id });
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
    }).populate('schoolId', 'name').populate('campusId', 'name').populate('class', 'name').populate('section', 'name').populate("feeStructure");

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
          dob: new Date(row.dob),
          cnic: row.cnic,
          email: row.email,
          phone: row.phone,
          gender: row.gender,
          address: row.address,
          masterId: row.masterId || `STU${Date.now()}${Math.floor(Math.random() * 1000)}`,


          grNumbers: {
            school: row.schoolGr,
            tuition: row.tuitionGr,
            computer: row.computerGr,
            english: row.englishGr,
          },

          lastQualification: row.lastQualification,
          lastSchool: row.lastSchool,
          admissionDate: row.admissionDate ? new Date(row.admissionDate) : Date.now(),

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

          educationLevel: educationLevel,

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


export const getStdGr = async (req, res) => {
  try {
    let educationLevel = "";
    let className = req.params.class
    const classData = await ClassModel.findOne({ name: className }).populate('generalRegister')
    educationLevel = classData.generalRegister.registerName
    console.log(req.params.type, 'type here')
    console.log(educationLevel, 'education level here')
    console.log(className, 'class name here')

    const lastGrno = await generateGR(req.params.schoolId, req.params.campusId, req.params.type, educationLevel)
    res.json({ message: 'Successfuly get Last Grno', Grno: lastGrno })
  } catch (error) {
    res.status(500).json({ message: error.message })
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
      .populate("section", "name")
      .populate('feeStructure');

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

export const getStudentsByClass = async (req, res) => {
  console.log('class id', req.params.classId)
  try {
    const students = await Student.find({ class: req.params.classId, status: 'Active' })
      .populate("class", "name")
      .populate("section", "name")
      .populate("campusId", "name")
      .populate("schoolId", "name");
    if (!students || students.length === 0)
      return res.status(404).json({ message: "No students found" });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





export const migrateClass = async (req, res) => {
  try {
    const { fromClassId, toClassId, studentIds, studentDiscounts ,stdFeeStructures } = req.body;

    if (!fromClassId || !toClassId || !studentIds?.length) {
      return res.status(400).json({
        success: false,
        message: "Required data missing"
      });
    }

    // 🔹 New class fee
    const toClass = await ClassModel.findById(toClassId);
    if (!toClass) {
      return res.status(404).json({
        success: false,
        message: "Target class not found"
      });
    }

    // 🔹 Map discounts for fast lookup
    const discountMap = {};
    studentDiscounts?.forEach(item => {
      discountMap[item.studentId] = Number(item.discount) || 0;
    });

    // 🔹 Fetch students
    const students = await Student.find({
      _id: { $in: studentIds },
      class: fromClassId
    });

    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "No students found for migration"
      });
    }

    // 🔹 Bulk update operations
 const bulkOps = await Promise.all(
  students.map(async student => {

    const discount =
      discountMap[student._id.toString()] ??
      student.feeDetails?.school?.discount ??
      0;

    const feeStructureId =
      stdFeeStructures[student._id.toString()] ||
      student.feeStructure;

      console.log(feeStructureId ,"feeStructureId is here")

    // 🔹 DEFAULT CLASS FEE
    if (feeStructureId === "default_class_fee") {
      const payableFee = toClass.fee - discount;

      return {
        updateOne: {
          filter: { _id: student._id },
          update: {
            $set: {
              feeStructure: null,
              class: toClassId,
              "feeDetails.school.originalFee": toClass.fee,
              "feeDetails.school.discount": discount,
              "feeDetails.school.payableFee": payableFee
            }
          }
        }
      };
    }

    // 🔹 CUSTOM FEE STRUCTURE
    const feeStructure = await FeeStructure.findById(feeStructureId);

    const classFeeObj = feeStructure.classFees.find(
      cls => String(cls.classId) === String(toClassId)
    );

    const toClassFee = classFeeObj?.Fee || 0;
    const payableFee = toClassFee - discount;

    return {
      updateOne: {
        filter: { _id: student._id },
        update: {
          $set: {
            feeStructure: feeStructureId,
            class: toClassId,
            "feeDetails.school.originalFee": toClassFee,
            "feeDetails.school.discount": discount,
            "feeDetails.school.payableFee": payableFee
          }
        }
      }
    };
  })
);

// ✅ NOW bulkWrite gets REAL objects
await Student.bulkWrite(bulkOps);

    return res.status(200).json({
      success: true,
      message: "Students migrated successfully",
      migratedCount: bulkOps.length
    });

  } catch (error) {
    console.error("Migrate Class Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const getStudentsByClsAndSec = async(req,res)=>{
try {
    const students = await Student.find({ class: req.params.classId, section:req.params.sectionId, status: 'Active' })
      .populate("class", "name")
      .populate("section", "name")
      .populate("campusId", "name")
      .populate("schoolId", "name");
    if (!students || students.length === 0)
      return res.status(404).json({ message: "No students found" });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export const getStudentsByMasterId = async(req,res)=>{
  let schoolId = req.user.school
  let campusId = req.body.campusId
  try {
    const student = await Student.findOne({ masterId: req.params.masterId, schoolId: schoolId, campusId: campusId })
      .populate("class", "name")
      .populate("section", "name")
      .populate("campusId", "name")
      .populate("schoolId", "name");
    if (!student)

      return res.status(404).json({ message: "No student found" });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export const getStudentLedger = async (req, res) => {
  try {
    const { masterId } = req.params;
      const student = await Student.findOne({ masterId: masterId })
    const vouchers = await Voucher.find({ student: student._id })
      .sort({ issueDate: 1 });
      console.log(vouchers, 'vouchers here')

    const receipts = await Receipt.find({ student: student._id })
      .sort({ date: 1 });

    let ledger = [];

    // ===== VOUCHERS =====
    vouchers.forEach(v => {

      // 1️⃣ Monthly Fee row
      if (v.breakdown?.monthlyFee >= 0) {
        ledger.push({
          date: v.issueDate,
          dues: v.breakdown.monthlyFee,
          dType: "Monthly Fee",
          receivings: 0,
          receivingType: null
        });
      }

      // 2️⃣ Extras rows (each separate)
      if (v.breakdown?.extras?.length > 0) {
        v.breakdown.extras.forEach(extra => {
          ledger.push({
            date: v.issueDate,
            dues: extra.amount,
            dType: extra.name,
            receivings: 0,
            receivingType: null
          });
        });
      }

    });

    // ===== RECEIPTS =====
    receipts.forEach(r => {
      ledger.push({
        date: r.date,
        dues: 0,
        dType: null,
        receivings: r.amount,
        receivingType: r.type
      });
    });

    // ===== SORT BY DATE =====
    ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

    // ===== RUNNING BALANCE =====
    let balance = 0;

    ledger = ledger.map(item => {
      balance += item.dues;
      balance -= item.receivings;

      return {
        ...item,
        balance
      };
    });

    res.json(ledger);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
