
    const sectionNameInput = document.getElementById("sectionName");
    const addButton = document.getElementById("formSubmitBtn");
    const sectionForm = document.getElementById("sectionForm");
    const tableBody = document.querySelector("#sectionTable tbody");
    const adminTh = document.getElementById("adminth");
    const modal = new bootstrap.Modal(document.getElementById("sectionModal"));
    const toast = new bootstrap.Toast(document.getElementById("toastMessage"));
    const toastBody = document.getElementById("toastBody");
    const toastElement = document.getElementById("toastMessage");
    const searchSectionInput = document.getElementById("searchSection");
    // const sidebar = document.getElementById("sidebar");

    const user = JSON.parse(localStorage.getItem("userData")) || [];
    const isSuperAdmin = user[0]?.designation === "supremeadmin";

    let isEditing = false;
    let editingId = null;
    let sectionList = [];
    let originalSectionList = [];
    // let campusList = [];
    let selectedcampusId = '';

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

    // const allLinks = {
    //   addclass: { name: "Add Class", file: "classform.html", active: false },
    //   addsection: { name: "Add Section", file: "section.html", active: true },
    //   addcomputercourse: { name: "Add Computer Course", file: "compcourse.html", active: false },
    //   addenglangcourse: { name: "Add English lang Course", file: "englangcourse.html", active: false },
    //   addstudent: { name: "Student Form", file: "student.html", active: false },
    //   studentlist: { name: "Student List", file: "studentlist.html", active: false },
    //   addteacher: { name: "Teacher Form", file: "teacher.html", active: false },
    //   teacherlist: { name: "Teacher List", file: "teacherlist.html", active: false },
    //   teacherSalary: { name: "Teacher Salary", file: "teacherSalary.html", active: false },
    //   adduser: { name: "Add User", file: "userform.html", active: false },
    // };

    if (!user.length) window.location.href = "Dashboard.html";

    // function renderSidebar(user) {
    //   sidebar.innerHTML = `<a class='active' href="Dashboard.html">Dashboard</a>`;
    //   if (isSuperAdmin) sidebar.innerHTML += `<a href="campusform.html">Add campus</a>`;
    //   for (const key in allLinks) {
    //     if (isSuperAdmin || user[0].allowedPages.includes(key)) {
    //       sidebar.innerHTML += `<a href="${allLinks[key].file}" class="${allLinks[key].active ? 'active' : ''}">${allLinks[key].name}</a>`;
    //     } else if (allLinks[key].active) {
    //       window.location.href = 'Dashboard.html';
    //     }
    //   }
    //   sidebar.innerHTML += `<a href="#">Logout</a>`;
    // }

    // renderSidebar(user);

    // const campusSelectBox1 = document.getElementById('campusSelectBox1');
    // const campusSelectBox2 = document.getElementById('campusSelectBox2');

    // if (isSuperAdmin) {
    //   const campusDropdown = document.createElement("select");
    //   campusDropdown.className = "form-select mb-3";
    //   campusDropdown.id = "campusDropdown";
    //   campusDropdown.required = true;

    //   const label = document.createElement("label");
    //   label.textContent = "Select campus";
    //   label.setAttribute("for", "campusDropdown");
    //   label.className = "form-label";

    //   const campusDropdownFilter = document.createElement("select");
    //   campusDropdownFilter.className = "form-select mb-3";
    //   campusDropdownFilter.id = "campusDropdownfilter";

    //   const label2 = document.createElement("label");
    //   label2.textContent = "Select campus";
    //   label2.setAttribute("for", "campusDropdownfilter");
    //   label2.className = "form-label";

    //   campusSelectBox2.appendChild(label);
    //   campusSelectBox2.appendChild(campusDropdown);
    //   campusSelectBox1.appendChild(label2);
    //   campusSelectBox1.appendChild(campusDropdownFilter);

    //   async function loadcampuss() {
    //     const res = await axios.get("http://localhost:3000/api/campus/get");
    //     campusList = res.data.data;

    //     campusDropdown.innerHTML = `<option value="">Select campus</option>`;
    //     campusDropdownFilter.innerHTML = `<option value="">Select campus</option>`;

    //     campusList.forEach(campus => {
    //       const opt = new Option(campus.name, campus._id);
    //       campusDropdown.appendChild(opt.cloneNode(true));
    //       campusDropdownFilter.appendChild(opt);
    //     });
    //   }
    //   loadcampuss();

      campusSelectBox1.addEventListener('change', filterSection);
    // }

    function filterSection() {
      selectedcampusId = isSuperAdmin ? document.getElementById('campusDropdownfilter').value : '';
      const searchTerm = searchSectionInput.value.toLowerCase().trim();

      const filtered = originalSectionList.filter(sec =>
        (selectedcampusId === '' || sec.campusId._id === selectedcampusId) &&
        sec.name.toLowerCase().includes(searchTerm)
      );

      sectionList = filtered;
      renderTable();
    }

    searchSectionInput.addEventListener('input', filterSection);

    async function fetchSections() {
      const endpoint = isSuperAdmin ? `http://localhost:3000/api/section/school/${user[0].school._id}` : `http://localhost:3000/api/section/getByCampus/${user[0].school._id}/${user[0].campus._id}`;
      const res = await axios.get(endpoint);
      originalSectionList = res.data.data;
      sectionList = [...originalSectionList];
      renderTable();
    }

    function renderTable() {
      tableBody.innerHTML = "";
      adminTh.style.display = isSuperAdmin ? 'block' : 'none';
      if(sectionList.length == 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No Section found</td></tr>`;
    }
      sectionList.forEach((sec, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${sec.name}</td>
                 ${isSuperAdmin ? `<td>${sec.campusId?.name || 'N/A'}</td>` : ''}
          <td>
            <button class="btn btn-info btn-sm me-1" onclick="editSection('${sec._id}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="deleteSection('${sec._id}')">🗑️</button>
          </td>`;
        tableBody.appendChild(row);
      });
    }

    window.editSection = function(id) {
      const section = sectionList.find(s => s._id === id);
      if (!section) return showToast("Section not found", false);
      isEditing = true;
      editingId = id;
      sectionNameInput.value = section.name;
      if (isSuperAdmin) document.getElementById('campusDropdown').value = section.campusId._id;
      document.getElementById("sectionModalLabel").textContent = "Update Section";
      addButton.textContent = "Update Section";
      modal.show();
    }

    window.deleteSection = async function(id) {
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

      const res = await axios.delete(`http://localhost:3000/api/section/delete/${id}`);
      showToast(res.data.message);
      originalSectionList = originalSectionList.filter(s => s._id !== id);
      sectionList = sectionList.filter(s => s._id !== id);
      renderTable();
    }

sectionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = sectionNameInput.value.trim();
  if (!name) return showToast("Enter section name", false);

  let campusId = isSuperAdmin ? document.getElementById("campusDropdown").value : user[0].campus._id;
  if (isSuperAdmin && !campusId) return showToast("Please select a campus", false);
  var schoolId = user[0].school._id;
    const createdBy = user[0]._id

  const body = { name, campusId, schoolId , createdBy };

  try {
    if (isEditing) {
      const res = await axios.put(`http://localhost:3000/api/section/update/${editingId}`, body);
      const updated = res.data.data;
      console.log(updated)
      if (!updated) return showToast(res.data.message || "Update failed", false);

      const idx = sectionList.findIndex(s => s._id === editingId);
      sectionList[idx] = updated;
      originalSectionList[idx] = updated;
      showToast(res.data.message || "Section updated successfully");
    } else {
      const res = await axios.post("http://localhost:3000/api/section/add", body);
      const added = res.data.data;
      if (!added || !added._id) return showToast(res.data.message || "Add failed", false);

      sectionList.push(added);
      originalSectionList.push(added);
      showToast(res.data.message || "Section added successfully");
    }

    isEditing = false;
    editingId = null;
    sectionForm.reset();
    addButton.textContent = "Add Section";
    document.getElementById("sectionModalLabel").textContent = "Add New Section";
    modal.hide();
    renderTable();
  } catch (err) {
    console.error(err);
    showToast(err.response?.data?.message || "Server error", false);
  }
});

document.getElementById("sectionModal").addEventListener("hidden.bs.modal", closeModal);

      function closeModal() {
  sectionForm.reset();
  isEditing = false;
  editingId = null;
  addButton.textContent = "Add campus";
  document.getElementById("sectionModalLabel").textContent = "Add New campus";
}


    fetchSections();
renderPagination()
    function renderPagination(totalPages = 1 ){
      var pagination = document.getElementById('pagination')
      // pagination.innerHTML = ''
      if(totalPages <= 1) return console.log('hello')
        console.log('hi')
    }
