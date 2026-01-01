const statusRadios = document.querySelectorAll('input[name="status"]');
const roleRadios = document.querySelectorAll('input[name="role"]');
const leaveReasonBox = document.getElementById('leaveReasonBox');
const designationBox = document.getElementById('designationBox');
const leaveReasonInput = document.getElementById('leaveReason');
const employTypeBox = document.getElementById('employTypeBox');
const computerCourseBatchSelect = document.getElementById('computerCourseBatch');
const engCourseBatchSelect = document.getElementById('engCourseBatch');
const imgPreview = document.getElementById('imgPreview');
const teacherImageBox = document.querySelector('.square-box');
const teacherImage = document.getElementById('teacherImage')

// var campusDropdown = document.getElementById("campusDropdown");

// Show/hide Leave Reason box
statusRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    leaveReasonBox.style.display = document.getElementById('left').checked ? 'block' : 'none';

  });
});

// Show/hide Designation box
roleRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    designationBox.style.display = document.getElementById('roleStaff').checked ? 'block' : 'none';
    if (document.getElementById('roleStaff').checked) {
      employTypeBox.style.display = 'none';
      document.querySelectorAll('input[name="employType"]').forEach(cb => cb.checked = false);
      updateFormDisplay()
    }
    else {
      employTypeBox.style.display = 'block';

    }
  });
});
const user = JSON.parse(localStorage.getItem("userData")) || [];
const imageBox = document.getElementById("teacherImageBox");
var campusId = user[0]?.campus?._id || null;
const isSuperAdmin = user[0]?.designation === "supremeadmin";
var schoolId = isSuperAdmin ? null : user[0].school._id;
var isEdit = false

var imageUrl
// const sidebar = document.getElementById("sidebar");
var editingTeacherId = ''

if (user.length <= 0) {
  window.location.href = 'Dashboard.html'


}
const checkboxes = document.querySelectorAll('input[name="employType"]');
const classSectionFields = document.getElementById('classSectionFields');
const computerCourseField = document.getElementById('computerCourseField');
const teachercomputerCourseTableBody = document.querySelector("#computerCourseTable tbody");
const addTeacherCompCoursebtn = document.getElementById("addCompCourseBtn");

const engCourseField = document.getElementById('engCourseField');
const engcourseSelect = document.getElementById('engCourse');
const addTeacherCoursebtn = document.getElementById("addEngCourseBtn");

const teacherEngCourseTableBody = document.querySelector("#engCourseTable tbody");

const teacherSchoolClassFields = document.getElementById("teacherSchoolClassFields");
const teacherSchoolClassDropdown = document.getElementById("teacherSchoolClassDropdown");
const teacherSchoolSectionDropdown = document.getElementById("teacherSchoolSectionDropdown");
const teacherSchoolSubjectInput = document.getElementById("teacherSchoolSubjectInput");
const addTeacherSchoolClassBtn = document.getElementById("addTeacherSchoolClassBtn");
const teacherSchoolClassTableBody = document.querySelector("#teacherSchoolClassTable tbody");

// tuition divs
const teacherTuitionClassFields = document.getElementById("teacherTuitionClassFields");
const teacherTuitionClassDropdown = document.getElementById("teacherTuitionClassDropdown");
const teacherTuitionSectionDropdown = document.getElementById("teacherTuitionSectionDropdown");
const teacherTuitionSubjectInput = document.getElementById("teacherTuitionSubjectInput");
const addTeacherTuitionClassBtn = document.getElementById("addTeacherTuitionClassBtn");
const teacherTuitionClassTableBody = document.querySelector("#teacherTuitionClassTable tbody");

function updateFormDisplay() {

  const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

}

checkboxes.forEach(cb => cb.addEventListener('change', updateFormDisplay));

document.getElementById('admissionForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());
  if (imageUrl) {
    data.imageUrl = imageUrl
  }
  else {
    alert('select image')
    console.log('not')
    return
  }

  data.employTypes = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
  console.log(data.employTypes)
  if (document.getElementById('roleStaff').checked && !data.designation) {
    alert('Enter designation for staff')
    return
  }

  delete data.schoolclass;
  delete data.schoolsection;
  delete data.schoolsubject;
  delete data.tuitionclass;
  delete data.tuitionsection;
  delete data.tuitionsubject;
  delete data.isClassTeacher
  delete data.engCourse
  delete data.computerCourse;
  const selectedStatus = document.querySelector('input[name="status"]:checked').value;
  const leaveReason = leaveReasonInput.value;

  if (selectedStatus == 'left') {
    data.status = selectedStatus
    data.leftReason = leaveReason

  }
  else {
    data.status = selectedStatus
    data.leftReason = ''

  }

  if (document.getElementById('roleStaff').checked) {
    data.role = 'staff'
    data.designation = document.getElementById('designation').value || ''
  }
  else {
    data.role = 'teacher'
    data.designation = 'teacher'

  }

  const submitBtn = document.querySelector('button[type="submit"]');
  delete data.employType
  data.campus = isSuperAdmin
    ? document.getElementById("campusDropdown")?.value
    : campusId;
  data.schoolId = user[0]?.school?._id || schoolId;
  const createdBy = user[0]._id
  data.createdBy = createdBy
  try {
    if (isEdit) {
      submitBtn.textContent = 'updating...'
      // UPDATE STUDENT
      const res = await axios.put(
        `http://localhost:3000/api/teacher/update/${editingTeacherId}`,
        data
      );
      alert(res.data.message || " Teacher updated successfully");
      editingTeacherId = null;
      submitBtn.textContent = 'submit'

    } else {
      submitBtn.textContent = 'submiting...'

      // ADD STUDENT
      const res = await axios.post(
        "http://localhost:3000/api/teacher/add",
        data
      );
      alert(res.data.message || "teacher added successfully");
      submitBtn.textContent = 'submit'

    }
    form.reset();
    imageUrl = ''
    imgPreview.src = ''

  } catch (err) {
    console.error("Failed to add teacher:", err);
    alert("Failed to add teacher. Please check the form and try again.");
  }
  console.log('Submitted Data:', data);


  // TODO: Send to backend using fetch or axios
});

var queryParams = new URLSearchParams(window.location.search)
var isViewmode = queryParams.get('view') === 'true'
const form = document.getElementById("admissionForm");
async function loadData() {
  var teacherData = JSON.parse(localStorage.getItem('viewteacherData'))
  console.log(teacherData)
  editingTeacherId = teacherData?._id

  if (isViewmode && teacherData) {
    //      
    if (isSuperAdmin) {
      console.log(campusDropdown)
      campusDropdown.value = teacherData.campus._id;
      schoolId = teacherData.schoolId;
      campusId = teacherData.campus._id;
    }
    schoolId = teacherData.schoolId;

    if (teacherData.imageUrl) {
      // imageBox.src = studentData.imageUrl;
      imgPreview.src = teacherData.imageUrl;
      imageUrl = teacherData.imageUrl
    }

    for (let key in teacherData) {



      const el = form.elements[key];
      if (!el || key === "employTypes") continue;


      if (key === "dob" || key === 'joiningDate') {
        const dateValue = teacherData[key]?.slice(0, 10);
        console.log("Setting DOB:", dateValue);
        el.value = teacherData[key].slice(0, 10);
      } else if (el.type === "select-one") {
        el.value = teacherData[key] || "";
      } else {
        el.value = teacherData[key];
      }

      el.disabled = true; // disable after setting value

    }


    // ✅ Special handling for checkboxes (employType[])
    if (Array.isArray(teacherData.employTypes)) {
      document.querySelectorAll('input[name="employType"]').forEach(cb => {
        cb.checked = teacherData.employTypes.includes(cb.value);
      });
    }

    updateFormDisplay()

    Array.from(form.elements).forEach(el => el.disabled = true)
    console.log(campusDropdown)

    // document.getElementById('uploadImage').disabled = true

    document.getElementById('teacherImage').disabled = true
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.outerHTML = `<button type="button" id="editBtn" class="btn btn-warning mt-3">Edit</button>`;

    document.getElementById("editBtn").addEventListener("click", () => {
      Array.from(form.elements).forEach(el => el.disabled = false);
      document.getElementById('teacherImage').disabled = false
      // document.getElementById('uploadImage').disabled = false

      document.getElementById("editBtn").style.display = "none";
      isEdit = true

      const submitBtn = document.createElement("button");
      submitBtn.className = "btn btn-primary mt-3";
      submitBtn.type = "submit";
      submitBtn.textContent = "Update ";
      form.appendChild(submitBtn);
    });

  }
}


teacherImage.addEventListener('change', async function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) { imgPreview.src = e.target.result }
    reader.readAsDataURL(file);
  }

  // document.getElementById('uploadImage').addEventListener('click', async () => {

  if (teacherImage.files.length > 0) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "teacher_unsigned");  // your unsigned upload preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/drtd00x70/image/upload",
        formData,  // <-- send formData directly here
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = res.data;
      imageUrl = data.secure_url;
      imgPreview.src = imageUrl
      // console.log("Uploaded Image URL:", imageUrl);
      showToast('success', "Image uploaded successfully");

    } catch (error) {
      // console.error("Upload error:", error.response.data);
      showToast('error', "Upload error");

    }
  } else {
    showToast('error', "No file selected");

    // console.log("");
  }

});

//     
//     // Load data on page load
window.addEventListener("DOMContentLoaded", async () => {
  //   i
  await Promise.all([
    loadCampuses()
    // loadClasses(),
    // loadSections(),
    // loadCourses(),
    // loadEngCourses(),
    // loadComputerBatches(),
    // loadEnglishBatches()

  ]);
  // 
  loadData()
});

let campusList = [];
var campusDropdownField = document.getElementById('campusDropdownField')

// 🔽 Inject dropdown if superadmin

// 🟢 Fetch and populate schools dropdown
async function loadCampuses() {
  if (isSuperAdmin) {
    const campusDropdown = document.createElement("select");
    campusDropdown.className = "form-select mb-3";
    campusDropdown.id = "campusDropdown";
    campusDropdown.required = true;
    campusDropdown.addEventListener('change', async (e) => {
      campusId = e.target.value

      // loadData()

    })
    const label = document.createElement("label");
    label.textContent = "Select Campus";
    label.setAttribute("for", "campusDropdown");
    label.className = "form-label";

    campusDropdownField.appendChild(label)
    campusDropdownField.appendChild(campusDropdown)
    try {
      const res = await axios.get(`http://localhost:3000/api/campus/getBySchool/${user[0].school._id}`);

      campusList = res.data;
      campusDropdown.innerHTML = `<option value="">Select Campus</option>`;

      campusList.forEach(campus => {
        const option = document.createElement("option");
        option.value = campus._id;
        option.textContent = campus.name;
        campusDropdown.appendChild(option);
      });
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  }
}

function showToast(type, message) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: type,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
}