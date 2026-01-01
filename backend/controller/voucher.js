import Voucher from "../models/voucher.js";
import Student from "../models/student.js";
import Receipt from "../models/receipt.js";
import crypto from "crypto";

async function computePreviousDuesForStudent(studentId, feeType) {
  const lastVoucher = await Voucher.findOne({
    student: studentId,
    feeType,

  }).sort({ createdAt: -1 }); // latest voucher
  if (!lastVoucher) return { total: 0, detail: [] };

  let total = 0;
  const detail = [];


  const receipts = await Receipt.findOne({ voucher: lastVoucher._id });
  const balance = receipts ? receipts.balanceAfterPayment : 0;
  const remaining = balance > 0 ? balance : lastVoucher.totalPayableWithLateFee;

  if (remaining > 0) {
    total += remaining;
    detail.push({
      voucherId: lastVoucher._id,
      month: lastVoucher.month,
      amount: remaining
    });
  }


  return { total, detail };
}

// export const generateVouchers = async (req, res) => {
//     try {
//     const payload = req.body;
//     const { feeType, month, selectionType ,studentId } = payload;

//     // 1) FILTER STUDENTS
//   let studentsQuery = {
//   // grNumbers: {},
//   class: null,
//   section: null,
//   coachingClass: null,
//   computerCourse: null,
//   computerCourseBatch: null,
//   englishCourse: null,
//   engCourseBatch: null,
//   campusId: null,
//   schoolId: null
// };
//  if (payload.campusId) studentsQuery.campusId = payload.campusId;
//   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;
// // Filter according to feeType
// if (feeType === "school") {
//   if(selectionType === 'single' && !studentId){

//   studentsQuery[`grNumbers.${feeType}`] = Number(payload.grNo);

//     // console.log(studentsQuery)
//     Object.keys(studentsQuery).forEach(
//   (key) => studentsQuery[key] === null && delete studentsQuery[key]
// );
//     // studentsQuery.class = payload.class || null;

//     console.log(studentsQuery , 'studentsQuery')

//     const matchedStudent = await Student.find(studentsQuery);
//     console.log(matchedStudent , 'matchedStudent')
//     return res.json({ success: true, students: matchedStudent });
//   }
//   else if(selectionType === 'single' && studentId){
//     studentsQuery._id = studentId;
//   }
//   if(selectionType === 'class'){
//     studentsQuery.class = payload.class || null;
//   }
//   // if (payload.section) studentsQuery.section = payload.section || null;
//   if (payload.campusId) studentsQuery.campusId = payload.campusId;
//   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;

// } else if (feeType === "tuition") {
//   studentsQuery.coachingClass = payload.coachingClass || null;
//   if (payload.campusId) studentsQuery.campusId = payload.campusId;
//   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;

// } else if (feeType === "computer") {
//   studentsQuery.computerCourse = payload.courseId || null;
//   studentsQuery.computerCourseBatch = payload.batchId || null;
//   if (payload.campusId) studentsQuery.campusId = payload.campusId;
//   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;

// } else if (feeType === "english") {
//   studentsQuery.englishCourse = payload.engCourseId || null;
//   studentsQuery.engCourseBatch = payload.engBatchId || null;
//   if (payload.campusId) studentsQuery.campusId = payload.campusId;
//   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;
// }

// studentsQuery.status = 'Active';

// // Remove null fields before querying
// Object.keys(studentsQuery).forEach(
//   (key) => studentsQuery[key] === null && delete studentsQuery[key]
// );

// // finally get matching students
// const students = await Student.find(studentsQuery);

//     console.log(students , 'students')
//     if (!students.length)
//       return res.status(404).json({ message: "No students found" });

//     const createdVouchers = [];

//     for (const st of students) {

//       // 2) Prevent duplicate for same month
//       const exists = await Voucher.findOne({
//         student: st._id,
//         feeType,
//         month

//       });

//       if (exists) {
//         createdVouchers.push({
//           student: st._id,
//           skipped: true,
//           reason: "voucher exists"
//         });
//         continue;
//       }

//       // 3) Calculate previous dues
//       const { total: previousDuesTotal, detail: previousDuesDetail } =
//         await computePreviousDuesForStudent(st._id, feeType);

//       // 4) Calculate current month breakdown
//       const monthlyFee = st.feeDetails?.[feeType]?.payableFee
//       const extras = Array.isArray(payload.extras) ? payload.extras.filter(extra => extra.name !=='Late Fee') : [];
//       const latefee = Array.isArray(payload.extras) ? payload.extras.find(extra => extra.name === 'Late Fee') : 0;
//       const extrasTotal = extras.reduce((s, e) => s + Number(e.amount || 0), 0);

//       const totalPayable = monthlyFee + extrasTotal + previousDuesTotal;
//       const lateFeeAmount = latefee ? Number(latefee.amount || 0) : 0;
//       const totalPayableWithLateFee = totalPayable + lateFeeAmount;

//       // 5) Save voucher
//      const voucherData = {
//   student: st._id,
//   feeType,
//   month,

//   class: null,
//   coachingClass: null,
//   computerCourse: null,
//   computerCourseBatch: null,
//   englishCourse: null,
//   engCourseBatch: null,
//   campus: st.campusId || null,
//   school: st.schoolId || null,
//   breakdown: {
//     monthlyFee:st.feeDetails?.[feeType]?.payableFee || monthlyFee,
//     extras,
//     previousDuesTotal,
//   },
//   previousDuesDetail,
//   totalPayable,
//   totalPayableWithLateFee,
//   issueDate: payload.issueDate,
//   dueDate: payload.dueDate ,
//   expireDate: payload.expireDate ,
//   status: totalPayable === 0 ? "Paid" : "Unpaid",
//   createdBy: payload.generatedBy || null,
// };

// // map fields based on feeType
// if (feeType === "school") {
//   voucherData.class = st.class || null;

// } else if (feeType === "tuition") {
//   voucherData.coachingClass = st.coachingClass || null;

// } else if (feeType === "computer") {
//   voucherData.computerCourse = payload.courseId || st.computerCourse || null;
//   voucherData.computerCourseBatch = payload.batchId || st.computerCourseBatch || null;

// } else if (feeType === "english") {
//   voucherData.englishCourse = payload.engCourseId || st.englishCourse || null;
//   voucherData.engCourseBatch = payload.engBatchId || st.engCourseBatch || null;
// }

// voucherData.campus = st.campusId || null;
// voucherData.school = st.schoolId || null;

// let unique = false
// let voucherNo

// const existingV = await Voucher.find({feeType})
// console.log('existingV',existingV.length)

//     voucherNo = (existingV.length + 1).toString().padStart(3,'0')

//     console.log('completed')
//     voucherData.voucherNo = voucherNo
// // finally create the voucher
// const voucherDoc = await Voucher.create(voucherData);

//       createdVouchers.push({
//         student: st._id,
//         voucherId: voucherDoc._id,
//         voucherNo:voucherNo,
//         skipped: false
//       });
//     }

//     return res.json({ success: true, created: createdVouchers });

//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// }

export const getVouchersByClass = async (req, res) => {
  try {
    const { classId, coachingClass, month, selectionType, stdGrNo, studentId, feeType, courseId, batchId, engCourseId, engBatchId } = req.query;
    console.log(stdGrNo, 'grno');

    let baseQuery = { month, feeType };



    if (selectionType === 'single') {
      baseQuery.campusId = req.query.campusId || null;
      baseQuery.schoolId = req.query.schoolId || null;
      baseQuery.status = 'Active';

      baseQuery[`grNumbers.${feeType}`] = Number(stdGrNo);

      // console.log(studentsQuery)
      Object.keys(baseQuery).forEach(
        (key) => baseQuery[key] === null && delete baseQuery[key]
      );


      Object.keys(baseQuery).forEach((key) => {
        if (key === "feeType" || key === "month") {
          delete baseQuery[key];
        }
      });

      console.log(baseQuery, 'baseQuery')

      const matchedStudent = await Student.find(baseQuery).lean();

      await Promise.all(
        matchedStudent.map(async (student) => {
          const voucher = await Voucher.findOne({
            student: student._id,
            feeType,
            month
          }).populate("student", "name fatherName grNumbers")
            .populate("class", "name")
            .populate("coachingClass", "name")
            .populate("computerCourse", "name")
            .populate("computerCourseBatch", "name")
            .populate("englishCourse", "name")
            .populate("engCourseBatch", "name")
            .populate("campus", "name")
            .populate("school", "name").lean();
          student.voucher = voucher;
        })
      );

      return res.json({ success: true, students: matchedStudent });


    }

    if (selectionType === 'class') {
      if (feeType === "school") {
        baseQuery.class = classId || null;
      }
      else if (feeType === "tuition") {
        baseQuery.coachingClass = coachingClass || null;
      }
    }

    if (selectionType === 'course') {
      if (feeType === "computer") {
        baseQuery.computerCourse = courseId || null;
      }
      else if (feeType === "english") {
        baseQuery.englishCourse = engCourseId || null;
      }
    }
    if (selectionType === 'batch') {
      if (feeType === "computer") {
        baseQuery.computerCourse = courseId || null;
        baseQuery.computerCourseBatch = batchId || null;
      }
      else if (feeType === "english") {
        baseQuery.englishCourse = engCourseId || null;
        baseQuery.engCourseBatch = engBatchId || null;
      }
    }

    console.log(baseQuery, 'final baseQuery');

    baseQuery.campus = req.query.campusId || null;
    baseQuery.school = req.query.schoolId || null;

    const vouchers = await Voucher.find(baseQuery)
      .populate("student", "name fatherName grNumbers")
      .populate("class", "name")
      .populate("coachingClass", "name")
      .populate("computerCourse", "name")
      .populate("computerCourseBatch", "name")
      .populate("englishCourse", "name")
      .populate("engCourseBatch", "name")
      .populate("campus", "name")
      .populate("school", "name")
      .lean();
    console.log(vouchers, 'vouchers found');
    if (!vouchers.length) return res.status(404).json({ message: "No vouchers found" });

    res.json({ success: true, vouchers });
    // }

    // Case 2️⃣: Student-wise vouchers
    // const student = await Student.findOne({ [`grNumbers.${feeType}`]: stdGrNo , campusId: req.query.campusId , schoolId: req.query.schoolId });
    // if (!student) return res.status(404).json({ message: "Student not found" });

    // const studentQuery = { ...baseQuery, student: student._id };

    // const vouchers = await Voucher.find(studentQuery)
    //   .populate("student", "name fatherName grNumbers")
    //   .populate("class", "name")
    //   .populate("campus", "name")
    //   .populate("school", "name")
    //   .lean();

    // if (!vouchers.length) return res.status(404).json({ message: "No vouchers found" });

    // res.json({ success: true, vouchers });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteVoucherById = async (req, res) => {
  try {
    const { voucherId } = req.params;
    const result = await Voucher.findByIdAndDelete(voucherId);
    if (!result) {
      return res.status(404).json({ success: false, message: "Voucher not found" });
    }
    res.json({ success: true, message: "Voucher deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const deleteVouchersByClass = async (req, res) => {
  try {
    const { classId, month, stdGrNo, feeType, courseId, batchId, engCourseId, engBatchId } = req.query;

    let baseQuery = { month, feeType };

    // feeType ke hisaab se field adjust karo
    if (feeType === "school") {
      baseQuery.class = classId;
    } else if (feeType === "tuition") {
      baseQuery.coachingClass = classId;
    } else if (feeType === "computer") {
      if (courseId) baseQuery.computerCourse = courseId;
      if (batchId) baseQuery.computerCourseBatch = batchId;
    } else if (feeType === "english") {
      if (engCourseId) baseQuery.englishCourse = engCourseId;
      if (engBatchId) baseQuery.engCourseBatch = engBatchId;
    }

    // Case 1️⃣: Class / Batch-wise delete
    if (!stdGrNo) {
      const result = await Voucher.deleteMany(baseQuery);

      if (result.deletedCount === 0)
        return res.status(404).json({ success: false, message: "No vouchers found to delete" });

      return res.json({
        success: true,
        deletedCount: result.deletedCount,
        message: `${result.deletedCount} vouchers deleted successfully for ${feeType}`
      });
    }

    // Case 2️⃣: Student-specific delete
    const student = await Student.findOne({ [`grNumbers.${feeType}`]: stdGrNo });
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const result = await Voucher.deleteMany({ ...baseQuery, student: student._id });

    if (result.deletedCount === 0)
      return res.status(404).json({ success: false, message: "No vouchers found to delete for this student" });

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} vouchers deleted successfully for this student`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


const getSingleVoucher = async (req, res) => {
  console.log(req.body)
console.log(req.body.voucherNo)
  try {
    const voucher = await Voucher.findOne({voucherNo: req.body.voucherNo}).populate('student', 'name fatherName grNumbers').populate('class', 'name').populate('campus', 'name').populate('school', 'name')
    console.log(voucher)
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    const currentVoucher = await Voucher.findOne({ student: voucher.student._id, feeType: voucher.feeType, campus: voucher.campus, school: voucher.school }).populate('student', 'name fatherName grNumbers').populate('class', 'name').populate('campus', 'name').populate('school', 'name').sort({ createdAt: -1 })
    // console.log(currentVoucher)
    if (!currentVoucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    res.json({ data: currentVoucher, message: 'sucessfully Found' });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Server error' });
  }
}

export default getSingleVoucher;


export const getStudentVoucher = async (req, res) => {
  try {
    const { studentName, fatherName } = req.query;

    // 1️⃣ Find student first
    const student = await Student.findOne({
      name: studentName,
      fatherName,

    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Find voucher using student._id
    const voucher = await Voucher.findOne({ student: student._id });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.status(200).json({
      student,
      voucher
    });

  } catch (error) {
    console.error("Error fetching voucher:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// 🔥 Edit Voucher (Monthly Fee + Extras + Late Fee + Breakdown)
export const editVoucher = async (req, res) => {
  try {
    const { voucherId } = req.params;
    const { monthlyFee, extras, lateFee, issueDate, dueDate, expireDate } = req.body;

    // ─────────────────────────────────────────────
    // 1) Fetch voucher
    // ─────────────────────────────────────────────
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    // ─────────────────────────────────────────────
    // 2) If receipt already generated → editing block
    // ─────────────────────────────────────────────
    const receipt = await Receipt.findOne({ voucher: voucherId });
    if (receipt) {
      return res.status(400).json({
        message: "Voucher is already paid or partially paid. Editing is not allowed.",
      });
    }

    // ─────────────────────────────────────────────
    // 3) Update Breakdown
    // ─────────────────────────────────────────────
    voucher.breakdown.monthlyFee = Number(monthlyFee);

    // Filter only normal extras (late fee separate hoga)
    const normalExtras = Array.isArray(extras)
      ? extras.filter((e) => e.name !== "Late Fee")
      : [];

    voucher.breakdown.extras = normalExtras;

    // ─────────────────────────────────────────────
    // 4) Previous Dues ko keep karo (already saved)
    // ─────────────────────────────────────────────
    const previousDuesTotal = voucher.breakdown.previousDuesTotal || 0;

    // ─────────────────────────────────────────────
    // 5) Recalculate totals
    // ─────────────────────────────────────────────
    const extrasTotal = normalExtras.reduce(
      (sum, x) => sum + Number(x.amount || 0),
      0
    );

    const newTotal = Number(monthlyFee) + extrasTotal + previousDuesTotal;
    const newLateFee = Number(lateFee || 0);
    const newTotalWithLate = newTotal + newLateFee;

    voucher.totalPayable = newTotal;
    voucher.totalPayableWithLateFee = newTotalWithLate;

    // Late Fee ko breakdown me update karo
    voucher.breakdown.lateFee = newLateFee;

    // ─────────────────────────────────────────────
    // 6) Dates update (optional)
    // ─────────────────────────────────────────────
    if (issueDate) voucher.issueDate = issueDate;
    if (dueDate) voucher.dueDate = dueDate;
    if (expireDate) voucher.expireDate = expireDate;

    // ─────────────────────────────────────────────
    // 7) Status auto update
    // ─────────────────────────────────────────────
    voucher.status = newTotalWithLate === 0 ? "Paid" : "Unpaid";

    // ─────────────────────────────────────────────
    // 8) Save voucher
    // ─────────────────────────────────────────────
    await voucher.save();

    res.json({
      success: true,
      message: "Voucher updated successfully",
      voucher,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};




export const generateVouchers = async (req, res) => {
  try {
    const payload = req.body;
    const { feeType, month, selectionType, studentId } = payload;
console.log(payload , 'payload')
    // 1) FILTER STUDENTS
    let studentsQuery = {
      // grNumbers: {},
      class: null,
      section: null,
      coachingClass: null,
      computerCourse: null,
      computerCourseBatch: null,
      englishCourse: null,
      engCourseBatch: null,
      campusId: null,
      // admissionTypes: feeType,
      schoolId: null
    };
    if (payload.campusId) studentsQuery.campusId = payload.campusId;
    if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;
    // Filter according to feeType
    // if (feeType === "school") {
    //   if(selectionType === 'single' && !studentId){

    //   studentsQuery[`grNumbers.${feeType}`] = Number(payload.grNo);

    //     // console.log(studentsQuery)
    //     Object.keys(studentsQuery).forEach(
    //   (key) => studentsQuery[key] === null && delete studentsQuery[key]
    // );
    //     // studentsQuery.class = payload.class || null;

    //     console.log(studentsQuery , 'studentsQuery')

    //     const matchedStudent = await Student.find(studentsQuery);
    //     console.log(matchedStudent , 'matchedStudent')
    //     return res.json({ success: true, students: matchedStudent });
    //   }
    //   else if(selectionType === 'single' && studentId){
    //     studentsQuery._id = studentId;
    //   }
    //   if(selectionType === 'class'){
    //     studentsQuery.class = payload.class || null;
    //   }
    //   // if (payload.section) studentsQuery.section = payload.section || null;
    //   if (payload.campusId) studentsQuery.campusId = payload.campusId;
    //   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;

    // } else if (feeType === "tuition") {
    //   studentsQuery.coachingClass = payload.coachingClass || null;
    //   if (payload.campusId) studentsQuery.campusId = payload.campusId;
    //   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;

    // } else if (feeType === "computer") {
    //   studentsQuery.computerCourse = payload.courseId || null;
    //   studentsQuery.computerCourseBatch = payload.batchId || null;
    //   if (payload.campusId) studentsQuery.campusId = payload.campusId;
    //   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;

    // } else if (feeType === "english") {
    //   studentsQuery.englishCourse = payload.engCourseId || null;
    //   studentsQuery.engCourseBatch = payload.engBatchId || null;
    //   if (payload.campusId) studentsQuery.campusId = payload.campusId;
    //   if (payload.schoolId) studentsQuery.schoolId = payload.schoolId;
    // }

    if (selectionType === 'single' && !studentId) {
      studentsQuery[`grNumbers.${feeType}`] = Number(payload.grNo);

      // console.log(studentsQuery)
      Object.keys(studentsQuery).forEach(
        (key) => studentsQuery[key] === null && delete studentsQuery[key]
      );

      console.log(studentsQuery, 'studentsQuery')

      const matchedStudent = await Student.find(studentsQuery);
      console.log(matchedStudent, 'matchedStudent')
      return res.json({ success: true, students: matchedStudent });
    }
    else if (selectionType === 'single' && studentId) {
      console.log('studentId', studentId)
      studentsQuery._id = studentId;
    }

    if (selectionType === 'class') {
      if (feeType === "school") {
        studentsQuery.class = payload.class || null;
      }
      else if (feeType === "tuition") {
        studentsQuery.coachingClass = payload.class || null;
      }
    }

    if (selectionType === 'course') {
      if (feeType === "computer") {
        studentsQuery.computerCourse = payload.courseId || null;
      }
      else if (feeType === "english") {
        studentsQuery.englishCourse = payload.engCourseId || null;
      }
    }
    if (selectionType === 'batch') {
      if (feeType === "computer") {
        studentsQuery.computerCourse = payload.courseId || null;

        studentsQuery.computerCourseBatch = payload.batchId || null;
      }
      else if (feeType === "english") {
        studentsQuery.englishCourse = payload.engCourseId || null;

        studentsQuery.engCourseBatch = payload.engBatchId || null;
      }
    }

    studentsQuery.status = 'Active';

    // Remove null fields before querying
    Object.keys(studentsQuery).forEach(
      (key) => studentsQuery[key] === null && delete studentsQuery[key]
    );

    // finally get matching students
    const students = await Student.find(studentsQuery);

    console.log(students, 'students')
    if (!students.length)
      return res.status(404).json({ message: "No students found" });

    const createdVouchers = [];

    for (const st of students) {

      // 2) Prevent duplicate for same month
      const exists = await Voucher.findOne({
        student: st._id,
        feeType,
        month

      });

      if (exists) {
        createdVouchers.push({
          student: st._id,
          skipped: true,
          reason: "voucher exists"
        });
        continue;
      }

      // 3) Calculate previous dues
      const { total: previousDuesTotal, detail: previousDuesDetail } =
        await computePreviousDuesForStudent(st._id, feeType);

      // 4) Calculate current month breakdown
      const monthlyFee = st.feeDetails?.[feeType]?.payableFee
      const extras = Array.isArray(payload.extras) ? payload.extras.filter(extra => extra.name !== 'Late Fee') : [];
      const latefee = Array.isArray(payload.extras) ? payload.extras.find(extra => extra.name === 'Late Fee') : 0;
      const extrasTotal = extras.reduce((s, e) => s + Number(e.amount || 0), 0);

      const totalPayable = monthlyFee + extrasTotal + previousDuesTotal;
      const lateFeeAmount = latefee ? Number(latefee.amount || 0) : 0;
      const totalPayableWithLateFee = totalPayable + lateFeeAmount;

      // 5) Save voucher
      const voucherData = {
        student: st._id,
        feeType,
        month,

        class: null,
        coachingClass: null,
        computerCourse: null,
        computerCourseBatch: null,
        englishCourse: null,
        engCourseBatch: null,
        campus: st.campusId || null,
        school: st.schoolId || null,
        breakdown: {
          monthlyFee: st.feeDetails?.[feeType]?.payableFee || monthlyFee,
          extras,
          previousDuesTotal,
        },
        previousDuesDetail,
        totalPayable,
        totalPayableWithLateFee,
        issueDate: payload.issueDate,
        dueDate: payload.dueDate,
        expireDate: payload.expireDate,
        status: totalPayable === 0 ? "Paid" : "Unpaid",
        createdBy: payload.generatedBy || null,
      };

      // map fields based on feeType
      if (feeType === "school") {
        voucherData.class = st.class || null;

      } else if (feeType === "tuition") {
        voucherData.coachingClass = st.coachingClass || null;

      } else if (feeType === "computer") {
        voucherData.computerCourse = payload.courseId || st.computerCourse || null;
        voucherData.computerCourseBatch = payload.batchId || st.computerCourseBatch || null;

      } else if (feeType === "english") {
        voucherData.englishCourse = payload.engCourseId || st.englishCourse || null;
        voucherData.engCourseBatch = payload.engBatchId || st.engCourseBatch || null;
      }

      voucherData.campus = st.campusId || null;
      voucherData.school = st.schoolId || null;

      let unique = false
      let voucherNo

      const existingV = await Voucher.find({ feeType })
      console.log('existingV', existingV.length)

      voucherNo = Number((existingV.length + 1))

      console.log('completed')
      voucherData.voucherNo = voucherNo
      // finally create the voucher
      const voucherDoc = await Voucher.create(voucherData);

      createdVouchers.push({
        student: st._id,
        voucherId: voucherDoc._id,
        voucherNo: voucherNo,
        skipped: false
      });
    }

    return res.json({ success: true, created: createdVouchers });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

export const generateSingleVoucher = async (req, res) => {
  try {
    const { studentId, feeType, month, extras, issueDate, dueDate, expireDate, generatedBy } = req.body;
    const st = await Student.findById(studentId);
    if (!st) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Check for existing voucher
    const existingVoucher = await Voucher.findOne({ student: studentId, feeType, month });
    if (existingVoucher) {
      return res.status(400).json({ message: 'Voucher already exists for this student, fee type, and month' });
    }
    // Calculate previous dues
      const { total: previousDuesTotal, detail: previousDuesDetail } =
        await computePreviousDuesForStudent(st._id, feeType);

      // 4) Calculate current month breakdown
      const monthlyFee = st.feeDetails?.[feeType]?.payableFee
      const Extras = Array.isArray(Extras) ? Extras.filter(extra => extra.name !== 'Late Fee') : [];
      const latefee = Array.isArray(Extra) ? Extras.find(extra => extra.name === 'Late Fee') : 0;
      const extrasTotal = Extras.reduce((s, e) => s + Number(e.amount || 0), 0);

      const totalPayable = monthlyFee + extrasTotal + previousDuesTotal;
      const lateFeeAmount = latefee ? Number(latefee.amount || 0) : 0;
      const totalPayableWithLateFee = totalPayable + lateFeeAmount;

      // 5) Save voucher
      const voucherData = {
        student: st._id,
        feeType,
        month,

        class: null,
        coachingClass: null,
        computerCourse: null,
        computerCourseBatch: null,
        englishCourse: null,
        engCourseBatch: null,
        campus: st.campusId || null,
        school: st.schoolId || null,
        breakdown: {
          monthlyFee: st.feeDetails?.[feeType]?.payableFee || monthlyFee,
          extras,
          previousDuesTotal,
        },
        previousDuesDetail,
        totalPayable,
        totalPayableWithLateFee,
        issueDate: issueDate,
        dueDate: dueDate,
        expireDate: expireDate,
        status: totalPayable === 0 ? "Paid" : "Unpaid",
        createdBy: generatedBy || null,
      };
      if (feeType === "school") {
        voucherData.class = st.class || null;

      } else if (feeType === "tuition") {
        voucherData.coachingClass = st.coachingClass || null;

      } else if (feeType === "computer") {
        voucherData.computerCourse = payload.courseId || st.computerCourse || null;
        voucherData.computerCourseBatch = payload.batchId || st.computerCourseBatch || null;

      } else if (feeType === "english") {
        voucherData.englishCourse = payload.engCourseId || st.englishCourse || null;
        voucherData.engCourseBatch = payload.engBatchId || st.engCourseBatch || null;
      }

      const newVoucher = await Voucher.create(voucherData);
      res.status(201).json({ success: true, voucher: newVoucher });
  } catch (error) {
    console.error('Error generating voucher:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }

}