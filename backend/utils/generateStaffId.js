// utils/generateId.js
import School from "../models/school.js";
import Campus from "../models/campus.js";
import Teacher from "../models/teacher.js";
export const generateStaffId = async (schoolId, campus, role) => {
  const roleCode = role === "teacher" ? "TCH" : "STF";
  console.log(schoolId, campus, role);
  const school = await School.findById(schoolId);
  const campusdata = await Campus.findById(campus);
    console.log(school, campusdata);
  if (!school || !campusdata) {
    throw new Error("School or Campus not found");
  }
  const schoolCode = school.name;   // e.g. CS
  const campusCode = campusdata.code;
  // find last record for same school, campus & role
  const lastStaff = await Teacher.findOne({
    schoolId,
    campus,
    role
  }).sort({ createdAt: -1 });

  let serial = 1;
  if (lastStaff) {
    const lastId = lastStaff.staffCode.split("-").pop(); // e.g. "005"
    serial = parseInt(lastId, 10) + 1;
  }

  return `${schoolCode}-${campusCode}-${roleCode}-${serial.toString().padStart(3, "0")}`;
};
