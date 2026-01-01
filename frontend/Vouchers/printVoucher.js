const user = JSON.parse(localStorage.getItem("userData")) || [];
  const isSuperAdmin = user[0]?.designation === "supremeadmin";

if(!user[0]){
  window.location.href='/Dashboard.html'
}
    const feeTypeSelect = document.getElementById('feeType');
    // const classField = document.getElementById('classField');
    // const coachingField = document.getElementById('coachingField');
    // const courseField = document.getElementById('courseField');
    // const batchField = document.getElementById('batchField');
const studentGrno = document.getElementById("grNo")
const campusWrap = document.getElementById('campusWrap');
const campusSelect = document.getElementById('campusSelect');
const grnoWrap = document.getElementById('grnoWrap');

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

const singleWiseBox = document.getElementById('singleWiseBox');
const classWiseBox = document.getElementById('ClassWiseBox');
const courseWiseBox = document.getElementById('CourseWiseBox');
const batchWiseBox = document.getElementById('BatchWiseBox');
const allBox = document.getElementById('AllWiseBox');

    const voucherContainer = document.getElementById('voucherContainer');
    let currentVouchers = [];

    // show/hide dropdowns
    feeTypeSelect.addEventListener('change', () => {
      const val = feeTypeSelect.value;

  if (val === 'school') {
     
      classWiseBox.style.display = 'block';
      courseWiseBox.style.display = 'none';
      batchWiseBox.style.display = 'none';
    } 
    if(val === 'computer') {
      
       courseWiseBox.style.display = 'block';
      batchWiseBox.style.display = 'block';
      classWiseBox.style.display = 'none';
    }
        if(val === 'english') {
  
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
    }); 
     const selectionTypeSelect = document.getElementById('selectionTypeSelect');
  selectionTypeSelect.addEventListener('change', setupSelectionListeners);
    setupSelectionListeners();
    
function setupSelectionListeners() {

  // 🔒 Pehle sab hide
  grnoWrap.style.display = 'none';
  classWrap.style.display = 'none';
  coachingClassesWrap.style.display = 'none';
  compcourseWrap.style.display = 'none';
  computerBatchWrap.style.display = 'none';
  engcourseWrap.style.display = 'none';
  englishBatchWrap.style.display = 'none';

  const selectedFeeType = feeTypeSelect.value;
  const val = selectionTypeSelect.value;

  // SINGLE
  if (val === 'single' && selectedFeeType === 'school') {
    grnoWrap.style.display = 'block';
  }

  if (val === 'single' && selectedFeeType === 'tuition') {
    grnoWrap.style.display = 'block';
    // coachingClassesWrap.style.display = 'block';
  }

  if (val === 'single' && (selectedFeeType === 'computer' || selectedFeeType === 'english')) {
    grnoWrap.style.display = 'block';
  }

  // CLASS
  if (val === 'class' && selectedFeeType === 'school') {
    classWrap.style.display = 'block';
  }

  if (val === 'class' && selectedFeeType === 'tuition') {
    coachingClassesWrap.style.display = 'block';
  }

  // ALL → sab hidden hi rahenge (upar already hide)

  // COURSE
  if (val === 'course' && selectedFeeType === 'computer') {
    compcourseWrap.style.display = 'block';
  }

  if (val === 'course' && selectedFeeType === 'english') {
    engcourseWrap.style.display = 'block';
  }

  // BATCH
  if (val === 'batch' && selectedFeeType === 'computer') {
    compcourseWrap.style.display = 'block';
    computerBatchWrap.style.display = 'block';
  }

  if (val === 'batch' && selectedFeeType === 'english') {
    engcourseWrap.style.display = 'block';
    englishBatchWrap.style.display = 'block';
  }
}

    

  var campusId = user[0]?.campus?._id || null;
  // const form = document.getElementById("studentForm");

  let allClasses = [];
  let allCoachingClasses = [];
  let allSections = [];
  let allCourses = [];
  let engCourses = [];
   let schoolList = [];
var schoolDropdown
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
    campusSelect.addEventListener('change', async(e)=>{
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
    
  
      try {        const res = await axios.get(`http://localhost:3000/api/campus/getBySchool/${user[0].school._id}`);

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
        console.error("Error fetching schools:", err);
      }
    }
    }
    
  

  // Load data on page load
  window.addEventListener("DOMContentLoaded", async () => {

    if(!isSuperAdmin){
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
    else{
        campusWrap.style.display = 'block';
    loadCampuses()

    }
   

  });

 async function loadEngCourses() {
      
      if (!campusId) return;

    try {
      const url =`http://localhost:3000/api/english-courses/getByCampus/${user[0].school._id}/${campusId}`;
      const res = await axios.get(url);
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
      console.error("Error loading computer courses:", err);
    }
  }

  


    // Load Classes
    async function loadClasses() {  
        console.log(campusId)
      if (!campusId) return;
     

      try {
        const url =  `http://localhost:3000/api/class/getByCampus/${user[0].school._id}/${campusId}`;
        const res = await axios.get(url);
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
        const url =  `http://localhost:3000/api/coachingClass/getByCampus/${user[0].school._id}/${campusId}`;
        const res = await axios.get(url);
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
    // Load Sections (independent of class)
    // async function loadSections() {
    //   if (!campusId) return;
    
    //   try {
    //     const url =  `http://localhost:3000/api/section/getByCampus/${user[0].school._id}/${campusId}`;
    //     const res = await axios.get(url);
    //     allSections = res.data.data;
    //     sectionSelect.innerHTML = `<option value="">Select Section</option>`;
    //            currentSection.innerHTML = `<option value="">Select Section</option>`;
    //     allSections.forEach(sec => {
    //       const option = document.createElement("option");
    //       option.value = sec._id;
    //       option.textContent = sec.name;
    //       sectionSelect.appendChild(option);

    //        const option2 = document.createElement("option");
    //       option2.value = sec._id;
    //       option2.textContent = sec.name;
    //       currentSection.appendChild(option2);
    //     });

    //   } catch (err) {
    //     console.error("Error loading sections:", err);
    //   }
    // }

    // Load Computer Courses
    async function loadCourses() {
      if (!campusId) return;
     
      try {
        const url = `http://localhost:3000/api/course/getbyCampus/${user[0].school._id}/${campusId}`;
        const res = await axios.get(url);
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
    async function loadComputerBatches(){
      if (!campusId) return;
      try {
        const url = `http://localhost:3000/api/batch/getAllComputerBatchesByCampus/${user[0].school._id}/${campusId}`;
        const res = await axios.get(url);
        allComputerBatches = res.data.data;
        console.log(allComputerBatches)
        
      } catch (err) {
        console.error("Error loading computer courses:", err);
      }
    }

    var allEnglishBatches = []
     async function loadEnglishBatches(){
      if (!campusId) return;
      try {
        const url = `http://localhost:3000/api/batch/getAllEnglishBatchesByCampus/${user[0].school._id}/${campusId}`;
        const res = await axios.get(url);
        allEnglishBatches = res.data.data;
       
        
      } catch (err) {
        console.error("Error loading computer courses:", err);
      }
    }


    // fetch vouchers
    document.getElementById('fetchBtn').addEventListener('click', async () => {
      const feeType = feeTypeSelect.value;
      const month = document.getElementById('month').value;
      const selectionType = selectionTypeSelect.value
      var campusId = campusSelect.value;
      var schoolId = user[0].school._id || null;
      if (!feeType || !month || !selectionType ) return alert('Please fill all fields');
      if(isSuperAdmin && !campusId){
        return alert('Please select campus');
      }
      if(schoolId == null){ 
        return alert('School ID not found for the user.');
      }

      const params = new URLSearchParams({ feeType, month , selectionType, campusId, schoolId });

  if(selectionType == 'single'){
    if (studentGrno.value.trim() === '') {
      alert('Please enter student GR number');
      return;
    }
    params.append('stdGrNo', studentGrno.value.trim());

  }
  if(selectionType == 'class'){
    if(feeType === 'school'){
        const classId = document.getElementById('classSelect').value;
        if (!classId) {
          alert('Please select class');
          return;
        }
        params.append('classId', classId);
    }
    if(feeType === 'tuition'){
        const coachingClass = document.getElementById('coachingClassSelect').value;
        if (!coachingClass) {
          alert('Please select coaching class');
          return;
        }
        params.append('coachingClass', coachingClass);
    }
  }
  if(selectionType == 'course'){
    if(feeType === 'computer'){
        const courseId = courseSelect.value;
        if (!courseId) {
          alert('Please select computer course');
          return;
        }
        params.append('courseId', courseId);
    }
    if(feeType === 'english'){
        const engCourseId = engcourseSelect.value;
        if (!engCourseId) {
          alert('Please select English course');
          return;
        }
        params.append('engCourseId', engCourseId);
    }
  }
  if(selectionType == 'batch'){
    if(feeType === 'computer'){
        const courseId = courseSelect.value;
        const batchId = computerCourseBatchSelect.value;
        if (!courseId) {
          alert('Please select computer course');

          return; 
        }
        if (!batchId) {
          alert('Please select computer batch');
          return;
        }
        params.append('courseId', courseId);
        params.append('batchId', batchId);
    }
    if(feeType === 'english'){
        const engCourseId = engcourseSelect.value;
        const engBatchId = engCourseBatchSelect.value;
        if (!engCourseId) {
          alert('Please select English course');
          return;
        }
        if (!engBatchId) {
          alert('Please select English batch');
          return;
        }
        params.append('engCourseId', engCourseId);
        params.append('engBatchId', engBatchId);
    } 
  }
      console.log(params.toString())
     
      const res = await fetch(`http://localhost:3000/api/voucher/by-class?${params}`);
      const data = await res.json();
      console.log(data)
        if(data.students && data.students.length > 0){
        console.log('students',data.students)
        renderStudentsForVoucher(data.students)
        return 
      }
      if (!data.success || !data.vouchers?.length) {
        voucherContainer.innerHTML = '<div class="alert alert-warning">No vouchers found</div>';
        return;
      }
    

      currentVouchers = data.vouchers;
      alert('Vouchers fetched. Ready to print.');
      console.log(currentVouchers);
    //   renderVouchers(data.vouchers);
    });

    document.getElementById('deleteBtn').addEventListener('click', async () => {
        console.log('delte button')
      const feeType = feeTypeSelect.value;
      const month = document.getElementById('month').value;
      const campusId = campusSelect.value;

      if (!feeType || !month ) return alert('Please fill all fields');

      const params = new URLSearchParams({ feeType, month, });
      if (feeType === 'school') params.append('classId', document.getElementById('classSelect').value);
      if (feeType === 'tuition') params.append('coachingClass', document.getElementById('coachingClassSelect').value);
      if ( feeType === 'computer') {
        params.append('courseId', courseSelect.value);
        params.append('batchId',computerCourseBatchSelect.value);
      }
      if (feeType === 'english') {
        params.append('engCourseId', engcourseSelect.value);
        params.append('engBatchId',engCourseBatchSelect.value);
      }

      if(studentGrno.value.trim() !== ''){
        params.append('stdGrNo',studentGrno.value.trim())
      }

      console.log(params.toString())

      const res = await axios.delete(`http://localhost:3000/api/voucher/delete?${params}`);
      const data = await res.data;
      console.log(data)
      if (!data.success || !data.vouchers?.length) {
        voucherContainer.innerHTML = '<div class="alert alert-warning">No vouchers found</div>';
        return;
      }

      currentVouchers = data.vouchers;
      alert('Vouchers fetched. Ready to print.');
      console.log(currentVouchers);
      renderVouchers(data.vouchers);
    });


    // ✅ print in new window
 document.getElementById('printBtn').addEventListener('click', () => {
  if (currentVouchers.length === 0) return alert('No vouchers to print');

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();

  // 👇 start writing HTML


  // 👇 loop vouchers dynamically

  currentVouchers.forEach((v, i) => {
  // Format dates
  console.log(v)
  const formatDate = (d) => d ? new Date(d).toISOString().split('T')[0] : '-';
// const [y, m, d] = date.split("-");
// const formatted = `${d}/${m}/${y}`;

// console.log(formatted); // 23/01/2026 ✅

const dateStr = v.month;
const [year, month] = dateStr.split("-");
console.log(year,month)
const monthIndex = parseInt(month, 10) - 1; // month 0-based hota hai
const monthName = new Date(year, monthIndex).toLocaleString("default", { month: "long" });

const vmonth = `${monthName}-${year}`;
console.log(vmonth); // 👉 "October-2025"
  // Fee Breakdown Rows
  let feeRows = '';
  let serial = 1;

   
    feeRows += `
    

      <tr>
        <th>Arrears</th>
        <td>${v.breakdown.previousDuesTotal > 0 ? v.breakdown.previousDuesTotal :'-'}</td>
        
      </tr>`;

  if (v.breakdown.monthlyFee) {
    feeRows += `
      <tr>
       
        <td>${vmonth}</td>
        <td>${v.breakdown.monthlyFee}</td>
      </tr>`;
  }


//   if( v.previousDuesDetail.length == 0){
//     // v.previousDuesDetails.forEach((due) => {
//       feeRows += `
//         <tr>
//           <td>${serial++}</td>
//           <td>${ 'June'}</td>
//           <td>${ 1000}</td>
//         </tr>`;
//     // });
//   }

  if (Array.isArray(v.breakdown.extras) && v.breakdown.extras.length > 0) {
    v.breakdown.extras.forEach((e) => {
      feeRows += `
        <tr>
        
          <td>${e.name || 'Extra Fee'}</td>
          <td>${e.amount || 0}</td>
        </tr>`;
    });
  }

  if (!feeRows) {
    feeRows = `<tr><td colspan="3" class="text-center">No Fee Details</td></tr>`;
  }

  // Generate HTML Voucher
  doc.write(`
<!DOCTYPE html>

  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${v.school.name} - Fee Voucher</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>


      body { font-family: 'Poppins', sans-serif;  padding: 30px; }
     .voucher {
    background:#fff;
    border: 2px solid #000;
    border-radius: 10px;
    padding: 20px 25px;
    max-width: 100%;
   page-break-after: always;
    margin-bottom: 10px; 
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
  }
      .school-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
      .school-logo { width: 70px; height: 70px; object-fit: contain; margin-bottom: 10px; }
      .voucher-title { font-size: 20px; font-weight: 600; text-transform: uppercase; color: #000; }
      .voucher-info td { padding: 3px 8px; vertical-align: top; }
       .voucher-info {
    table-layout: fixed;   /* Prevent stretching */
    width: 100%;
  }

 .label-title {
    font-weight: 700;
    white-space: nowrap;
  }
  .label-value {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
      .fee-table th, .fee-table td { border: 1px solid #000 !important; text-align: center; vertical-align: middle; padding: 8px; font-size: 14px; }
      .fee-table th { background: #e9ecef; font-weight: 600; }
      .footer { margin-top: 40px; display: flex; justify-content: space-between; }
      .signature { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; }
      @media print { .btn-print { display: none; } }
    </style>
  </head>
  <body>
    <div class="voucher">
      <!-- HEADER -->
      <div class="school-header">
        <img src="https://scontent-dfw5-2.xx.fbcdn.net/v/t39.30808-1/331426912_756846226117148_7502688340371449890_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=4Xy7YAjEclQQ7kNvwFjxdMP&_nc_oc=Adk6yfhO404JfaNE-TbOokIEFN1N8sxlHZ7iw5cJQWFaT_BHIETyLlt81SSbhDyMHcOMQsdTniCIx_VX2ck47Edi&_nc_zt=24&_nc_ht=scontent-dfw5-2.xx&_nc_gid=Ih-Xh_AI0glR97JGa_AVKg&oh=00_Afc2TIWWp4s8BINqVdfy0Xnzwx2TbLAF2AJkWmxH2RF2ew&oe=6907F672" class="school-logo" alt="School Logo">
        <h4 class="fw-bold mb-0">${v.school?.name}</h4>
        <p class="mb-1">Campus: ${v.campus?.name || '-'}</p>
        <div class="voucher-title">${'Fee'} Voucher</div>
        <div class="voucher-title">For ${vmonth}</div>
      </div>

    
<table class="table table-borderless w-100 mb-3">
  <tr>
    <td>
      <div class="label-title">Name</div>
      <div class="label-value">${v.student?.name || '-'}</div>
    </td>

    <td>
      <div class="label-title">Voucher No</div>
      <div class="label-value">#${v.voucherNo || '-'}</div>
    </td>

    <td>
      <div class="label-title text-end">Issue Date</div>
      <div class="label-value text-end">${formatDate(v.issueDate)}</div>
    </td>
  </tr>

  <tr>
    <td>
      <div class="label-title">Father Name</div>
      <div class="label-value">${v.student?.fatherName || '-'}</div>
    </td>

    ${
      v.feeType === 'school'
        ? `<td>
            <div class="label-title">Class Section</div>
            <div class="label-value">${v.class?.name || '-'} - ${v.section?.name || '-'}</div>
          </td>`
        : ''
    }

    ${
      v.feeType === 'tuition'
        ? `<td>
            <div class="label-title">Coaching Class</div>
            <div class="label-value">${v.coachingClass?.name || '-'}</div>
          </td>`
        : ''
    }

    ${
      v.feeType === 'computer'
        ? `<td>
            <div class="label-title">Course</div>
            <div class="label-value">${v.computerCourse?.name || '-'} / ${v.computerCourseBatch?.name || '-'}</div>
          </td>`
        : ''
    }

    ${
      v.feeType === 'english'
        ? `<td>
            <div class="label-title">Eng Course</div>
            <div class="label-value">${v.englishCourse?.name || '-'} / ${v.engCourseBatch?.name || '-'}</div>
          </td>`
        : ''
    }

    <td>
      <div class="label-title text-end">Due Date</div>
      <div class="label-value text-end">${v.dueDate.split('T')[0]}</div>
    </td>
  </tr>
</table>

      <!-- FEE BREAKDOWN -->
      <table class="table fee-table">
        <thead>
          <tr>
           
            <th>Comp#</th>
            <th>${v.student.grNumbers[v.feeType]}</th>
          </tr>
        </thead>
        <tbody>
          ${feeRows}
        </tbody>
        <tfoot>
          <tr>
            <th  class="text-center">Total Payable Fee Within DueData</th>
            <th>${v.totalPayable }</th>
          </tr>
             <tr>
            <th  class="text-center text-danger">Late Fee</th>
            <th class='text-danger'>${v.totalPayableWithLateFee-v.totalPayable }</th>
          </tr>
              <tr>
            <th  class="text-center">Total Payable Fee After DueData</th>
            <th>${v.totalPayableWithLateFee }</th>
          </tr>
        </tfoot>
      </table>

    <p class='fw-bold text-end'>فیس تاریخِ ادائیگی سے قبل ادا کر کے لیٹ فیس بچائیں۔ </p>
     
    
    </div>
   
  </html>
  `);
});

  // ✅ close tags after writing all vouchers
  doc.write(`</div>`);
  doc.close();

  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };
});


const studenName = document.getElementById('name')
const fatherName = document.getElementById('fname')
 var voucher
// ---------------------------
// LOAD VOUCHER DATA USING AXIOS
// ---------------------------
async function loadVoucher() {
  try {
    // const res = await axios.get(`http://localhost:3000/api/voucher/getOne/${studenName.value}/${fatherName.value}`);
     voucher = currentVouchers[0];
console.log(voucher )
console.log('working' )

    document.getElementById("monthlyFee").value = voucher.breakdown.monthlyFee;
    document.getElementById("lateFee").value = voucher.totalPayableWithLateFee - voucher.totalPayable || 0;
    console.log(voucher)
    console.log(voucher.issueDate)
    console.log(voucher.dueDate)
    console.log(voucher.expireDate)
    document.getElementById('issueDate').value = voucher.issueDate.split('T')[0]
    document.getElementById('dueDate').value = voucher.dueDate.split('T')[0]
    document.getElementById('expireDate').value = voucher.expireDate.split('T')[0]
    // Load Extras
    voucher.breakdown.extras.forEach(extra => {
      addExtraRow(extra.name, extra.amount);
    });

    calculateTotals();
  } catch (err) {
    // alert(err.response.data.message)
    // console.error(err.response.data.message);
    // alert("Error loading voucher");
  }
}

  const modal = new bootstrap.Modal(document.getElementById("editVoucherModal"));

// loadVoucher();
document.getElementById('edit').addEventListener('click',async()=>{

  await loadVoucher()
  if(currentVouchers.length == 0){
    return alert('No voucher found to edit')
  }
  modal.show()
})

// ---------------------------
// ADD EXTRA ROW
// ---------------------------
document.getElementById("addExtraBtn").addEventListener("click", () => {
  addExtraRow("", "");
});

function addExtraRow(name = "", amount = "") {
  const tbody = document.getElementById("extrasBody");

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><input class="form-control extraName" value="${name}"></td>
    <td><input class="form-control extraAmount" type="number" value="${amount}"></td>
    <td>
      <button class="btn btn-danger btn-sm removeBtn">🗑</button>
    </td>
  `;

  tbody.appendChild(tr);

  // Delete row
  tr.querySelector(".removeBtn").addEventListener("click", () => {
    tr.remove();
    calculateTotals();
  });

  // Inputs auto recalc
  tr.querySelector(".extraAmount").addEventListener("input", calculateTotals);
}
document.querySelectorAll('input[name="showArrears"]').forEach(input => {
  input.addEventListener('change', calculateTotals);
});
function getShowArrearsValue() {
  const selected = document.querySelector('input[name="showArrears"]:checked');
  return selected ? selected.value : "no";
}

// Example usage:

// ---------------------------
// TOTAL CALCULATOR
// ---------------------------
function calculateTotals() {
  console.log('selected',getShowArrearsValue())
  const monthlyFee = Number(document.getElementById("monthlyFee").value || 0);
  const lateFee = Number(document.getElementById("lateFee").value || 0);
const showArrears = getShowArrearsValue();
console.log("Show Arrears:", showArrears);
  let extrasTotal = 0;

  document.querySelectorAll(".extraAmount").forEach(input => {
    extrasTotal += Number(input.value || 0);
  });
console.log(voucher.breakdown.previousDuesTotal)
var totalwithoutArrears =
  Number(monthlyFee) +
  Number(extrasTotal);
var total =
  Number(monthlyFee) +
  Number(extrasTotal);
  total = showArrears === 'yes' ? total + Number(voucher.breakdown.previousDuesTotal || 0) : totalwithoutArrears;
 
 

  console.log(total)
  const grand = total + lateFee;

  document.getElementById("totalAmount").textContent = total;
  document.getElementById("grandTotal").textContent = grand;
}

document.getElementById("monthlyFee").addEventListener("input", calculateTotals);
document.getElementById("lateFee").addEventListener("input", calculateTotals);


// ---------------------------
// SAVE VOUCHER USING AXIOS (PUT)
// ---------------------------
async function saveVoucher() {
  try {
    const voucherId = voucher._id;
    const monthlyFee = Number(document.getElementById("monthlyFee").value);
    const lateFee = Number(document.getElementById("lateFee").value);
    const issueDate = document.getElementById('issueDate').value;
    const dueDate = document.getElementById('dueDate').value;
    const expireDate = document.getElementById('expireDate').value;
    const extras = [];
    document.querySelectorAll("#extrasBody tr").forEach(tr => {
      extras.push({
        name: tr.querySelector(".extraName").value,
        amount: Number(tr.querySelector(".extraAmount").value)
      });
    });
    var showArrears = getShowArrearsValue();

    const updateBody = {
      monthlyFee,
      lateFee,
      extras,
      issueDate,
      dueDate,
      expireDate,
      showArrears:showArrears == 'yes' ? true : false
    };

    const res = await axios.put(`http://localhost:3000/api/voucher/update/${voucherId}`, updateBody);
    console.log(res.data);
    alert("Voucher Updated Successfully!");
  } catch (err) {
    console.error(err);
    alert("Error saving voucher");
  }
}

 var studentResults = document.getElementById('resultsTableBody');


function renderStudentsForVoucher(students) {
  studentResults.innerHTML = '';

  students.forEach(student => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.fatherName}</td>
      <td>${student.grNumbers.school}</td>
      <td>${student.status}</td>
      <td colspan="2">
        <button 
          class="btn btn-sm btn-outline-dark view-voucher-btn"
          data-voucher='${JSON.stringify(student.voucher)}'
        >
          🖨️
        </button>
       
        
        <button class="btn btn-sm btn-info ">✏️</button>

        <button data-voucher='${JSON.stringify(student.voucher)}' class=" btn btn-sm btn-danger mt-2 mt-md-auto"  id="deleteBtn">🗑️</button>

      </td>
    `;
   

    studentResults.appendChild(tr);
  });
  document.querySelectorAll('#deleteBtn').forEach(btn => {
    btn.addEventListener('click', function () {

      const voucher = JSON.parse(this.dataset.voucher);
      if(!voucher){
        return alert('No voucher found for this student')
      }
      deleteSingleVoucher(voucher._id);
    
  });
  });


  // event binding
  document.querySelectorAll('.view-voucher-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const voucher = JSON.parse(this.dataset.voucher);
      printSingleVoucher(voucher);
    });
  });
}

function printSingleVoucher(voucher) {
  console.log('voucher to print',voucher)
  if(!voucher){
    return alert('No voucher found for this student')
  }
  currentVouchers = [voucher];
  document.getElementById('printBtn').click();
}

async function deleteSingleVoucher(voucherId) {
  // Implement delete logic here
  console.log('Delete voucher with ID:', voucherId);
  var result = confirm("Are you sure you want to delete this voucher?");
  if (result) {
    try {
      var res = await axios.delete(`http://localhost:3000/api/voucher/delete/${voucherId}`);
      console.log(res.data);
      if(res.data.success){
        alert('Voucher deleted successfully');
      }
      else{
        alert(`${res.data.message}`);
      }
      location.reload();
    } catch (error) {
      console.error('Error deleting voucher:', error);
      alert('Error deleting voucher');
    }
  }
}