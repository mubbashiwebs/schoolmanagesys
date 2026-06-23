
    let isEditing = false;
    let editingId = null;

    const user = JSON.parse(localStorage.getItem("userData")) || [];
    const isSuperAdmin = user[0]?.designation === "supremeadmin";

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

    if (user.length <= 0) {
      window.location.href = 'Dashboard.html';
    } else {
      let subjectList = [];
      let filteredSubjects = [];

      const subjectTableBody = document.querySelector("#subjectTable tbody");
      const searchInput = document.getElementById("searchSubject");
      const form = document.getElementById("subjectForm");
      const adminTh = document.getElementById('adminth');

      async function loadSubjects() {
        const url = isSuperAdmin 
          ? `/subject/getBySchool` 
          : `/subject/getbyCampus/${user[0].campus._id}`;
        const res = await api.get(url);
        subjectList = res.data.data;
        filteredSubjects = [...subjectList];
        renderTable();
      }

      function renderTable() {
        subjectTableBody.innerHTML = "";
        adminTh.style.display = isSuperAdmin ? "table-cell" : "none";
        console
        if (filteredSubjects.length === 0) {
          subjectTableBody.innerHTML = `<tr><td colspan="5" class="text-center">No data found</td></tr>`;
          return;
        }

        filteredSubjects.forEach((subject, index) => {
          subjectTableBody.innerHTML += `
            <tr>
              <td>${index + 1}</td>
              <td>${subject.name}</td>
              ${isSuperAdmin ? `<td>${subject.campusId?.name || 'N/A'}</td>` : ''}
              <td>
                <button class="btn btn-sm btn-info me-1" onclick="editSubject('${subject._id}')">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deleteSubject('${subject._id}')">🗑️</button>
              </td>
            </tr>
          `;
        });
      }

      searchInput.addEventListener("input", () => {
        const val = searchInput.value.toLowerCase();
        const selectedCampusId = document.getElementById("campusDropdownfilter")?.value || "";
        filteredSubjects = subjectList.filter(subject =>
          subject.name.toLowerCase().includes(val) &&
          (selectedCampusId === "" || subject.campusId?._id === selectedCampusId)
        );
        renderTable();
      });
      console.log(campusSelectBox1)
          campusSelectBox1.addEventListener("change", () => {
        const val = searchInput.value.toLowerCase();
        const selectedCampusId = document.getElementById("campusDropdownfilter")?.value || "";
        filteredSubjects = subjectList.filter(subject =>
          subject.name.toLowerCase().includes(val) &&
          (selectedCampusId === "" || subject.campusId?._id === selectedCampusId)
        );
        renderTable();
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("subjectName").value.trim();
        const campusId = isSuperAdmin ? document.getElementById("campusDropdown").value : user[0].campus._id;
        if (!name || !campusId) return showToast("Please fill all fields", false);
       

        const body = { name, campusId};

        try {
          if (isEditing) {
            const res = await api.put(`/subject/update/${editingId}`, body);
            const updated = res.data.data;
            // if (!updated || !updated._id) return showToast(res.data.message , false);
            const idx = subjectList.findIndex(c => c._id === editingId);
            subjectList[idx] = updated;
            filteredSubjects[idx] = updated;
            showToast(res.data.message || "Subject updated successfully");
          } else {
            const res = await api.post("/subject/add", body);
            const added = res.data.data;
            if (!added || !added._id) return showToast(res.data.message || "Add failed", "bg-danger");
            subjectList.push(added);
            filteredSubjects = [...subjectList];
            showToast(res.data.message || "Subject added successfully", true);
          }

          isEditing = false;
          editingId = null;
          renderTable();
          form.reset();
          document.getElementById("addSubjectButton").textContent = "Add Subject";
          document.getElementById("subjectModalLabel").textContent = "Add New Subject";
          bootstrap.Modal.getInstance(document.getElementById("subjectModal")).hide();
        } catch (err) {
          console.error(err);
          showToast(err.response?.data?.message || "Server error", false);
        }
      });

      window.editSubject = async function (id) {
        const subject = subjectList.find(c => c._id === id);
        if (!subject) return showToast("Subject not found", false);
        isEditing = true;
        editingId = id;
        document.getElementById("subjectName").value = subject.name;
        if (isSuperAdmin) {
          document.getElementById("campusDropdown").value = subject.campusId._id;
        }
        document.getElementById("subjectModalLabel").textContent = "Update Subject";
        document.getElementById("addSubjectButton").textContent = "Update Subject";
        const modal = new bootstrap.Modal(document.getElementById("subjectModal"));
        modal.show();
      };

      window.deleteSubject = async (id) => {
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
          var res =await api.delete(`/subject/delete/${id}`);
          subjectList = subjectList.filter(cls => cls._id !== id);
          filteredSubjects = [...subjectList];
          renderTable();
          showToast(res.data.message || "Subject deleted successfully", true);
        } catch (err) {
          console.error(err);
          showToast(err.response?.data?.message || "Failed to delete subject", false);
        }
      };

      document.getElementById("subjectModal").addEventListener("hidden.bs.modal", closeModal);

      function closeModal() {
        form.reset();
        isEditing = false;
        editingId = null;
        document.getElementById("addSubjectButton").textContent = "Add Subject";
        document.getElementById("subjectModalLabel").textContent = "Add New Subject";
      }

      loadSubjects();
    }
