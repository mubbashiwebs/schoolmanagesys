 const statusRadios = document.querySelectorAll('input[name="status"]');
  const leaveReasonBox = document.getElementById('leaveReasonBox');
  const leaveReasonInput = document.getElementById('leaveReason');
    var schoolgrnoInput = document.getElementById('schoolgrno')
    var tuitiongrnoInput = document.getElementById('tuitiongrno')

  // Show/hide Leave Reason box
  statusRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      leaveReasonBox.style.display = document.getElementById('left').checked ? 'block' : 'none';
    });
  });
  const user = JSON.parse(localStorage.getItem("userData")) || [];
  const isSuperAdmin = user[0]?.designation === "supremeadmin";
  const fileInput = document.getElementById("studentImage");
  const imageBox = document.getElementById("studentImageBox");
  var campusId = user[0]?.campus?._id || null;
  var engCourseBatchSelect = document.getElementById('engCourseBatch')
  var computerCourseBatchSelect = document.getElementById('computerCourseBatch')
    //  const sidebar = document.getElementById("sidebar");
var editingStudentId 
 if(user.length <= 0){
     window.location.href= 'Dashboard.html'
        
  }

 
var tuitionclass = document.getElementById('tuitionClass')
    const form = document.getElementById("admissionForm");
  var isEdit = false

      var imageUrl
      const checkboxes = document.querySelectorAll('input[name="admissionType"]');
      console.log(checkboxes)
      const classSectionFields = document.getElementById('classSectionFields');
      const computerCourseField = document.getElementById('computerCourseField');
      const englishCourseField = document.getElementById('engCourseField');
      const tuitionFields = document.getElementById('tuitionFields');
      
      var admissionClassSelect = document.getElementById("admissionClass");
      var admissionSectionSelect = document.getElementById("admissionSection");
      const computerCourse = document.getElementById('computerCourse')
      function updateFormDisplay() {
        const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
        console.log(selected)
        classSectionFields.style.display = selected.includes('school') ? 'flex' : 'none';
        computerCourseField.style.display = selected.includes('computer') ? 'block' : 'none';
        engCourseField.style.display = selected.includes('english') ? 'block' : 'none'
        tuitionFields.style.display = selected.includes('tuition') ? 'flex' : 'none';
        updateFee()
      }

      checkboxes.forEach(cb => cb.addEventListener('change', updateFormDisplay));

      document.getElementById('admissionForm').addEventListener('submit', async function (e) {
        e.preventDefault();
         
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
           if(imageUrl){
          data.imageUrl = imageUrl
        }
        else{
          data.imageUrl = ''
        }
        console.log(data)
        if(!data.name || !data.fatherName || !data.phone ){
           showToast("error", 'Fill the required fields : Name , Father Name , Contact no ')
          // console.log('not')
          return
        }

        data.admissionTypes = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
        data.class = currentClass.options[currentClass.selectedIndex]?.value || "";
data.section= currentSection.options[currentSection.selectedIndex]?.value || "";
console.log(admissionClassSelect)
data.admissionClass = admissionClassSelect.options[admissionClassSelect.selectedIndex]?.value || data.class ;
console.log(data.admissionClass)
data.admissionSection = admissionSectionSelect.options[admissionSectionSelect.selectedIndex]?.value || data.section ;
data.computerCourse= computerCourse.options[computerCourse.selectedIndex]?.value || "";
data.englishCourse = engcourseSelect.options[engcourseSelect.selectedIndex].value || ''
data.coachingClass = tuitionclass.options[tuitionclass.selectedIndex].value || ''
        if (!data.admissionTypes.includes('school') && studentData?.admissionTypes.includes('school') ) {
           data.class = studentData.class
           data.section = studentData.section
           data.admissionClass = studentData.admissionClass
           data.admissionSection = studentData.admissionSection
        }
        
        if (!data.admissionTypes.includes('school')) {
            data.class = null
           data.section = null
           data.admissionClass = null
           data.admissionSection = null
        }
    if(!data.admissionTypes.includes('tuition')){
      data.coachingClass = null
    }
        if (!data.admissionTypes.includes('computer')) {
           data.computerCourse = null
           data.computerCourseBatch = null
        }

           if (!data.admissionTypes.includes('english')) {
           data.englishCourse = null
           data.engCourseBatch = null
        }
         // Add schoolId to request body
    data.schoolId = schoolId;
    data.campusId = isSuperAdmin ? document.getElementById('campusDropdown').value : campusId

        const selectedStatus = document.querySelector('input[name="status"]:checked').value;
    const leaveReason = leaveReasonInput.value;

        if(selectedStatus == 'Left'){ 
          data.status = selectedStatus
          data.leftReason = leaveReason

        }
        else{
          data.status = selectedStatus
           data.leftReason = ''

        }
        if(data.admissionTypes.length <=0){
          toast('error','Amission Type is required')
        }

                
      // ➕ Add Fee Details
  const feeTypes = ["school", "tuition", "computer", "english"];
  const feeDetails = {};

  feeTypes.forEach((type) => {
    const original = document.getElementById(`${type}Original`);
    const discount = document.getElementById(`${type}Discount`);
    const payable = document.getElementById(`${type}Payable`);

    if (original && discount && payable) {
      feeDetails[type] = {
        originalFee: Number(original.innerText),
        discount: Number(discount.value) || 0,
        payableFee: Number(payable.innerText),
      };
    }
  });

  const totalFee = document.getElementById("totalFee")?.value || 0;
      const submitBtn = document.querySelector('button[type="submit"]');
        console.log(submitBtn)

  data.feeDetails = feeDetails;
  data.totalFee = Number(totalFee);
    const createdBy = user[0]._id

  data.createdBy = createdBy

  data.schoolGrno = schoolgrnoInput.value
  data.tuitionGrno = tuitiongrnoInput.value
try{
   if (isEdit) {
    showLoader()
          submitBtn.textContent = 'updating...'

        // UPDATE STUDENT
        const res = await axios.put(
          `http://localhost:3000/api/student/update/${editingStudentId}`,
          data
        );
        // alert(res.data.message || "Student updated successfully");
          showToast("success", res.data.message || "Student updated successfully")
        
        editingStudentId = null;
        submitBtn.textContent = 'submit'
        hideLoader()
      } else {
        // ADD STUDENT
        submitBtn.textContent = 'submiting...'

        const res = await axios.post(
          "http://localhost:3000/api/student/add",
          data
        );
        // alert(res.data.message || "Student added successfully")
        console.log(res.data);
          showToast("success", res.data.message )
        
          submitBtn.textContent = 'submit'
        
      }
      form.reset();
      feeInfo.innerHTML = ''
      imgPreview.src = ''
    
      fileInput.value = ''
      hideLoader()
      // feeInput.value = "";
    } catch (err) {
      console.log(err)
      console.error("Failed to add student:", err);
      // alert("Failed to add student. Please check the form and try again.");
          showToast("error", err.response?.data?.message || "Failed to add/update student. Please check the form and try again.")
          hideLoader()

    }
        console.log('Submitted Data:', data);
        // TODO: Send to backend using fetch or axios
      });
    
        const queryParams = new URLSearchParams(window.location.search);
    const isViewMode = queryParams.get("view") === "true";
  var studentData 
      var admClassBox = document.getElementById('admClassBox')
      var admSecBox = document.getElementById('admSecBox')

async function loadData() {
  studentData = JSON.parse(localStorage.getItem("viewStudentData"));
  console.log(studentData);

  editingStudentId = studentData?._id;
  console.log(editingStudentId);
  if(!isViewMode){
    admClassBox.style.display ='none'
    admSecBox.style.display = 'none'
  }
  else{
       admClassBox.style.display ='block'
    admSecBox.style.display = 'block'
  }
  if (!isViewMode || !studentData) return;
 
   if(studentData.status == 'left'){
    leaveReasonBox.style.display = 'block'
   }
  // Set image if exists
  if (studentData.imageUrl) {
    // imageBox.src = studentData.imageUrl;
    imgPreview.src = studentData.imageUrl;
  }

  // Set schoolId and load dependent dropdowns
  if (studentData.schoolId) {
    console.log(studentData.campusId)
  
    if(isSuperAdmin){
    schoolId = studentData.schoolId._id;
      console.log(campusDropdown)

      console.log(campusDropdown.value)
    campusId = studentData.campusId._id;
    console.log(campusDropdown.value)
    

    }
    schoolId = studentData.schoolId._id;
    campusId = studentData.campusId._id;
    console.log(campusId)

    await Promise.all([
      loadClasses(),
      loadSections(),
      loadCourses(),
      loadEngCourses(),
      loadComputerBatches(),
      loadEnglishBatches(),
      loadCoachingClasses()
      
    ]);
  }


  // Fill basic fields (excluding special ones)
  for (let key in studentData) {
    if (["imageUrl", "schoolId", "admissionTypes"].includes(key)) continue;

    const el = form.elements[key];
    if (!el) continue;

    if (key === "dob" || key === "admissionDate") {
      el.value = studentData[key]?.slice(0, 10);
    } else if (el.type === "select-one") {
      el.value = studentData[key] || "";
    } else {
      el.value = studentData[key];
    }
  }

  // ✅ Set dropdown selections from loaded options
var schoolId = user[0].school._id;
  if (studentData.class) {
    console.log(allClasses)
    const selected = allClasses.find(c => c._id == studentData.class._id);
    console.log(studentData.class, selected)
    if (selected) currentClass.value = selected._id;
    admissionClassSelect.value = studentData.admissionClass
    // console.log(studentData.admissionClass.)
  }
  if(isSuperAdmin){
     if (studentData.campusId) {
    campusDropdown.value = studentData.campusId._id;
  }
  }
 

  if (studentData.section) {
    currentSection.value = studentData.section._id;
    admissionSectionSelect.value = studentData.admissionSection
  }

  
  if (studentData.coachingClass) {
    console.log(studentData.coachingClass)
    tuitionclass.value = studentData.coachingClass;
  }

  if (studentData.computerCourse) {
    const selected = allCourses.find(c => c._id === studentData.computerCourse._id);
    console.log(selected)
    if (selected) courseSelect.value = selected._id;
  }

  if (studentData.englishCourse) {
    const selected = engCourses.find(c => c._id === studentData.englishCourse._id);
    if (selected) engcourseSelect.value = selected._id;
  }

 await updateComputerCourseBatches()
    await  updateEnglishCourseBatches()
 
  if (studentData.engCourseBatch) {
    console.log(studentData.engCourseBatch)
    console.log(engCourseBatchSelect)
    engCourseBatchSelect.value = studentData.engCourseBatch._id;
    console.log(engCourseBatchSelect.value)
  }
    if (studentData.computerCourseBatch) {
    computerCourseBatchSelect.value = studentData.computerCourseBatch._id;
  }
  // Check admissionTypes checkboxes
  if (Array.isArray(studentData.admissionTypes)) {
    document.querySelectorAll('input[name="admissionType"]').forEach(cb => {
      console.log(cb.value)
cb.checked = studentData.admissionTypes
  .map(a => a.toLowerCase())
  .includes(cb.value.toLowerCase());
    });
  }

  // Disable fee discount input fields
  setTimeout(() => {
    updateFormDisplay()
    const feeTypes = ["school", "tuition", "computer", "english"];
    feeTypes.forEach(type => {
      const discount = document.getElementById(`${type}Discount`);
      if (discount) discount.disabled = true;
    });
  }, 150);

  // Disable entire form initially
  imageUrl = studentData.imageUrl || "";
  document.getElementById('studentImage').disabled = true;
  // document.getElementById('uploadImage').disabled = true;
  Array.from(form.elements).forEach(el => el.disabled = true);
  const submitBtn = document.querySelector('button[type="submit"]');
  submitBtn.outerHTML = `<button type="button" id="editBtn" class="btn btn-warning mt-3">Edit</button>`;

  // Enable form on edit
  document.getElementById("editBtn").addEventListener("click", () => {
    Array.from(form.elements).forEach(el => el.disabled = false);
    document.getElementById("editBtn").style.display = "none";
    isEdit = true;
    document.getElementById('studentImage').disabled = false;
    // document.getElementById('uploadImage').disabled = false;

    const submitBtn = document.createElement("button");
    submitBtn.className = "btn btn-primary mt-3";
    submitBtn.type = "submit";
    submitBtn.id = 'submitbtn'
    submitBtn.textContent = "Update";
    form.appendChild(submitBtn);
  });
}


  


  var schoolId = user[0].school._id;
  var feeInfo = document.getElementById('Fee-info')
  // Form elements
  const classSelect = document.getElementById("admissionClass");
  const currentClass = document.getElementById('currentClass')
  const currentSection = document.getElementById('currentSection')
  const sectionSelect = document.getElementById("admissionSection");
  const courseSelect = document.getElementById("computerCourse");
  const engCourseField = document.getElementById("engCourseField");
  const engcourseSelect = document.getElementById("englishCourse");
  const feeInput = document.getElementById("admissionFee");
  // const form = document.getElementById("studentForm");

  let allClasses = [];
  let allCoachingClasses = [];
  let allSections = [];
  let allCourses = [];
  let engCourses = [];
   let schoolList = [];
var schoolDropdown
var campusDropdownField = document.getElementById('campusDropdownField')
  // 🔽 Inject dropdown if superadmin
 
    // 🟢 Fetch and populate schools dropdown
    let campusList = [];

  // 🔽 Inject dropdown if superadmin
  
    // 🟢 Fetch and populate schools dropdown
    async function loadCampuses() {
      if (isSuperAdmin) {
    const campusDropdown = document.createElement("select");
    campusDropdown.className = "form-select mb-3";
    campusDropdown.id = "campusDropdown";
    campusDropdown.name = "campusId";
    campusDropdown.required = false;
    campusDropdown.addEventListener('change', async(e)=>{
      campusId = e.target.value
      loadClasses()
      loadCourses()
      loadEngCourses()
      loadSections()
      loadComputerBatches()
      loadEnglishBatches()
      loadCoachingClasses()
      // loadEducationLevel()
      // loadData()

    })
    const label = document.createElement("label");
    label.textContent = "🏫 Select Campus";
    label.setAttribute("for", "campusDropdown");
    label.className = "form-label";

    // const form = document.getElementById("classForm");
    // form.insertBefore(label, form.children[2]); // Insert before fee input
    // form.insertBefore(campusDropdown, form.children[3]);
    campusDropdownField.appendChild(label)
    campusDropdownField.appendChild(campusDropdown)
  
      try {        const res = await axios.get(`http://localhost:3000/api/campus/getBySchool/${user[0].school._id}`);

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
    
  

  // Load data on page load
  window.addEventListener("DOMContentLoaded", async () => {

    if(!isSuperAdmin){
 await Promise.all([
      
      loadClasses(),
      loadSections(),
      loadCourses(),
      loadEngCourses(),
      loadComputerBatches(),
      loadEnglishBatches(),
      loadCoachingClasses(),
      // loadEducationLevel()

    ]);
    
    }
    else{
    loadCampuses()

    }
   
    loadData()

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
        currentClass.innerHTML = `<option value="">Select Class</option>`;
       
        // tuitionclass.innerHTML = `<option value="">Select Class</option>`;
allClasses.forEach(cls => {
  const option1 = document.createElement("option");
  option1.value = cls._id;
  option1.textContent = cls.name;
  option1.setAttribute("data-id", cls._id);
  classSelect.appendChild(option1);

  const option2 = document.createElement("option");
  option2.value = cls._id;
  option2.textContent = cls.name;
  option2.setAttribute("data-id", cls._id);
  currentClass.appendChild(option2);
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
        tuitionclass.innerHTML = `<option value="">Select Class</option>`;
        // tuitionclass.innerHTML = `<option value="">Select Class</option>`;

        allCoachingClasses.forEach(cls => {
          const option = document.createElement("option");
          option.value = cls._id;
          option.textContent = cls.name;
          option.setAttribute("data-id", cls._id); // store ID in data attribute

          tuitionclass.appendChild(option);
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
               currentSection.innerHTML = `<option value="">Select Section</option>`;
        allSections.forEach(sec => {
          const option = document.createElement("option");
          option.value = sec._id;
          option.textContent = sec.name;
          sectionSelect.appendChild(option);

           const option2 = document.createElement("option");
          option2.value = sec._id;
          option2.textContent = sec.name;
          currentSection.appendChild(option2);
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

// Event listeners
courseSelect.addEventListener('change', updateComputerCourseBatches);
engcourseSelect.addEventListener('change', updateEnglishCourseBatches);
 function updateFee() {

  if (!courseSelect || courseSelect.selectedIndex === -1 || !classSelect || classSelect.selectedIndex === -1 ) {
    console.warn("Class or course not selected properly.");
    return;
  }

  const selectedCourseOption = courseSelect.options[courseSelect.selectedIndex];
  const selectedCourseId = selectedCourseOption?.value;
  const selectedCourse = allCourses.find(course => course._id === selectedCourseId);

  const selectedClassOption = currentClass.options[currentClass.selectedIndex];
  const selectedClassId = selectedClassOption?.value;
  const selectedClass = allClasses.find(cls => cls._id === selectedClassId);

  const selectedCoachingClassOption = tuitionclass.options[tuitionclass.selectedIndex];
  const selectedCoachingClassId = selectedCoachingClassOption?.value;
  const selectedCoachingClass = allCoachingClasses.find(cls => cls._id === selectedCoachingClassId);

  const selectedEngCourseOption = engcourseSelect.options[engcourseSelect.selectedIndex];
  const selectedEngCourseId = selectedEngCourseOption?.value;
  const selectedEngCourse = engCourses.find(course => course._id === selectedEngCourseId);
  // ... rest of your code



  const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
  feeInfo.innerHTML = ''; // Clear old content

  let totalFee = 0;

  const createFeeSection = (label, feeAmount, discount, key) => {
    console.log(discount.discount)
    const sectionId = `${key}FeeSection`;
    const discountId = `${key}Discount`;
    const payableId = `${key}Payable`;

    feeInfo.innerHTML += `
      <div class="row my-2" id="${sectionId}">
        <div class="col d-flex">
          <label class="fw-bold me-2">${label} Fee:</label>
          <p class="mb-0" id="${key}Original">${feeAmount}</p>
        </div>
        <div class="col-4">
          <label class="fw-bold">Discount:</label>
          <input type="number" min="0" value="${discount.discount}"   id="${discountId}" />
        </div>
        <div class="col d-flex">
          <label class="fw-bold me-2">Payable:</label>
          <p class="mb-0" id="${payableId}">${feeAmount-discount.discount}</p>
        </div>
      </div>
    `;

    // Attach event listener to update payable fee on discount input
    setTimeout(() => {
      const discountInput = document.getElementById(discountId);
      const payableField = document.getElementById(payableId);
      discountInput.addEventListener('input', () => {
        const discount = parseFloat(discountInput.value) || 0;
        const payable = Math.max(0, feeAmount - discount);
        payableField.innerText = payable;
        calculateTotalFee(); // update total on any discount change
      });
    }, 100);
  };

  if (selected.includes('school') && selectedClass) {
    createFeeSection('School', Number(selectedClass.fee), { discount: studentData?.feeDetails?.school?.discount || 0 }, 'school');
    totalFee += Number(selectedClass.fee);
  }

  if (selected.includes('tuition') && selectedCoachingClass) {
    createFeeSection('Tuition', Number(selectedCoachingClass.fee), { discount: studentData?.feeDetails?.tuition?.discount || 0 }, 'tuition');
    totalFee += Number(selectedCoachingClass.fee);
  }

  if (selected.includes('computer') && selectedCourse) {
        var batches = allComputerBatches.filter(b => b.courseName.name === selectedCourse.name) || []
    var batch = batches.find(b => b._id === computerCourseBatchSelect.value) || {}
    createFeeSection('Computer', Number(batch.fee), { discount: studentData?.feeDetails?.computer?.discount || 0 }, 'computer');
    totalFee += Number(batch.fee);
  }

  if (selected.includes('english') && selectedEngCourse) {
    console.log(selectedEngCourse.name)
        var batches = allEnglishBatches.filter(b => b.courseName.name === selectedEngCourse.name) || []
        console.log(allEnglishBatches)
    var batch = batches.find(b => b._id === engCourseBatchSelect.value) || {}
    console.log(batch)
    createFeeSection('English', Number(batch.fee),  { discount: studentData?.feeDetails?.english?.discount || 0 }, 'english');
    totalFee += Number(batch.fee);
  }

  setTimeout(() => calculateTotalFee(), 100); // calculate total at the end
}

function calculateTotalFee() {
  const feeTypes = ['school', 'tuition', 'computer', 'english'];
  let total = 0;
  feeTypes.forEach(key => {
    const payable = document.getElementById(`${key}Payable`);
    if (payable) {
      total += parseFloat(payable.innerText) || 0;
    }
  });

  // Show total somewhere, or set to a hidden input
  const totalFeeInput = document.getElementById('totalFee');
  console.log(totalFeeInput)
  if (totalFeeInput) totalFeeInput.value = total;
}


  // Show fee based on selected class

  currentClass.addEventListener("change", (e) => {
    console.log(123)
 updateFee()
console.log(e.target.value)
var selectedClass = allClasses.find(cls=> cls._id == e.target.value)
 getGrno(selectedClass.name , 'school' , schoolgrnoInput)

  });

  tuitionclass.addEventListener("change", () => {
 updateFee()
 getGrno(tuitionclass.options[tuitionclass.selectedIndex].text , 'tuition' , tuitiongrnoInput)
  });
  // Show fee based on selected course (optional override)
  courseSelect.addEventListener("change", () => {

 updateFee()
    
  });

    engcourseSelect.addEventListener("change", () => {

 updateFee()
    
  });
  engCourseBatchSelect.addEventListener("change", () => {

 updateFee()
  });
  computerCourseBatchSelect.addEventListener("change", () => {
  updateFee()
    });
// const studentImage = document.getElementById('studentImage');
    const imgPreview = document.getElementById('imgPreview');
    const studentImageBox = document.querySelector('.square-box');

    // imageBox.addEventListener('click', () => studentImage.click());

    studentImage.addEventListener('change', async function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) { imgPreview.src = e.target.result; }
        reader.readAsDataURL(file);
      }
  
  // document.getElementById('uploadImage').addEventListener('click', async () => {

  if (fileInput.files.length > 0) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "student_unsigned");  // your unsigned upload preset

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


//  getStudents()
//   var studentList = []
//  async function getStudents(){
//   if(schoolId == null){
//     console.log('empty')
//     return
//   }
  
//     var res= await axios.get(`http://localhost:3000/api/student/school/${schoolId}`)

  
//     console.log(res.data)
//       studentList = res.data;
//         const grnoVal = document.getElementById('grno')
//   grnoVal.innerHTML = studentList.length  + 1


//  }
//  console.log(studentList)

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
 function showLoader() {
    document.getElementById("loader").style.display = "flex";
  }

  // Hide loader
  function hideLoader() {
    document.getElementById("loader").style.display = "none";
  }

  // Auto show on page load
  window.addEventListener("load", () => {
    // Optional delay to simulate loading
    setTimeout(hideLoader, 300); // hide after 0.5s
  });

     const nextBtns = document.querySelectorAll('.btn-next');
    const tabButtons = document.querySelectorAll('.nav-link');
    nextBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const nextTab = tabButtons[index + 1];
        if (nextTab) { new bootstrap.Tab(nextTab).show(); }
      });
    });
// getGrno()
   async function getGrno(selectedClass, type , input){
    console.log(selectedClass , type)
      try {
        var res = await axios.get(`http://localhost:3000/api/student/getGrno/${user[0].school._id}/${campusId}/${type}/${selectedClass}`)
        console.log(res.data)
        input.value = res.data.Grno
      } catch (error) {
        console.log(error.response.data.message || error.message)
      }
    }