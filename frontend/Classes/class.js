

  const classNameInput = document.getElementById("className");
  const classFeeInput = document.getElementById("classFee");
  const tuitionFeeInput = document.getElementById("tuitionFee");
  const admissionFeeInput = document.getElementById('admissionFee')
  const addButton = document.getElementById("formSubmitBtn");
  const tableBody = document.querySelector("#tb");
  const classForm = document.getElementById('classForm')
  
  // const teacherIdInput = document.getElementById("teacherId");
  //     const teacherName = document.getElementById("teachername");
  const user = JSON.parse(localStorage.getItem("userData")) || [];

  const modal = new bootstrap.Modal(document.getElementById("addClassModal"));

const toast = new bootstrap.Toast(document.getElementById("toastMessage"));
const toastBody = document.getElementById("toastBody");
const toastElement = document.getElementById("toastMessage");
const searchcampusInput = document.getElementById('searchClass')
function showToast(message, isSuccess = true) {
 
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: isSuccess ? 'success' : 'error',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
}

let isEditing = false;
let editingId = null;

  console.log(user)
  const isSuperAdmin = user[0]?.designation === "supremeadmin";
  console.log(isSuperAdmin)

if(user.length > 0 || !user == null){


// renderSidebar(user);
  let originalClassList = []
  let classList = [];
  

  var campusId = user[0].campus._id

  // 🔁 Load classes on page load
  window.addEventListener("DOMContentLoaded", ()=>{
    loadClasses()
    isSuperAdmin ? '': loadGeneralReg()
  });

 async function loadClasses() {
  try {
    let res;

    if (isSuperAdmin) {
      res = await api.get("/class/school");
    } else {
      res = await api.get(`/class/getByCampus/${user[0].campus._id}`);
    }

    classList = res.data.data;
    originalClassList = [...classList];
  } catch (err) {
    console.error("Error loading classes:", err);
  } finally {
    renderTable();
  }
}

// Global variables
let currentPage = 1;
const recordsPerPage = 5;

function renderTable() {
  tableBody.innerHTML = ""; // Clear previous rows

  document.getElementById('adminth').style.display = isSuperAdmin ? 'block' : 'none';
  console.log(classList)
  if (classList.length === 0 || !classList) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No classes found</td></tr>`;
    renderPagination(); // still render empty pagination
    return;
  }

  // Calculate pagination
  const totalPages = Math.ceil(classList.length / recordsPerPage);
  console.log(totalPages)
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  console.log(endIndex)
  console.log(currentPage)
  console.log(startIndex)
  const paginatedData = classList.slice(startIndex, endIndex);

  // Render only the current page’s data
  paginatedData.forEach((cls, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${startIndex + i + 1}</td>
      <td>${cls.name}</td>
      <td>${cls.fee}</td>
      <td>${cls.admissionFee}</td>
      <td>${cls.generalRegister?.registerName || 'N/A'}</td>
      ${isSuperAdmin ? `<td>${cls.campusId?.name || 'N/A'}</td>` : ''}
      <td>
        <button class="btn btn-sm btn-info me-1" onclick="editClass('${cls._id}')">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="deleteClass('${cls._id}')">🗑️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  renderPagination(totalPages);
}


  async function deleteClass(id) {
      const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This action cannot be undone!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  });
  if (!result.isConfirmed) return;

    try {
     var res = await api.delete(`/class/delete/${id}`);
      classList = classList.filter(cls => cls._id !== id);
originalClassList = originalClassList.filter(cls => cls._id !== id);
    showToast(res.data.message || "Deleted successfully");

      renderTable();
    } catch (err) {
      console.error("Failed to delete class:", err);
    showToast("Failed to delete campus", false);

    }
  }
    const useFeeCheckbox = document.getElementById("useFeeCheckbox"); 


  classFeeInput.addEventListener("input", () => {

    if (useFeeCheckbox && useFeeCheckbox.checked) {

      admissionFeeInput.value = classFeeInput.value;
    }
  });

  useFeeCheckbox.addEventListener("change", () => {
    if (useFeeCheckbox.checked) {
      admissionFeeInput.value = classFeeInput.value;  
      admissionFeeInput.disabled = true;
    } else {
      admissionFeeInput.value = "";
      admissionFeeInput.disabled = false;
    }

  });
 
  // ➕ Add Class
  addButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = classNameInput.value.trim();
    const fee = classFeeInput.value.trim();
    // const tuitionFee = tuitionFeeInput.value.trim();
    const admissionFee = admissionFeeInput.value.trim();


    if (!name || !fee  ) {
      showToast("Please fill all fields",false);
      return;
    }

    let campusId;

        if (isSuperAdmin) {
      const dropdown = document.getElementById("campusDropdown");
      campusId = dropdown.value;
      if (!campusId) {
        showToast("Please select a campus", false);
        return;
      }
    } else {
      campusId = user[0].campus._id;
    }
      var generalRegister =  genRegSelect.value
     if (!generalRegister){
        return showToast('Please Select General Register', false)
      }
    try {
       if (isEditing) {
      const res = await api.put(`/class/update/${editingId}`, {
        name, fee,admissionFee,campusId  ,generalRegister
      });

      const { data, message } = res.data;
      const index = classList.findIndex(s => s._id === editingId);
      classList[index] = data;
      originalClassList[index] = data;

      showToast(message || "campus updated successfully");

    } else {
      const res = await api.post("/class/add", {
        name, fee,admissionFee,campusId  ,  generalRegister
      });

      const { data, message } = res.data;
      showToast(message, data && data._id);
      console.log(data,message)
      // Only push if campus added
      if (data && data._id) {
        classList.push(data);
        originalClassList.push(data)
      }
      console.log(classList)
      console.log(originalClassList)

      // Don't close modal if already exists
      if (message === "Class Already Exists") return;
    }

    // Reset and close modal
    isEditing = false;
    editingId = null;
    classForm.reset();
    addButton.textContent = "Add Class";
    document.getElementById("addClassModalLabel").textContent = "Add New Class";
    modal.hide();


      if (isSuperAdmin) document.getElementById("campusDropdown").value = "";

      renderTable();
    } catch (err) {
      console.error("Error adding class:", err.message);
      showToast(err.response?.data?.message || "Failed to add class", false);
    }
  });

  // 🗑 Expose delete globally
  window.deleteClass = deleteClass;


  window.editClass = function (id) {
  const classData = classList.find(s => s._id === id);
  if (!classData) {
    showToast("Class not found", false);
    return;
  }

  isEditing = true;
  editingId = id;
  classNameInput.value = classData.name;
  classFeeInput.value = classData.fee;

  admissionFeeInput.value = classData.admissionFee
  if(useFeeCheckbox.checked){
    admissionFeeInput.disabled = true
    admissionFeeInput.value = classFeeInput.value;
  }else{
    admissionFeeInput.disabled = false
  }
 

  if(isSuperAdmin) document.getElementById('campusDropdown').value = classData.campusId._id
  campusId = classData.campusId._id
 console.log(campusId)
  loadGeneralReg().then(() => {
    console.log(classData.generalRegister)
    genRegSelect.value = classData.generalRegister._id;
  }
  );
  document.getElementById("addClassModalLabel").innerText = "Update Class";
  formSubmitBtn.innerText = "Update Class";
  modal.show();
}
let selectedcampusId = ''; // Store selected campus
let filteredClasses = originalClassList;

// 👇 Search filter
searchcampusInput.addEventListener('input', () => {
  const searchTerm = searchcampusInput.value.toLowerCase().trim();

  // Apply both filters: campus + search text
  filteredClasses = originalClassList.filter(cls =>
    (selectedcampusId === '' || cls.campusId._id === selectedcampusId) &&
    cls.name.toLowerCase().includes(searchTerm)
  );

  classList = filteredClasses;
  currentPage = 1
  console.log(classList)
  renderTable();
});

// 👇 campus dropdown filter
if (isSuperAdmin) {
  console.log(campusSelectBox1)
  campusSelectBox1.addEventListener('change', (e) => {
    selectedcampusId = e.target.value;
console.log(selectedcampusId)
    const searchTerm = searchcampusInput.value.toLowerCase().trim();

    // Apply both filters: campus + search text
    filteredClasses = originalClassList.filter(cls =>
      (selectedcampusId === '' || cls.campusId._id === selectedcampusId) &&
      cls.name.toLowerCase().includes(searchTerm)
    );

    classList = filteredClasses;
    currentPage = 1
    renderTable();
    
  });
}
campusSelectBox2.addEventListener('change',(e)=>{
    campusId = e.target.value ; 
  loadGeneralReg()
})

document.getElementById("addClassModal").addEventListener("hidden.bs.modal", closeModal);


function closeModal() {
  classForm.reset();
  isEditing = false;
  editingId = null;
  formSubmitBtn.textContent = "✅ Add Class";
  document.getElementById("addClassModalLabel").textContent = "🆕 Add New Class";


}

function renderPagination(totalPages = 1) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  // Previous button
  const prevDisabled = currentPage === 1 ? 'disabled' : '';
  pagination.innerHTML += `
    <li class="page-item ${prevDisabled}">
      <button class="page-link" onclick="changePage(${currentPage - 1})">Previous</button>
    </li>
  `;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const active = i === currentPage ? 'active' : '';
    pagination.innerHTML += `
      <li class="page-item ${active}">
        <button class="page-link" onclick="changePage(${i})">${i}</button>
      </li>
    `;
  }

  // Next button
  const nextDisabled = currentPage === totalPages ? 'disabled' : '';
  pagination.innerHTML += `
    <li class="page-item ${nextDisabled}">
      <button class="page-link" onclick="changePage(${currentPage + 1})">Next</button>
    </li>
  `;
}

function changePage(page) {
  
  const totalPages = Math.ceil(classList.length / recordsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable();
}


    var generalRegisterList = []
    var genRegSelect = document.getElementById('generalRegisterSelect')
       // Load General Register
    async function loadGeneralReg() {
      if (!campusId) return;
     
      try {

        const res = await api.get(`/general-register/getByCampus?campusId=${campusId}`);
        console.log(res)
        generalRegisterList = res.data.data;
        genRegSelect.innerHTML = `<option value="">Select General Register</option>`;
        generalRegisterList.forEach(course => {
          const option = document.createElement("option");
          option.value = course._id;
          option.textContent = course.registerName;
          option.setAttribute("data-id", course._id); // store ID in data attribute

          genRegSelect.appendChild(option);
        });
      } catch (err) {
        console.error("Error loading general registers:", err.response?.data?.message || err.message);
      }
    }

}

else{
             window.location.href='../user/login.html'

}



