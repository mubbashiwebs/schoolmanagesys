
let isEditing = false;
let editingId = null;


    // JavaScript logic now fully included
    const user = JSON.parse(localStorage.getItem("userData")) || [];
    const isSuperAdmin = user[0]?.designation === "supremeadmin";
  

    function showToast(message, bg = 'bg-success') {
      const toast = document.getElementById("toastMessage");
      const body = document.getElementById("toastBody");
      toast.classList.remove("bg-success", "bg-danger");
      toast.classList.add(bg);
      body.innerText = message;
      new bootstrap.Toast(toast).show();
    }



    if (user.length <= 0) {
      window.location.href = 'Dashboard.html';
    } else {
 
      let courseList = [];
      let filteredCourses = [];

   
      const courseTableBody = document.querySelector("#courseTable tbody");
      const searchInput = document.getElementById("searchCourse");
      const form = document.getElementById("courseForm");

    

      async function loadCourses() {
        const url = isSuperAdmin ? `/course/school` : `/course/getbyCampus/${user[0].campus._id}`;
        const res = await api.get(url);
        courseList = res.data.data;
        filteredCourses = [...courseList];
        console.log(courseList)
        renderTable();
      }
  const adminTh = document.getElementById('adminth')

      function renderTable() {
        courseTableBody.innerHTML = "";
        adminTh.style.display = isSuperAdmin ? "table-cell" : "none";
        if (filteredCourses.length === 0) {
          courseTableBody.innerHTML = `<tr><td colspan="5" class="text-center">No data found</td></tr>`;
          return;
        }

        filteredCourses.forEach((course, index) => {
          courseTableBody.innerHTML += `
            <tr>
              <td>${index + 1}</td>
              <td>${course.name}</td>
                 ${isSuperAdmin ? `<td>${course.campusId?.name || 'N/A'}</td>` : ''}

              <td>
        <button class="btn btn-sm btn-info me-1" onclick="editCourse('${course._id}')">Edit</button>

                <button class="btn btn-sm btn-danger" onclick="deleteCourse('${course._id}')">Delete</button></td>
            </tr>
          `;
        });
      }

      searchInput.addEventListener("input", () => {
        const val = searchInput.value.toLowerCase();
        const selectedcampusId = document.getElementById("campusDropdownfilter")?.value || "";
        console.log(selectedcampusId)
        filteredCourses = courseList.filter(course =>
          course.name.toLowerCase().includes(val) &&
          (selectedcampusId === "" || course.campusId?._id === selectedcampusId)
        );
        renderTable();
      });

      campusSelectBox1.addEventListener("change", () => {
        searchInput.dispatchEvent(new Event("input"));
        console.log('hello')
      });

     form.addEventListener("submit", async (e) => {
  e.preventDefault();
   

  const name = document.getElementById("courseName").value.trim();
  // const fee = document.getElementById("courseFee").value.trim();
  const campusId = isSuperAdmin ? document.getElementById("campusDropdown").value : user[0].campus._id;
      // const batchId = document.getElementById("batchDropdown").value 
  if (!name  || !campusId ) return showToast("Please fill all fields", "bg-danger");

  const body = { name,  campusId,  };

  try {
    if (isEditing) {
      // ✅ UPDATE COURSE
      const res = await api.put(`/course/update/${editingId}`, body);
      const updated = res.data.data;

      if (!updated || !updated._id) return showToast(res.data.message || "Update failed", "bg-danger");

      const idx = courseList.findIndex(c => c._id === editingId);
      courseList[idx] = updated;
      filteredCourses[idx] = updated;

      showToast(res.data.message || "Course updated successfully");
    } else {
      // ✅ ADD COURSE
      const res = await api.post(`/course/add`, body);
      const added = res.data.data;

      if (!added || !added._id) return showToast(res.data.message || "Add failed", "bg-danger");

      courseList.push(added);
      filteredCourses = [...courseList];
      showToast("Course added successfully");
    }

    isEditing = false;
    editingId = null;

    renderTable();
    form.reset();
    document.getElementById("addCourseButton").textContent = "Add Course";
    document.getElementById("courseModalLabel").textContent = "Add New Course";
    bootstrap.Modal.getInstance(document.getElementById("courseModal")).hide();
  } catch (err) {
    console.error(err);
    showToast(err.response?.data?.message || "Server error", "bg-danger");
  }
});




      window.editCourse = async function (id) {
  const course = courseList.find(c => c._id === id);

  if (!course) return showToast("Course not found", "bg-danger");

  isEditing = true;
  editingId = id;

  document.getElementById("courseName").value = course.name;
  // document.getElementById("courseFee").value = course.fee;
  if (isSuperAdmin) {
    document.getElementById("campusDropdown").value = course.campusId._id;
  }
  // document.getElementById("batchDropdown").value = course.batchId._id;
  document.getElementById("courseModalLabel").textContent = "Update Course";
  document.getElementById("addCourseButton").textContent = "Update Course"; // Change button text
  const modal = new bootstrap.Modal(document.getElementById("courseModal"));
  modal.show();
};


      window.deleteCourse = async (id) => {
        if (!confirm("Are you sure you want to delete this course?")) return;
        try {
          await api.delete(`/course/delete/${id}`);
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
  document.getElementById("addCourseButton").textContent = "💾 Add Course";
  document.getElementById("courseModalLabel").textContent = "➕ Add New Cours";
}

      // loadcampuss();
      loadCourses();
    }

    

  
