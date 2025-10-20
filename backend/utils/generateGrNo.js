// utils/generateGR.js
import Student from "../models/student.js";
import School from "../models/school.js";
import Campus from "../models/campus.js";
export const generateGR = async (schoolId, campusId, admissionType) => {
  try {
    let prefix = "";
    if (admissionType === "school") prefix = "SHH";
    else if (admissionType === "tuition") prefix = "T";
    else if (admissionType === "computer") prefix = "CC";
    else if (admissionType === "english") prefix = "EL";
    else throw new Error("Invalid admission type");

    const school = await School.findById(schoolId);
    const campus = await Campus.findById(campusId);
    const schoolCode = school.name;   // e.g. CS
    const campusCode = campus.code;
    // Find last GR for this type in same school + campus
    const lastStudent = await Student.findOne({
      schoolId,
      campusId,
      [`grNumbers.${admissionType}`]: { $exists: true, $ne: null },
    })
      .sort({ createdAt: -1 })
      .lean();
    console.log(lastStudent , 'last')
    let nextNumber = "001";
    if (lastStudent && lastStudent.grNumbers?.[admissionType]) {
      const lastDigits = lastStudent.grNumbers[admissionType].slice(-3);
      const newNum = parseInt(lastDigits) + 1;
      nextNumber = String(newNum).padStart(3, "0");
    }
    console.log(schoolCode, campusCode, prefix, nextNumber, 'final')
    return `${schoolCode}${campusCode}${prefix}${nextNumber}`;
  } catch (err) {
    console.error("Error generating GR:", err.message);
    throw err;
  }
};
