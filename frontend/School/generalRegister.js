const user = JSON.parse(localStorage.getItem("userData")) || [];
const isSuperAdmin = user[0]?.designation === "supremeadmin";

campusId = isSuperAdmin ? null : user[0]?.campus?._id
let registers = [];
let isEdit = false;
let editingId;

// ========== TOAST ===========
const toast = new bootstrap.Toast(document.getElementById("toastMessage"));
const toastBody = document.getElementById("toastBody");
const toastElement = document.getElementById("toastMessage");

function showToast(message, isSuccess = true) {
  toastBody.textContent = message;
  toastElement.classList.remove("bg-success", "bg-danger");
  toastElement.classList.add(isSuccess ? "bg-success" : "bg-danger");
  toast.show();
}

// ========== LOAD REGISTERS ===========
async function loadRegisters() {
  try {
    const res = await api.get(
      `/general-register/${isSuperAdmin ? `all` : `getByCampus?campusId=${campusId}`}`
    );

    console.log(res.data);

    if (res.data?.success) {
      registers = res.data.data || [];
    } else {
      registers = [];
      showToast(res.data.message || "No data found", false);
    }

  } catch (error) {
    showToast(error.response?.data?.message || error.message, false);
  }

  renderTable();
}

// ========== RENDER TABLE ==============
function renderTable() {
  const tbody = document.getElementById("registerTableBody");
  tbody.innerHTML = "";

  const search = document.getElementById("searchInput").value.toLowerCase();

  const filtered = registers.filter(item =>
    item.registerName?.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">No record available</td>
      </tr>
    `;
    return;
  }

  filtered.forEach((item, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.registerName}</td>
        <td>${item.campusId?.name || "-"}</td>
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
  const createdBy = user[0]?._id;

  if (isSuperAdmin) {
    const dropdown = document.getElementById("campusDropdown");
    campusId = dropdown?.value;

    if (!campusId) {
      showToast("Please select a campus", false);
      return;
    }
  } else {
    campusId = user[0]?.campus?._id;
  }

  const registerName = document.getElementById("registerName").value.trim();
  if (!registerName) return showToast("Register name is required!", false);

  try {
    let res;

    if (isEdit) {
      res = await api.put(`/general-register/update/${editingId}`, {
        schoolId,
        campusId,
        registerName
      });
    } else {
      res = await api.post(`/general-register/add`, {
        schoolId,
        campusId,
        registerName
      });
    }

    showToast(res.data.message, res.data.success);

    if (res.data.success) {
      document.getElementById("registerName").value = "";
      bootstrap.Modal.getInstance(
        document.getElementById("addRegisterModal")
      ).hide();

      isEdit = false;
      editingId = null;

      loadRegisters(); // 🔥 duplicate push bug fix
    }

  } catch (error) {
    showToast(error.response?.data?.message || error.message, false);
  }
});

// ========== DELETE REGISTER ===========
async function deleteRegister(id) {
  if (!confirm("Delete this register?")) return;

  try {
    const res = await api.delete(`/general-register/delete/${id}`);
    showToast(res.data.message || "Deleted", true);
    loadRegisters();
  } catch (error) {
    showToast(error.response?.data?.message || "Error deleting", false);
  }
}

// ========== SEARCH EVENT ===========
document.getElementById("searchInput").addEventListener("keyup", renderTable);

loadRegisters();

// ========== EDIT REGISTER ===========
const editRegister = (id) => {
  isEdit = true;
  editingId = id;

  const currentRegister = registers.find(reg => reg._id == id);
  if (!currentRegister) return;

  const modalElement = document.getElementById("addRegisterModal");
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();

  document.getElementById("registerName").value = currentRegister.registerName;

  if (isSuperAdmin) {
    const dropdown = document.getElementById("campusDropdown");
    dropdown.value = currentRegister.campusId?._id;
    campusId = currentRegister.campusId?._id;
  }
};
