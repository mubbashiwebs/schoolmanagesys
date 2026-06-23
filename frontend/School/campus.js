    const campusNameInput = document.getElementById("campusName");
    const campusAddressInput = document.getElementById("campusAddress");
    const campusEmailInput = document.getElementById("campusEmail");
    const campusContactInput = document.getElementById("campusContact");
    const campusprincipalNameInput = document.getElementById("campusprincipalName");
    const campusCodeInput = document.getElementById("campusCode");
    const addButton = document.getElementById("formSubmitBtn");
    const tableBody = document.querySelector("#campusTable tbody");
    const campusForm = document.getElementById("campusForm");

    const user = JSON.parse(localStorage.getItem("userData")) || [];
    console.log(user)
    const isSuperAdmin = user[0]?.designation === "supremeadmin";
    const modal = new bootstrap.Modal(document.getElementById("addCampusModal"));

    let isEditing = false;
    let editingId = null;
    let originalCampusList = [];
    let campusList = [];



    function showAlert(message, type = "success") {
      Swal.fire({
        toast:true,
        position: 'top-end',
        
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 1500
      });
    }

    // Load school dropdown for superadmin

    // Load campuses
    window.addEventListener("DOMContentLoaded", loadCampuses);
    async function loadCampuses() {
      try {
        let res;
        
         res = await api.get(`/campus/getBySchool`);
        console.log(res.data)
        campusList = res.data;
        originalCampusList = [...campusList];
        renderTable();
      } catch (err) {
       
      }
    }

    function renderTable() {
      tableBody.innerHTML = "";
      if (campusList.length > 0) {
        campusList.forEach((campus, i) => {
          tableBody.innerHTML += `
            <tr>
              <td>${i + 1}</td>
              <td>${campus.name}</td>
              <td>${campus.code}</td>
              <td>${campus.email}</td>
              <td>${campus.contact}</td>
              <td>${campus.principalName || 'N/A'}</td>
              <td>${campus.address}</td>

              <td>
                <button class="btn btn-sm btn-info me-1" onclick="editCampus('${campus._id}')">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCampus('${campus._id}')">🗑️</button>
              </td>
            </tr>`;
        });
      } else {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No campuses found</td></tr>`;
      }
    }

    // Add/Edit campus
    campusForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = campusNameInput.value.trim();
      const address = campusAddressInput.value.trim();
      const email = campusEmailInput.value.trim();
      const contact = campusContactInput.value.trim();
      const principalName = campusprincipalNameInput.value.trim();
      const code = campusCodeInput.value.trim();
    const createdBy = user[0]._id

      console.log(name,address,email,contact)
      if (!name || !address || !code || !email || !contact || !principalName) return showAlert("Please fill all fields", "error");

      try {
        if (isEditing) {
          const res = await api.put(`/campus/update/${editingId}`, { name, address, code,  contact,email,principalName });
          console.log(res)
          const index = campusList.findIndex(c => c._id === editingId);
          campusList[index] = res.data.campus;
          originalCampusList[index] = res.data.campus;
          showAlert("Campus updated successfully");
        } else {
          const res = await api.post(`/campus/add`, { name, address, code,  contact,email,principalName , createdBy});
          if (res.data.campus && res.data.campus._id) {
            console.log('reach')
            campusList.push(res.data.campus);
            originalCampusList.push(res.data.campus);
            showAlert("Campus added successfully");
          }
        }
        campusForm.reset();
        modal.hide();
        isEditing = false;
        editingId = null;
        renderTable();
      } catch (err) {
        console.error(err);
        showAlert("Error saving campus", "error");
      }
    });

    window.deleteCampus = async function (id) {
      if (!confirm("Are you sure you want to delete this campus?")) return;
      try {
        await api.delete(`/campus/delete/${id}`);
        campusList = campusList.filter(c => c._id !== id);
        originalCampusList = originalCampusList.filter(c => c._id !== id);
        showAlert("Campus deleted successfully");
        renderTable();
      } catch (err) {
        console.error(err);
        showAlert("Failed to delete campus", "error");
      }
    };

    window.editCampus = function (id) {
      const campus = campusList.find(c => c._id === id);
      if (!campus) return showAlert("Campus not found", "error");
      isEditing = true;
      editingId = id;
      campusNameInput.value = campus.name;
      campusAddressInput.value = campus.address;
      campusEmailInput.value = campus.email;
      campusContactInput.value = campus.contact;  
      campusprincipalNameInput.value = campus.principalName;
      campusCodeInput.value = campus.code;
      
      document.querySelector("#addCampusModal .modal-title").innerText = "Update Campus";
      addButton.innerText = "Update Campus";
      modal.show();
    };

    // Search filter
    document.getElementById('searchCampus').addEventListener('input', () => {
      const term = document.getElementById('searchCampus').value.toLowerCase();
      campusList = originalCampusList.filter(c => c.name.toLowerCase().includes(term));
      renderTable();
    });

   