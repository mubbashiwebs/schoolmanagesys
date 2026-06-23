
// DOM refs
const campusWrap = document.getElementById('campusWrap');
const campusSelect = document.getElementById('campusSelect');

const grnoWrap = document.getElementById('grnoWrap');
const grNoInput = document.getElementById('grNoInput');

const classWrap = document.getElementById('classWrap');
const classSelect = document.getElementById('classSelect');

const coachingClassesWrap = document.getElementById('coachingClassesWrap');
const coachingClassSelect = document.getElementById('coachingClassSelect');

const compcourseWrap = document.getElementById('compcourseWrap');
const courseSelect = document.getElementById('courseSelect');

const engcourseWrap = document.getElementById('engcourseWrap');
const engcourseSelect = document.getElementById('engcourseSelect');

// Computer course batch
const computerBatchWrap = document.getElementById('computerBatchWrap');
const computerCourseBatchSelect = document.getElementById('computerCourseBatchSelect');

// English course batch
const englishBatchWrap = document.getElementById('englishBatchWrap');
const engCourseBatchSelect = document.getElementById('engCourseBatchSelect');

// const sessionInput = document.getElementById('session');
const issueDate = document.getElementById('issueDate');
const dueDate = document.getElementById('dueDate');
const expireDate = document.getElementById('expireDate');

const extrasList = document.getElementById('extrasList');
const addExtraBtn = document.getElementById('addExtraBtn');
const clearExtrasBtn = document.getElementById('clearExtrasBtn');
const voucherForm = document.getElementById('voucherForm');
const resultsTable = document.querySelector('#resultsTable tbody');
const noResults = document.getElementById('noResults');
const loader = document.getElementById('loader');

const singelType = document.getElementById('sel_single');
const classWiseType = document.getElementById('sel_class');
const allType = document.getElementById('sel_all');
const courseWiseType = document.getElementById('sel_course');
const batchWiseType = document.getElementById('sel_batch');

const singleWiseBox = document.getElementById('singleWiseBox');
const classWiseBox = document.getElementById('ClassWiseBox');
const courseWiseBox = document.getElementById('CourseWiseBox');
const batchWiseBox = document.getElementById('BatchWiseBox');
const allBox = document.getElementById('AllWiseBox');
// Init
document.addEventListener('DOMContentLoaded', init);

function init() {
  // show campus if superadmin
  campusWrap.style.display = isSuperAdmin ? 'block' : 'none';



  setupFeeTypeListeners();
  setupSelectionListeners();
  addExtraField(); // start with one extra row (editable but can be zero)
  addExtraBtn.addEventListener('click', addExtraField);
  clearExtrasBtn.addEventListener('click', clearExtras);
  // voucherForm.addEventListener('submit', onGenerate);
}

function populateCampuses(list) {
  campusSelect.innerHTML = '<option value="">-- Select Campus --</option>';
  (list || []).forEach(c => campusSelect.insertAdjacentHTML('beforeend', `<option value="${c._id}">${escapeHtml(c.name)}</option>`));
}
function populateClasses(list) {
  classSelect.innerHTML = '<option value="">-- Select Class --</option>';
  (list || []).forEach(c => classSelect.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`));
}
function populateCourses(list) {
  courseSelect.innerHTML = '<option value="">-- Select Course --</option>';
  (list || []).forEach(c => courseSelect.insertAdjacentHTML('beforeend', `<option value="${c._id}">${escapeHtml(c.name)}</option>`));
}
function populateBatches(list) {
  batchSelect.innerHTML = '<option value="">-- Select Batch --</option>';
  (list || []).forEach(b => batchSelect.insertAdjacentHTML('beforeend', `<option value="${b._id}">${escapeHtml(b.name)}</option>`));
}
const radios = document.querySelectorAll('input[name="feeType"]');
radios.forEach(r => r.addEventListener('change', setupFeeTypeListeners));

const selectionRadios = document.querySelectorAll('input[name="selectionType"]');
selectionRadios.forEach(r => r.addEventListener('change', setupSelectionListeners));
function setupSelectionListeners() {
  grnoWrap.style.display = 'none';
  classWrap.style.display = 'none';
  coachingClassesWrap.style.display = 'none';
  compcourseWrap.style.display = 'none';
  computerBatchWrap.style.display = 'none';
  engcourseWrap.style.display = 'none';
  englishBatchWrap.style.display = 'none';
  const selectedFeeType = document.querySelector('input[name="feeType"]:checked').value;

  const val = document.querySelector('input[name="selectionType"]:checked').value;
  if (val === 'single' && selectedFeeType === 'school') {
    grnoWrap.style.display = 'block';
    classWrap.style.display = 'none';
    coachingClassesWrap.style.display = 'none';
    compcourseWrap.style.display = 'none';
    computerBatchWrap.style.display = 'none';
    engcourseWrap.style.display = 'none';
    englishBatchWrap.style.display = 'none';
  }

  if (val === 'single' && selectedFeeType === 'tuition') {
    grnoWrap.style.display = 'block';
    classWrap.style.display = 'none';
    coachingClassesWrap.style.display = 'block';
    compcourseWrap.style.display = 'none';
    computerBatchWrap.style.display = 'none';
    engcourseWrap.style.display = 'none';
    englishBatchWrap.style.display = 'none';
  }
  if (val === 'single' && selectedFeeType === 'computer' || selectedFeeType === 'english') {
    grnoWrap.style.display = 'block';
    classWrap.style.display = 'none';
    coachingClassesWrap.style.display = 'none';
    compcourseWrap.style.display = 'none';
    computerBatchWrap.style.display = 'none';
    engcourseWrap.style.display = 'none';
    englishBatchWrap.style.display = 'none';
  }

  if (val === 'class' && selectedFeeType === 'school') {
    grnoWrap.style.display = 'none';
    classWrap.style.display = 'block';
    coachingClassesWrap.style.display = 'none';
    compcourseWrap.style.display = 'none';
    computerBatchWrap.style.display = 'none';
    engcourseWrap.style.display = 'none';
    englishBatchWrap.style.display = 'none';
  }

  if (val === 'class' && selectedFeeType === 'tuition') {
    grnoWrap.style.display = 'none';
    classWrap.style.display = 'none';
    coachingClassesWrap.style.display = 'block';
    compcourseWrap.style.display = 'none';
    computerBatchWrap.style.display = 'none';
    engcourseWrap.style.display = 'none';
    englishBatchWrap.style.display = 'none';
  }

  if (val === 'all') {
    grnoWrap.style.display = 'none';
    classWrap.style.display = 'none';
    coachingClassesWrap.style.display = 'none';
    compcourseWrap.style.display = 'none';
    computerBatchWrap.style.display = 'none';
    engcourseWrap.style.display = 'none';
    englishBatchWrap.style.display = 'none';
  }
  if (val === 'course' && selectedFeeType === 'computer') {
    grnoWrap.style.display = 'none';
    classWrap.style.display = 'none';
    coachingClassesWrap.style.display = 'none';
    compcourseWrap.style.display = 'block';
    computerBatchWrap.style.display = 'none';
    engcourseWrap.style.display = 'none';
    englishBatchWrap.style.display = 'none';
  }
  if (val === 'course' && selectedFeeType === 'english') {
    grnoWrap.style.display = 'none';
    classWrap.style.display = 'none';
    coachingClassesWrap.style.display = 'none';
    compcourseWrap.style.display = 'none';
    computerBatchWrap.style.display = 'none';
    engcourseWrap.style.display = 'block';
    englishBatchWrap.style.display = 'none';
  }
  if (val === 'batch' && selectedFeeType === 'computer') {
    grnoWrap.style.display = 'none';
    classWrap.style.display = 'none';
    coachingClassesWrap.style.display = 'none';
    compcourseWrap.style.display = 'block';
    computerBatchWrap.style.display = 'block';
    engcourseWrap.style.display = 'none';
    englishBatchWrap.style.display = 'none';
  }
  if (val === 'batch' && selectedFeeType === 'english') {
    grnoWrap.style.display = 'none';
    classWrap.style.display = 'none';
    coachingClassesWrap.style.display = 'none';
    compcourseWrap.style.display = 'none';
    computerBatchWrap.style.display = 'none';
    engcourseWrap.style.display = 'block';
    englishBatchWrap.style.display = 'block';
  }
}
function setupFeeTypeListeners() {

  const val = document.querySelector('input[name="feeType"]:checked').value;
  if (val === 'school') {

    classWiseBox.style.display = 'block';
    courseWiseBox.style.display = 'none';
    batchWiseBox.style.display = 'none';
  }
  if (val === 'computer') {

    courseWiseBox.style.display = 'block';
    batchWiseBox.style.display = 'block';
    classWiseBox.style.display = 'none';
  }
  if (val === 'english') {

    courseWiseBox.style.display = 'block';
    batchWiseBox.style.display = 'block';
    classWiseBox.style.display = 'none';
  }

  if (val === 'tuition') {

    classWiseBox.style.display = 'block';
    courseWiseBox.style.display = 'none';
    batchWiseBox.style.display = 'none';
  }
  setupSelectionListeners();
}
const user = JSON.parse(localStorage.getItem("userData")) || [];
const isSuperAdmin = user[0]?.designation === "supremeadmin";

var campusId = user[0]?.campus?._id || null;
// const form = document.getElementById("studentForm");

let allClasses = [];
let allCoachingClasses = [];
let allSections = [];
let allCourses = [];
let engCourses = [];


// 🔽 Inject dropdown if superadmin

// 🟢 Fetch and populate schools dropdown
let campusList = [];

// 🔽 Inject dropdown if superadmin

// 🟢 Fetch and populate schools dropdown
async function loadCampuses() {
  if (isSuperAdmin) {
    // const campusDropdown = document.createElement("select");
    // campusDropdown.className = "form-select mb-3";
    // campusDropdown.id = "campusDropdown";
    // campusDropdown.name = "campusId";
    // campusDropdown.required = true;
    campusSelect.addEventListener('change', async (e) => {
      campusId = e.target.value
      loadClasses()
      loadCourses()
      loadEngCourses()
      //   loadSections()
      loadComputerBatches()
      loadEnglishBatches()
      loadCoachingClasses()
      // loadData()

    })
    // const label = document.createElement("label");
    // label.textContent = "Select Campus";
    // label.setAttribute("for", "campusDropdown");
    // label.className = "form-label";

    // // const form = document.getElementById("classForm");
    // form.insertBefore(label, form.children[2]); // Insert before fee input
    // form.insertBefore(campusDropdown, form.children[3]);


    try {
      const res = await api.get(`/campus/getBySchool`);

      campusList = res.data;
      console.log(campusList)
      campusSelect.innerHTML = `<option value="">Select Campus</option>`;

      campusList.forEach(campus => {
        const option = document.createElement("option");
        option.value = campus._id;
        option.textContent = campus.name;
        campusSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Error fetching campus:", err.response?.data || err.message);
    }
  }
}



// Load data on page load
window.addEventListener("DOMContentLoaded", async () => {

  if (!isSuperAdmin) {
    await Promise.all([

      loadClasses(),
      //   loadSections(),
      loadCourses(),
      loadEngCourses(),
      loadComputerBatches(),
      loadEnglishBatches(),
      loadCoachingClasses()

    ]);

  }
  else {
    loadCampuses()

  }


});

async function loadEngCourses() {

  if (!campusId) return;

  try {
    const url = `/english-courses/getByCampus/${campusId}`;
    const res = await api.get(url);
    engCourses = res.data.data;
    console.log(engCourses)
    engcourseSelect.innerHTML = `<option value="">Select Course</option>`;
    engCourses.forEach(course => {
      const option = document.createElement("option");
      option.value = course._id;
      option.textContent = course.name;

      engcourseSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading english courses:", err);
  }
}




// Load Classes
async function loadClasses() {
  console.log(campusId)
  if (!campusId) return;


  try {
    const url = `/class/getByCampus/${campusId}`;
    const res = await api.get(url);
    allClasses = res.data.data;
    classSelect.innerHTML = `<option value="">Select Class</option>`;
    // currentClass.innerHTML = `<option value="">Select Class</option>`;

    // tuitionclass.innerHTML = `<option value="">Select Class</option>`;
    allClasses.forEach(cls => {
      const option1 = document.createElement("option");
      option1.value = cls._id;
      option1.textContent = cls.name;
      option1.setAttribute("data-id", cls._id);
      classSelect.appendChild(option1);

      const option2 = document.createElement("option");

    });

  } catch (err) {
    console.error("Error loading classes:", err);
  }
}
async function loadCoachingClasses() {
  console.log(campusId)
  if (!campusId) return;


  try {
    const url = `/coachingClass/getByCampus/${campusId}`;
    const res = await api.get(url);
    allCoachingClasses = res.data.data;
    coachingClassSelect.innerHTML = `<option value="">Select Class</option>`;
    // tuitionclass.innerHTML = `<option value="">Select Class</option>`;

    allCoachingClasses.forEach(cls => {
      const option = document.createElement("option");
      option.value = cls._id;
      option.textContent = cls.name;
      option.setAttribute("data-id", cls._id); // store ID in data attribute

      coachingClassSelect.appendChild(option);
    });

  } catch (err) {
    console.error("Error loading classes:", err);
  }
}


async function loadCourses() {
  if (!campusId) return;

  try {
    const url = `/course/getbyCampus/${campusId}`;
    const res = await api.get(url);
    allCourses = res.data.data;
    courseSelect.innerHTML = `<option value="">Select Course</option>`;
    allCourses.forEach(course => {
      const option = document.createElement("option");
      option.value = course._id;
      option.textContent = course.name;
      option.setAttribute("data-id", course._id); // store ID in data attribute

      courseSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading computer courses:", err);
  }
}



// Function to handle computer course batch population
function updateComputerCourseBatches() {
  const selectedCourseId = courseSelect.value;
  const selectedCourse = allCourses.find(c => c._id === selectedCourseId);

  if (selectedCourse) {
    const batches = allComputerBatches.filter(
      b => b.courseName.name === selectedCourse.name
    ) || [];

    computerCourseBatchSelect.innerHTML = `<option value="">Select Batch</option>`;

    batches.forEach(batch => {
      const option = document.createElement("option");
      option.value = batch._id;
      option.textContent = batch.name;
      computerCourseBatchSelect.appendChild(option);
    });
  } else {
    computerCourseBatchSelect.innerHTML = `<option value="">Select Batch</option>`;
  }
}

// Function to handle English course batch population
function updateEnglishCourseBatches() {
  const selectedCourseId = engcourseSelect.value;
  const selectedCourse = engCourses.find(c => c._id === selectedCourseId);

  if (selectedCourse) {
    const batches = allEnglishBatches.filter(
      b => b.courseName.name === selectedCourse.name
    ) || [];

    engCourseBatchSelect.innerHTML = `<option value="">Select Batch</option>`;

    batches.forEach(batch => {
      const option = document.createElement("option");
      option.value = batch._id;
      option.textContent = batch.name;
      engCourseBatchSelect.appendChild(option);
    });
  } else {
    engCourseBatchSelect.innerHTML = `<option value="">Select Batch</option>`;
  }
}

courseSelect.addEventListener('change', updateComputerCourseBatches);
engcourseSelect.addEventListener('change', updateEnglishCourseBatches);

var allComputerBatches = []
async function loadComputerBatches() {
  if (!campusId) return;
  try {
    const url = `/batch/getAllComputerBatchesByCampus/${campusId}`;
    const res = await api.get(url);
    allComputerBatches = res.data.data;
    console.log(allComputerBatches)

  } catch (err) {
    console.error("Error loading computer batches:", err.response?.data?.message || err.message);
  }
}

var allEnglishBatches = []
async function loadEnglishBatches() {
  if (!campusId) return;
  try {
    const url = `/batch/getAllEnglishBatchesByCampus/${campusId}`;
    const res = await api.get(url);
    allEnglishBatches = res.data.data;


  } catch (err) {
    console.error("Error loading english batches:", err.response?.data?.message || err.message);
  }
}


function addExtraField(name = '', amount = 0) {
  const id = 'extra_' + Math.random().toString(36).slice(2, 9);
  const row = document.createElement('div');
  row.className = 'row g-2 align-items-center';
  row.innerHTML = `
    <div class="col-md-6">
      <input type="text" class="form-control form-control-sm extra-name" placeholder="Field name (e.g. Admission Fee)" value="${escapeHtml(name)}">
    </div>
    <div class="col-md-4">
      <input type="number" class="form-control form-control-sm extra-amount" placeholder="Amount" min="0" value="${Number(amount)}">
    </div>
    <div class="col-md-2 text-end">
      <button type="button" class="btn btn-sm btn-outline-danger remove-extra">Remove</button>
    </div>
  `;
  extrasList.appendChild(row);
  row.querySelector('.remove-extra').addEventListener('click', () => row.remove());
}

function clearExtras() {
  extrasList.innerHTML = '';
}

function collectExtras() {
  const rows = extrasList.querySelectorAll('.row');
  const extras = [];
  rows.forEach(r => {
    const name = r.querySelector('.extra-name').value.trim();
    const amount = Number(r.querySelector('.extra-amount').value || 0);
    if (name && amount > 0) extras.push({ name, amount });
  });
  return extras;
}

function showLoader(show = true) {
  loader.style.display = show ? 'flex' : 'none';
}

function toast(message, type = 'primary', ttl = 4000) {
  const id = 't' + Date.now();
  const el = document.createElement('div');
  el.className = `toast align-items-center text-bg-${type} border-0`;
  el.setAttribute('role', 'alert');
  el.setAttribute('aria-live', 'assertive');
  el.setAttribute('aria-atomic', 'true');
  el.id = id;
  el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${escapeHtml(message)}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  document.getElementById('toastContainer').appendChild(el);
  const btoast = new bootstrap.Toast(el, { delay: ttl });
  btoast.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}
var studentResults = document.getElementById('resultsTableBody');
var selectedStudentId = null;
// Form submit
async function onGenerate(studentId = null) {
 
  const feeType = document.querySelector('input[name="feeType"]:checked').value;
  const selectionType = document.querySelector('input[name="selectionType"]:checked').value;
  const month = document.getElementById('monthInput').value;
  if (!month) return toast('Please pick a month', 'warning');

  //   const monthlyFee = Number(document.getElementById('monthlyFee').value || 0);
  const extras = collectExtras();
  const payload = {
    feeType,
    month,

    selectionType,
    grNo: grNoInput.value || null,
    extras,
    generatedBy: 'frontend-user' // replace with actual user id in real app
  };
  selectedStudentId = studentId;
  if (studentId) {
    payload.studentId = studentId;
  }

  // Add filters
  if (feeType === 'school') {
    payload.class = classSelect.value || null;
    payload.coachingClass = null;
    payload.courseId = null;
    payload.batchId = null;
    payload.engCourseId = null;
    payload.engBatchId = null;


    if (isSuperAdmin && campusSelect.value) payload.campusId = campusSelect.value;
    else payload.campusId = campusId;

  } else if (feeType === 'tuition') {
    payload.coachingClass = coachingClassSelect.value || null;
    payload.class = null;
    payload.courseId = null;
    payload.batchId = null;
    payload.engCourseId = null;
    payload.engBatchId = null;
    payload.campusId = isSuperAdmin && campusSelect.value ? campusSelect.value : campusId;

  } else if (feeType === 'computer') {
    payload.courseId = courseSelect.value || null;
    payload.batchId = computerCourseBatchSelect.value || null;
    payload.class = null;
    payload.coachingClass = null;
    payload.engCourseId = null;
    payload.engBatchId = null;
    payload.campusId = isSuperAdmin && campusSelect.value ? campusSelect.value : campusId;

  } else if (feeType === 'english') {
    payload.engCourseId = engcourseSelect.value || null;
    payload.engBatchId = engCourseBatchSelect.value || null;
    payload.class = null;
    payload.coachingClass = null;
    payload.courseId = null;
    payload.batchId = null;
    payload.campusId = isSuperAdmin && campusSelect.value ? campusSelect.value : campusId;
  }

  payload.issueDate = issueDate.value || null;
  payload.dueDate = dueDate.value || null;
  payload.expireDate = expireDate.value || null;

  if (issueDate.value == null || dueDate.value == null || expireDate.value == null) {
    return toast('Please select issue date, due date and expire date', 'warning');
  }

  if (new Date(issueDate.value) > new Date(expireDate.value)) {
    return toast('Expire date must be after issue date', 'warning');
  }
  if (new Date(issueDate.value) > new Date(dueDate.value)) {
    return toast('Due date must be after issue date', 'warning');
  }
  // basic validation
  if (feeType === 'school' && selectionType === 'class' && !payload.class) {
    return toast('Select class for school fee type', 'warning');
  }
  if (feeType === 'tuition' && !payload.coachingClass) {
    return toast('Select coaching class', 'warning');
  }
  if (feeType === 'computer' && (!payload.courseId || !payload.batchId)) {
    return toast('Select computer course and batch', 'warning');
  }
  if (feeType === 'english' && (!payload.engCourseId || !payload.engBatchId)) {
    return toast('Select English course and batch', 'warning');
  }

 
  // show loader
  showLoader(true);
  // noResults.style.display = 'none';
  // resultsTable.innerHTML = '';

  try {
    studentResults.innerHTML = '';
    let res = await api.post('/voucher/generate', payload)
    console.log(res.data)
    if (res.data.students?.length > 0) {
      console.log(res.data.students)
      res.data.students.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHtml(student.name)}</td>
          <td>${escapeHtml(student.fatherName)}</td>
          <td>${escapeHtml(student.grNumbers.school)}</td>
          <td>${escapeHtml(student.status)}</td>
          <td>
          <button class="btn  btn-outline-primary view-voucher-btn" onclick="onGenerate('${student._id}')">Generate Voucher</button>
          </td>
          `
        studentResults.appendChild(tr);
      });
      showLoader(false);
      return;
    }
    // render results
    // renderResults(responseJson);
    toast('Voucher generation finished', 'success');
  } catch (err) {
    console.error(err.response?.data.message || err.message);
    toast('Failed to generate vouchers: ' + err.message, 'danger', 7000);
  } finally {
    showLoader(false);
    studentId = null;
  }

}



/* Utility helpers */
function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, function (m) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
  });
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

