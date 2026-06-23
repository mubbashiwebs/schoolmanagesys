
  const classNameInput = document.getElementById("className");
  const classFeeInput = document.getElementById("classFee");
  const tuitionFeeInput = document.getElementById("tuitionFee");
  const admissionFeeInput = document.getElementById('admissionFee')
  const addButton = document.getElementById("formSubmitBtn");
  const tableBody = document.querySelector("#classTable tbody");
  const classForm = document.getElementById('classForm')
  const adminTh = document.getElementById('adminth')
 
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

const permissions = [{page: 'addclass',  permissions: ['read']},
{page: 'addsection', permissions: ['read']}
]


  let originalClassList = []
  let classList = [];

  window.addEventListener("DOMContentLoaded", loadClasses);

  async function loadClasses() {
    try {
      let res;
      if (isSuperAdmin) {
        res = await api.get(`/coachingClass/school`);
      } else {
        res = await api.get(`/coachingClass/getByCampus/${user[0].campus._id}`);
      }
      classList = res?.data?.data || [];
      console.log(classList);
      originalClassList = [...res.data.data] 
      renderTable();
    } catch (err) {
      console.error("Error loading classes:", err);
    }
  }

  function renderTable() {
    tableBody.innerHTML = "";
      adminTh.style.display =  isSuperAdmin ?'block' : 'none'

    console.log(classList)
    if (classList.length > 0) {
    console.log(classList)

      classList.forEach((cls, i) => {
        console.log( cls)
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${i + 1}</td>
          <td>${cls.name}</td>
          <td>${cls.fee}</td>

          <td>${cls.admissionFee || 'N/A'}</td>
                 ${isSuperAdmin ? `<td>${cls.campusId?.name || 'N/A'}</td>` : ''}

          <td>
        <button class="btn btn-sm btn-info me-1" onclick="editClass('${cls._id}')">✏️</button>

            <button class="btn btn-sm btn-danger" onclick="deleteClass('${cls._id}')">🗑️</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No classes found</td></tr>`;
    }
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
     var res = await api.delete(`/coachingClass/delete/${id}`);
      classList = classList.filter(cls => cls._id !== id);
originalClassList = originalClassList.filter(cls => cls._id !== id);
    showToast(res.data.message || "Deleted successfully");

      renderTable();
    } catch (err) {
      console.error("Failed to delete class:", err);
    showToast("Failed to delete campus", false);

    }
  }

  // ➕ Add Class
  addButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = classNameInput.value.trim();
    const fee = classFeeInput.value.trim();
    // const tuitionFee = tuitionFeeInput.value.trim();
    const admissionFee = admissionFeeInput.value.trim();

    if (!name || !fee  ) {
      alert("Please fill all fields");
      return;
    }

    let campusId;
  
  
        if (isSuperAdmin) {
      const dropdown = document.getElementById("campusDropdown");
      campusId = dropdown.value;
      if (!campusId) {
        alert("Please select a campus");
        return;
      }
    } else {
      campusId = user[0].campus._id;
    }

    try {
       if (isEditing) {
      const res = await api.put(`/coachingClass/update/${editingId}`, {
        name, fee,admissionFee,campusId 
      });

      const { data, message } = res.data;
      const index = classList.findIndex(s => s._id === editingId);
      classList[index] = data;
      originalClassList[index] = data;

      showToast(message || "campus updated successfully");

    } else {
      const res = await api.post("/coachingClass/add", {
        name, fee,admissionFee,campusId  
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
      if (message === "campus Already Exists") return;
    }

    // Reset and close modal
    isEditing = false;
    editingId = null;
    classForm.reset();
    addButton.textContent = "Add campus";
    document.getElementById("addClassModalLabel").textContent = "Add New campus";
    modal.hide();


      if (isSuperAdmin) document.getElementById("campusDropdown").value = "";

      renderTable();
    } catch (err) {
      console.error("Error adding class:", err);
    showToast(err.response?.data?.message || "Server error", false);
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
 

  if(isSuperAdmin) document.getElementById('campusDropdown').value = classData.campusId._id

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
  renderTable();
});

// 👇 campus dropdown filter
if (isSuperAdmin) {
  console.log(campusSelectBox1)
  campusSelectBox1.addEventListener('change', (e) => {
    selectedcampusId = e.target.value; // Save selected campus
console.log(selectedcampusId)
    const searchTerm = searchcampusInput.value.toLowerCase().trim();

    // Apply both filters: campus + search text
    filteredClasses = originalClassList.filter(cls =>
      (selectedcampusId === '' || cls.campusId._id === selectedcampusId) &&
      cls.name.toLowerCase().includes(searchTerm)
    );

    classList = filteredClasses;
    renderTable();
  });
}

document.getElementById("addClassModal").addEventListener("hidden.bs.modal", closeModal);


function closeModal() {
  classForm.reset();
  isEditing = false;
  editingId = null;
  formSubmitBtn.textContent = "Add campus";
  document.getElementById("addClassModalLabel").textContent = "Add New campus";
}


}

else{
             window.location.href='../user/login.html'

}


