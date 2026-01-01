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
    let schoolList = [];

    // const sidebar = document.getElementById("sidebar");
    // const allLinks = {
    //   addcampus: { name: "Add Campus", file: "campusform.html", active: true },
    //   addclass: { name: "Add Class", file: "classform.html", active: false },
    //   addsection: { name: "Add Section", file: "section.html", active: false }
    // };

    // function renderSidebar() {
    //   sidebar.innerHTML = `<a class='active' href="Dashboard.html">Dashboard</a>`;
    //   if (isSuperAdmin) sidebar.innerHTML += `<a href="schoolform.html">Add School</a>`;
    //   for (const key in allLinks) {
    //     if (isSuperAdmin || user[0].allowedPages.includes(key)) {
    //       sidebar.innerHTML += `<a href="${allLinks[key].file}" class="${allLinks[key].active ? 'active' : ''}">${allLinks[key].name}</a>`;
    //     }
    //   }
    //   sidebar.innerHTML += `<a href="#">Logout</a>`;
    // }

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
        
         res = await axios.get(`http://localhost:3000/api/campus/getBySchool/${user[0].school._id}`);
        console.log(res.data)
        campusList = res.data;
        originalCampusList = [...campusList];
        renderTable();
      } catch (err) {
        console.error("Error loading campuses:", err);
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

      var schoolId = user[0].school._id;
      try {
        if (isEditing) {
          const res = await axios.put(`http://localhost:3000/api/campus/update/${editingId}`, { name, address, code, schoolId , contact,email,principalName });
          console.log(res)
          const index = campusList.findIndex(c => c._id === editingId);
          campusList[index] = res.data.campus;
          originalCampusList[index] = res.data.campus;
          showAlert("Campus updated successfully");
        } else {
          const res = await axios.post("http://localhost:3000/api/campus/add", { name, address, code, schoolId , contact,email,principalName , createdBy});
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
        await axios.delete(`http://localhost:3000/api/campus/delete/${id}`);
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
      // if (isSuperAdmin) document.getElementById("schoolDropdown").value = campus.schoolId?._id || "";
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

    // School dropdown filter for superadmin
    

    // renderSidebar();
