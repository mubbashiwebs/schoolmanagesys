    let isEditing = false;
    let editingId = null;

    const user = JSON.parse(localStorage.getItem("userData")) || [];
    const isSuperAdmin = user[0]?.designation === "supremeadmin";
    const adminTh = document.getElementById("adminth");



    function showToast(message, bg = 'bg-success') {
      const toast = document.getElementById("toastMessage");
      const body = document.getElementById("toastBody");
      toast.classList.remove("bg-success", "bg-danger");
      toast.classList.add(bg);
      body.innerText = message;
      new bootstrap.Toast(toast).show();
    }


    if (user.length <= 0) window.location.href = 'Dashboard.html';
    else {
      
      const courseTableBody = document.querySelector("#courseTable tbody");
      const searchInput = document.getElementById("searchCourse");
      const form = document.getElementById("courseForm");

      async function loadCourses() {
        const url = isSuperAdmin ? `/english-courses/school` : `/english-courses/getByCampus/${user[0].campus._id}`;
        const res = await api.get(url);
        courseList = res.data.data;
        filteredCourses = [...courseList];
        console.log(courseList)
        renderTable();
      }

      function renderTable() {
        courseTableBody.innerHTML = "";
      adminTh.style.display = isSuperAdmin ? 'block' : 'none';

        if (filteredCourses.length === 0) {
          courseTableBody.innerHTML = `<tr><td colspan="5" class="text-center">No data found</td></tr>`;
          return;
        }

        filteredCourses.forEach((course, index) => {
          courseTableBody.innerHTML += `
            <tr>
              <td>${index + 1}</td>
              <td>${course.name}</td>

              <td style="display: ${isSuperAdmin ? 'table-cell' : 'none'}">${course.campusId?.name || ''}</td>
              <td>
        <button class="btn btn-sm btn-info me-1" onclick="editCourse('${course._id}')">Edit</button>

                <button class="btn btn-sm btn-danger" onclick="deleteCourse('${course._id}')">Delete</button>
                </td>
            </tr>
          `;
        });
      }

      searchInput.addEventListener("input", () => {
        const val = searchInput.value.toLowerCase();
        const selectedcampusId = document.getElementById("campusDropdownfilter")?.value || "";
        filteredCourses = courseList.filter(course =>
          course.name.toLowerCase().includes(val) &&
          (selectedcampusId === "" || course.campusId?._id === selectedcampusId)
        );
        renderTable();
      });

      campusSelectBox1.addEventListener("change", () => {
        searchInput.dispatchEvent(new Event("input"));
      });

      form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("courseName").value.trim();

  const campusId = isSuperAdmin ? document.getElementById("campusDropdown").value : user[0].campus._id;
   

  if (!name  || !campusId ) return showToast("Please fill all fields", "bg-danger");
        
  const body = { name, campusId  };

  try {
    if (isEditing) {
      // 🔄 UPDATE
      const res = await api.put(`/english-courses/update/${editingId}`, body);
      const updated = res.data.data;

      if (!updated || !updated._id) return showToast(res.data.message || "Update failed", "bg-danger");

      const idx = courseList.findIndex(c => c._id === editingId);
      courseList[idx] = updated;
      filteredCourses[idx] = updated;

      showToast(res.data.message || "Course updated successfully");
    } else {
      // ➕ ADD
      const res = await api.post(`/english-courses/add`, body);
      const added = res.data.data;

      if (!added || !added._id) return showToast(res.data.message || "Add failed", "bg-danger");

      courseList.push(added);
      filteredCourses = [...courseList];
      showToast("Course added successfully");
    }

    isEditing = false;
    editingId = null;
    form.reset();
    renderTable();
    bootstrap.Modal.getInstance(document.getElementById("courseModal")).hide();

    // Reset button and label
    document.getElementById("addCourseButton").textContent = "Add Course";
    document.getElementById("courseModalLabel").textContent = "Add New Course";
  } catch (err) {
    console.error(err);
    showToast(err.response?.data?.message || "Server error", "bg-danger");
  }
});



window.editCourse = async function (id) {
  const course = courseList.find(c => c._id === id);
  if (!course) return showToast("Course not found", "bg-danger");
  // if (isSuperAdmin) {
  //   // await fillBatchDropdown(course.campusId._id);
  // }
  isEditing = true;
  editingId = id;

  document.getElementById("courseName").value = course.name;

  if (isSuperAdmin) {
    document.getElementById("campusDropdown").value = course.campusId._id;
  }

  document.getElementById("courseModalLabel").textContent = "Update Course";
  document.getElementById("addCourseButton").textContent = "Update Course";
  const modal = new bootstrap.Modal(document.getElementById("courseModal"));
  modal.show();
};


      window.deleteCourse = async (id) => {
        if (!confirm("Are you sure you want to delete this course?")) return;
        try {
          await api.delete(`/english-courses/delete/${id}`);
          courseList = courseList.filter(cls => cls._id !== id);
          filteredCourses = [...courseList];
          renderTable();
          showToast("Course deleted successfully");
        } catch (err) {
          console.error(err);
          showToast("Failed to delete course", "bg-danger");
        }
      };
document.getElementById("courseModal").addEventListener("hidden.bs.modal", closeModal);

      function closeModal() {
  form.reset();
  isEditing = false;
  editingId = null;
  document.getElementById("addCourseButton").textContent = "Add campus";
  document.getElementById("courseModalLabel").textContent = "Add New campus";
}

      loadCourses();
    }
