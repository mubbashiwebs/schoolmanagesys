const apiUrl = "http://localhost:3000/api/general-register";

  const user = JSON.parse(localStorage.getItem("userData")) || [];
  const isSuperAdmin = user[0]?.designation === "supremeadmin";
schoolId = user[0].school._id
campusId = isSuperAdmin ? null : user[0].campus._id
let registers = [];
let isEdit = false;
let editingId

// ========== TOAST ===========
const toast = new bootstrap.Toast(document.getElementById("toastMessage"));
const toastBody = document.getElementById("toastBody");
const toastElement = document.getElementById("toastMessage");
function showToast(message, isSuccess = true) {
  console.log('toast is working')
  toastBody.textContent = message;
  toastElement.classList.remove("bg-success", "bg-danger");
  toastElement.classList.add(isSuccess ? "bg-success" : "bg-danger");
  toast.show();
}


// ========== LOAD REGISTERS ===========
async function loadRegisters() {
  try {
    
    const res = await axios.get(`${apiUrl}/${isSuperAdmin ? `all?schoolId=${schoolId}` : `getByCampus?schoolId=${schoolId}&campusId=${campusId}` }`)
    console.log(res)
    registers = res.data.data || [];
     
    if(!res.data.success){
        showToast(res.data.message,false)
    }

  } catch (error) {
    console.log(error)
    showToast(error.response?.data.message || error.message , false);
  }
    renderTable();

}

// ========== RENDER TABLE ==============
function renderTable() {
  const tbody = document.getElementById("registerTableBody");
  tbody.innerHTML = "";

  const search = document.getElementById("searchInput").value.toLowerCase();
    


const filtered = registers.filter(item =>
  item.registerName.toLowerCase().includes(search)
);

console.log(filtered)

// Agar koi record nahi mila
if (filtered.length === 0) {
  tbody.innerHTML = `
    <tr>
      <td colspan="4" class="text-center text-muted">No record available</td>
    </tr>
  `;
  return; 
}

// Agar records mil gaye
filtered.forEach((item, index) => {
  tbody.innerHTML += `
    <tr>
      <td>${index + 1}</td>
      <td>${item.registerName}</td>
      <td>${item.campusId.name}</td>
      <td>
            <button class="btn btn-success btn-sm" onclick="editRegister('${item._id}')">
          Edit
        </button>

        <button class="btn btn-danger btn-sm" onclick="deleteRegister('${item._id}')">
          🗑 Delete
        </button>
      </td>
    </tr>
  `;
});

}

// ========== SAVE REGISTER ===========
document.getElementById("saveBtn").addEventListener("click", async () => {
    
     campusId;
     schoolId = user[0]?.school?._id;
    const createdBy = user[0]._id
        if (isSuperAdmin) {
      const dropdown = document.getElementById("campusDropdown");
      console.log(dropdown)
      campusId = dropdown?.value;
      console.log(campusId)
      if (!campusId) {
        alert("Please select a campus");
        return
      }
    } else {
      campusId = user[0].campus._id;
    }

  const registerName = document.getElementById("registerName").value.trim();
    console.log(registerName)
  if (!registerName) return showToast("Register name is required!");

  try {
    if (isEdit) {
        var res =await axios.put(`${apiUrl}/update/${editingId}`, {
        schoolId,
        campusId,
        registerName
      });
      console.log(res.data)
      showToast(res.data.message);

      
    } else {
      var res =await axios.post(`${apiUrl}/add`, {
        schoolId,
        campusId,
        registerName
      });
      console.log(res.data.message)
      showToast(res.data.message);
    }

    document.getElementById("registerName").value = "";
    isEdit = false;

    // console.log(res.data)
    if(res.data.success){
    registers.push(res.data.data)
    bootstrap.Modal.getInstance(document.getElementById("addRegisterModal")).hide();

    }
    renderTable()
    // loadRegisters();

  } catch (error) {
    console.log(error)
    showToast(error.response?.data.message || error.message);
  }
});

// ========== DELETE REGISTER ===========
async function deleteRegister(id) {
  if (!confirm("Delete this register?")) return;

  try {
    await axios.delete(`${apiUrl}/delete/${id}`);
    showToast("Deleted");
    loadRegisters();

  } catch (error) {
    showToast("Error deleting");
  }
}

// ========== SEARCH EVENT ===========
document.getElementById("searchInput").addEventListener("keyup", renderTable);

loadRegisters();
const editRegister = (id) => {
  isEdit = true;
  editingId = id;
  const currentRegister = registers.find(reg => reg._id == id)

  const modalElement = document.getElementById("addRegisterModal");
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
    document.getElementById("registerName").value = currentRegister.registerName;
      if (isSuperAdmin) {
      const dropdown = document.getElementById("campusDropdown")
      dropdown.value = currentRegister.campusId._id
      console.log(dropdown)
      campusId = currentRegister.campusId._id;
      }
};
