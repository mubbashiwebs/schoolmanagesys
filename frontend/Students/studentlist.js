
    const tbody = document.getElementById("studentTableBody");
//   
  const user = JSON.parse(localStorage.getItem("userData")) || [];

  const isSuperAdmin = user[0]?.designation === "supremeadmin";
  const tableHead = document.getElementById("tableHead");
// const admissionTypeSelect = document.getElementById("admissionTypeSelect");
const classSelect = document.getElementById("classSelect");
const sectionSelect = document.getElementById("sectionSelect");
const computerCourseSelect = document.getElementById("computerCourseSelect");
const computerBatchSelect = document.getElementById("computerBatchSelect");
const englishCourseSelect = document.getElementById("englishCourseSelect");
const englishBatchSelect = document.getElementById("englishBatchSelect");
  const campusSelect = document.getElementById('campusSelect');
var campusId = user[0]?.campusId?._id || null;
var searchInput = document.getElementById("searchInput");
const typeCheckboxes = document.querySelectorAll(
      "#admissionTypeContainer input[type='checkbox']"
    );

    // Helper: Get selected admission types
    function getSelectedTypes() {
      return Array.from(typeCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);
    }
    

    // Event listeners
    typeCheckboxes.forEach((cb) => cb.addEventListener("change", ()=>{
      searchInput.style.display = "inline-block";
    classSelect.style.display = "none";
    sectionSelect.style.display = "none";
    computerCourseSelect.style.display = "none";
    computerBatchSelect.style.display = "none";
    englishCourseSelect.style.display = "none";
    englishBatchSelect.style.display = "none";
  campusSelect.style.display = 'inline-block';
      searchInput.style.display = "inline-block";
  var selectTypes = getSelectedTypes()
  // Show based on selected type
  if ( selectTypes.includes("school")) {
    
    classSelect.style.display = "inline-block";
    sectionSelect.style.display = "inline-block";
  } 
   if (selectTypes.includes("tuition")) {
    classSelect.style.display = "inline-block";
  } 
   if (selectTypes.includes("computer")) {
    computerCourseSelect.style.display = "inline-block";
    computerBatchSelect.style.display = "inline-block";
  } 
   if (selectTypes.includes("english")) {
    englishCourseSelect.style.display = "inline-block";
    englishBatchSelect.style.display = "inline-block";
  }
  
if(selectTypes.length == 0){
  renderTable('','')
}
else{
applyFilters()

}
    }));

    // renderTable()

    // ✅ Apply filters (minimal working version)
    // function applyFilters() {
    //   const selectedTypes = getSelectedTypes();
    //   const filtered = students; // You can add search/campus filter later
    //   renderTable(filtered, selectedTypes);
    // }

    // ✅ Render Table (fixed & minimal)
    function renderTable(data, selectedTypes) {
      tbody.innerHTML = "";

      // Table Header
      let headerHTML = `
        <tr>
          <th>#</th>

          <th>Master ID</th>
          <th>Student Name</th>
          <th>Father Name</th>
          <th>GR No</th>`;

      if (selectedTypes.includes("school")) {
        headerHTML += `<th>Class</th><th>Section</th>`;
      }
      if (selectedTypes.includes("computer")) {
        headerHTML += `<th>Computer Course</th><th>Computer Batch</th>`;
      }
      if (selectedTypes.includes("english")) {
        headerHTML += `<th>English Course</th><th>English Batch</th>`;
      }
      if (selectedTypes.includes("tuition")) {
        headerHTML += `<th>Tuition</th>`;
      }
        headerHTML += `<th>Status</th>`;
      tableHead.innerHTML = headerHTML;
      headerHTML += `<th>Actions</th></tr>`;
      tableHead.innerHTML = headerHTML;

      if (!data.length) {
        tbody.innerHTML =
          '<tr><td colspan="10" class="text-center">No students found</td></tr>';
        return;
      }

      data.forEach((st ,index) => {
        const gr = st.grNumbers || {};
        let rowHTML = `
          <td>${index+1 || "N/A"}</td>

          <td>${st.masterId || "N/A"}</td>
          <td>${st.name || "N/A"}</td>
          <td>${st.fatherName || "N/A"}</td>
          <td>${[
            gr.school ? `School: ${gr.school}` : "",
  gr.computer ? `Computer: ${gr.computer}` : "",
  gr.english ? `English: ${gr.english}` : "",
  gr.tuition ? `Tuition: ${gr.tuition}` : "",

          ]
            .filter(Boolean)
            .join(" / ")}</td>`;

        if (selectedTypes.includes("school")) {
          rowHTML += `<td>${st.class?.name || "N/A"}</td><td>${
            st.section?.name || "N/A"
          }</td>`;
        }
        if (selectedTypes.includes("computer")) {
          rowHTML += `<td>${st.computerCourse?.name || "N/A"}</td><td>${
            st.computerCourseBatch?.name || "N/A"
          }</td>`;
        }
        if (selectedTypes.includes("english")) {
          rowHTML += `<td>${st.englishCourse?.name || "N/A"}</td><td>${
            st.engCourseBatch?.name || "N/A"
          }</td>`;
        }
        if (selectedTypes.includes("tuition")) {
          rowHTML += `<td>${st.class?.name || "N/A"}</td>`;
        }

        rowHTML += `
          <td>${st.status || "N/A"}</td>
          <td>
          <button class="btn btn shadow-sm btn-sm" onclick='viewStudent(${JSON.stringify(st)})'>✏️</button> <button class="btn btn shadow-sm btn-sm" onclick="deleteStudent('${st._id}')">🗑️</button>
          </td>`;

        const row = document.createElement("tr");
        row.innerHTML = rowHTML;
        tbody.appendChild(row);
      });
    }





 if(user.length <= 0){
     window.location.href= 'Dashboard.html'
        
  }

var studentList = []

getStudents()
 async function getStudents(){
  if(isSuperAdmin){
       var res= await axios.get(`http://localhost:3000/api/student/getBySchool/${user[0]?.school._id}`)


  }
  else{
    var res= await axios.get(`http://localhost:3000/api/student/getByCampus/${user[0]?.school._id}/${user[0]?.campus._id}`)

  }
    console.log(res.data)
      studentList = res.data;
      // renderTable(studentList);

  }

  console
  // admissionTypeSelect.addEventListener("change", applyFilters);
async function loadEngCourses() {
      
      if (!campusId) return;

    try {
      const url =`http://localhost:3000/api/english-courses/getByCampus/${user[0].school._id}/${campusId}`;
      const res = await axios.get(url);
      engCourses = res.data.data;
      console.log(engCourses)
      englishCourseSelect.innerHTML = `<option value="">Select Course</option>`;
      engCourses.forEach(course => {
        const option = document.createElement("option");
        option.value = course._id;
        option.textContent = course.name;

        englishCourseSelect.appendChild(option);
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
        // tuitionclass.innerHTML = `<option value="">Select Class</option>`;

        allClasses.forEach(cls => {
          const option = document.createElement("option");
          option.value = cls._id;
          option.textContent = cls.name;
          option.setAttribute("data-id", cls._id); // store ID in data attribute

          classSelect.appendChild(option);
        });
          //    allClasses.forEach(cls => {
          // const option = document.createElement("option");
          // option.value = cls._id;
          // option.textContent = cls.name;
          // option.setAttribute("data-id", cls._id); // store ID in data attribute

          // tuitionclass.appendChild(option);
        // });
      } catch (err) {
        console.error("Error loading classes:", err);
      }
    }

    // Load Sections (independent of class)
    async function loadSections() {
      if (!campusId) return;
    
      try {
        const url =  `http://localhost:3000/api/section/getByCampus/${user[0].school._id}/${campusId}`;
        const res = await axios.get(url);
        allSections = res.data.data;
        sectionSelect.innerHTML = `<option value="">Select Section</option>`;
        allSections.forEach(sec => {
          const option = document.createElement("option");
          option.value = sec._id;
          option.textContent = sec.name;
          sectionSelect.appendChild(option);
        });
      } catch (err) {
        console.error("Error loading sections:", err);
      }
    }

    // Load Computer Courses
    async function loadCourses() {
      if (!campusId) return;
     
      try {
        const url = `http://localhost:3000/api/course/getbyCampus/${user[0].school._id}/${campusId}`;
        const res = await axios.get(url);
        allCourses = res.data.data;
        computerCourseSelect.innerHTML = `<option value="">Select Course</option>`;
        allCourses.forEach(course => {
          const option = document.createElement("option");
          option.value = course._id;
          option.textContent = course.name;
          option.setAttribute("data-id", course._id); // store ID in data attribute

          computerCourseSelect.appendChild(option);
        });
      } catch (err) {
        console.error("Error loading computer courses:", err);
      }
    }

    

// Function to handle computer course batch population
function updateComputerCourseBatches() {
  const selectedCourseId = computerCourseSelect.value;
  const selectedCourse = allCourses.find(c => c._id === selectedCourseId);

  if (selectedCourse) {
    const batches = allComputerBatches.filter(
      b => b.courseName.name === selectedCourse.name
    ) || [];

    computerBatchSelect.innerHTML = `<option value="">Select Batch</option>`;

    batches.forEach(batch => {
      const option = document.createElement("option");
      option.value = batch._id;
      option.textContent = batch.name;
      computerBatchSelect.appendChild(option);
    });
  } else {
    computerBatchSelect.innerHTML = `<option value="">Select Batch</option>`;
  }
}

// Function to handle English course batch population
function updateEnglishCourseBatches() {
  const selectedCourseId = englishCourseSelect.value;
  const selectedCourse = engCourses.find(c => c._id === selectedCourseId);

  if (selectedCourse) {
    const batches = allEnglishBatches.filter(
      b => b.courseName.name === selectedCourse.name
    ) || [];

    englishBatchSelect.innerHTML = `<option value="">Select Batch</option>`;

    batches.forEach(batch => {
      const option = document.createElement("option");
      option.value = batch._id;
      option.textContent = batch.name;
      englishBatchSelect.appendChild(option);
    });
  } else {
    englishBatchSelect.innerHTML = `<option value="">Select Batch</option>`;
  }
}

// Event listeners
computerCourseSelect.addEventListener('change', updateComputerCourseBatches);
englishCourseSelect.addEventListener('change', updateEnglishCourseBatches);

  

    if(isSuperAdmin){
      loadCampuses()
      var selectTypes = getSelectedTypes()
      if(selectTypes.length > 0){
        campusSelect.style.display = 'inline-block'
      }
      else{
        campusSelect.style.display = 'none'

      }
      // campusSelect.style.display = 'inline-block'
    }
    else{
      campusSelect.style.display = 'none'

    }
    function loadCampuses() {
      return axios.get(`http://localhost:3000/api/campus/getBySchool/${user[0].school._id}`)
        .then(response => {
          const campuses = response.data;
          console.log(campuses)
          campuses.forEach(campus => {
            const option = document.createElement('option');
            option.value = campus._id; // Use campus name as value
            option.textContent = campus.name;
            campusSelect.appendChild(option);
          });
        })
        .catch(error => {
          console.error('Error loading campuses:', error);
        });
    }

// Example view and delete functions
function viewStudent(data) {
  localStorage.setItem("viewStudentData", JSON.stringify(data));
  window.location.href = "student.html?view=true";
}

async function deleteStudent(id) {
 const result = await Swal.fire({
  title: 'Are you sure?',
  html: `
    This will permanently delete the student and all associated records:<br>
    <b>• Vouchers</b><br>
    <b>• Receipts</b><br>
    <b>• Related data</b><br><br>
    <span style="color:red;">This action cannot be undone!</span>
  `,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#d33',
  cancelButtonColor: '#3085d6',
  confirmButtonText: 'Yes, delete it!'
});

  if (!result.isConfirmed) return;
  await axios.delete(`http://localhost:3000/api/student/delete/${id}`);
  studentList = studentList.filter((st) => st._id !== id);
  var selectTypes = getSelectedTypes()

  renderTable(studentList,selectTypes);
}

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


function applyFilters() {
  const selectedTypes = getSelectedTypes();
  const search = searchInput.value.toLowerCase();
  const selectedCampus = campusSelect.value;

  const selectedClass = classSelect.value;
  const selectedSection = sectionSelect.value;
  const selectedComputerCourse = computerCourseSelect.value;
  const selectedComputerBatch = computerBatchSelect.value;
  const selectedEnglishCourse = englishCourseSelect.value;
  const selectedEnglishBatch = englishBatchSelect.value;

  const filtered = studentList.filter(student => {
    const gr = student.grNumbers || {};

    // 🔹 Match any GR number for selected admission types
    let matchesGr = false;
    selectedTypes.forEach(type => {
      if (type === "school" && String(gr.school)?.toLowerCase().includes(search)) matchesGr = true;
      if (type === "computer" && String(gr.computer)?.toLowerCase().includes(search)) matchesGr = true;
      if (type === "english" && String(gr.english)?.toLowerCase().includes(search)) matchesGr = true;
      if (type === "tuition" && String(gr.tuition)?.toLowerCase().includes(search)) matchesGr = true;
    });

    // 🔹 General search match
    const matchesSearch =
      !search ||
      student.masterId?.toLowerCase().includes(search) ||
      student.name?.toLowerCase().includes(search) ||
      student.fatherName?.toLowerCase().includes(search) ||
      student.class?.name?.toLowerCase().includes(search) ||
      student.section?.name?.toLowerCase().includes(search) ||
      matchesGr;

    const matchesCampus = !selectedCampus || student.campusId?._id === selectedCampus;

    // 🔹 Admission-type-specific dropdown filters
    let matchesClass = true;
    let matchesSection = true;
    let matchesComputerCourse = true;
    let matchesComputerBatch = true;
    let matchesEnglishCourse = true;
    let matchesEnglishBatch = true;

    if (selectedTypes.includes("school") || selectedTypes.includes("tuition")) {
      matchesClass = !selectedClass || student.class?._id === selectedClass;
    }
    if (selectedTypes.includes("school")) {
      matchesSection = !selectedSection || student.section?._id === selectedSection;
    }
    if (selectedTypes.includes("computer")) {
      matchesComputerCourse = !selectedComputerCourse || student.computerCourse?._id === selectedComputerCourse;
      matchesComputerBatch = !selectedComputerBatch || student.computerCourseBatch?._id === selectedComputerBatch;
    }
    if (selectedTypes.includes("english")) {
      matchesEnglishCourse = !selectedEnglishCourse || student.englishCourse?._id === selectedEnglishCourse;
      matchesEnglishBatch = !selectedEnglishBatch || student.engCourseBatch?._id === selectedEnglishBatch;
    }
     var matchesStatus = true;
     if (statusSelect.value) {
       matchesStatus = student.status === statusSelect.value;
     }

    return (
      matchesSearch &&
      matchesCampus &&
      matchesClass &&
      matchesSection &&
      matchesComputerCourse &&
      matchesComputerBatch &&
      matchesEnglishCourse &&
      matchesEnglishBatch &&
      matchesStatus
    );
  });
    console.log(filtered)


  renderTable(filtered, selectedTypes);
}


    // Event Listeners
    document.getElementById("statusSelect").addEventListener("change", applyFilters);
    searchInput.addEventListener('input', applyFilters);
    sectionSelect.addEventListener('change', applyFilters);
    classSelect.addEventListener('change', applyFilters); 
    computerCourseSelect.addEventListener('change', ()=>{
      updateComputerCourseBatches();
      applyFilters();
    });
    computerBatchSelect.addEventListener('change', applyFilters);
    englishCourseSelect.addEventListener('change', ()=>{
      updateEnglishCourseBatches();
      applyFilters();
    });
    englishBatchSelect.addEventListener('change', applyFilters);
  
    campusSelect.addEventListener('change', ()=>{
      campusId = campusSelect.value;
      console.log(campusId)
      loadClasses();
      loadSections();
      loadCourses();
      loadEngCourses();
      loadComputerBatches();
      loadEnglishBatches();
      applyFilters();
    });
    // roleSelect.addEventListener('change', applyFilters);
//  document.getElementById("exportBtn").addEventListener("click", () => {
//     const table = document.getElementById("myTable");
//     let csv = [];
//     for (let row of table.rows) {
//       let cells = Array.from(row.cells).map(cell => `"${cell.innerText}"`);
//       csv.push(cells.join(","));
//     }

//     const blob = new Blob([csv.join("\n")], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "table-data.csv";
//     a.click();
//   });

  // document.getElementById("exportBtn").addEventListener("click", () => {
  //   const table = document.getElementById("myTable");
  //   const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet 1" });
  //   XLSX.writeFile(workbook, "table-data.xlsx");
  // })

const hasType = (student, type) => {
   const seletedType = getSelectedTypes();
  return seletedType.includes(type);
}
  document.getElementById("exportBtn").addEventListener("click", () => {
const formattedData = studentList.map((s, index) => {
  let row = {
    "S.No": index + 1,
    "Name": s.name || "",
    "Father Name": s.fatherName || "",
    "Phone": s.phone || "",
    "Status": s.status || "",
    "Address": s.address || "",
    "Admission Types": (s.admissionTypes || []).join(", "),
    "Master ID": s.masterId || "",
    "Campus": s.campusId?.name || "",
    "Email": s.email || "",
    "Date of Birth": s.dob ? new Date(s.dob).toLocaleDateString() : "",
    "Date of Admission": s.admissionDate ? new Date(s.admissionDate).toLocaleDateString() : "",
   
  };

  /* ===================== 🏫 SCHOOL ===================== */
  if (hasType(s, "school")) {
    row["School GR No"] = s.grNumbers?.school || "";
    row["School Class"] = s.class?.name || s.class || "";
    row["School Section"] = s.section?.name || s.section || "";
    row["Admission Class"] = s.admissionClass?.name || s.admissionClass || "";
    row["Admission Section"] = s.admissionSection?.name || s.admissionSection || "";

    row["School Original Fee"] = s.feeDetails?.school?.originalFee || 0;
    row["School Discount"] = s.feeDetails?.school?.discount || 0;
    row["School Payable Fee"] = s.feeDetails?.school?.payableFee || 0;
  }

  /* ===================== 📘 TUITION ===================== */
  if (hasType(s, "tuition")) {
    row["Tuition GR No"] = s.grNumbers?.tuition || "";
    row["Coaching Class"] = s.coachingClass?.name || s.coachingClass || "";

    row["Tuition Original Fee"] = s.feeDetails?.tuition?.originalFee || 0;
    row["Tuition Discount"] = s.feeDetails?.tuition?.discount || 0;
    row["Tuition Payable Fee"] = s.feeDetails?.tuition?.payableFee || 0;
  }

  /* ===================== 💻 COMPUTER ===================== */
  if (hasType(s, "computer")) {
    row["Computer GR No"] = s.grNumbers?.computer || "";
    row["Computer Course"] = s.computerCourse?.name || s.computerCourse || "";
    row["Computer Batch"] = s.computerCourseBatch?.name || s.computerCourseBatch || "";

    row["Computer Original Fee"] = s.feeDetails?.computer?.originalFee || 0;
    row["Computer Discount"] = s.feeDetails?.computer?.discount || 0;
    row["Computer Payable Fee"] = s.feeDetails?.computer?.payableFee || 0;
  }

  /* ===================== 🇬🇧 ENGLISH ===================== */
  if (hasType(s, "english")) {
    row["English GR No"] = s.grNumbers?.english || "";
    row["English Course"] = s.englishCourse?.name || s.englishCourse || "";
    row["English Batch"] = s.engCourseBatch?.name || s.engCourseBatch || "";

    row["English Original Fee"] = s.feeDetails?.english?.originalFee || 0;
    row["English Discount"] = s.feeDetails?.english?.discount || 0;
    row["English Payable Fee"] = s.feeDetails?.english?.payableFee || 0;
  }

  return row;
});


const worksheet = XLSX.utils.json_to_sheet(formattedData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
XLSX.writeFile(workbook, "students-complete-record.xlsx");

});
