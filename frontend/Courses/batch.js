 const batchNameInput = document.getElementById("batchName");
    const batchTimingsInput = document.getElementById("batchTimings");
    const batchFeeInput = document.getElementById("batchFee");
    const courseTypeInput = document.getElementById("courseType");
    const addButton = document.getElementById("formSubmitBtn");
    const tableBody = document.querySelector("#batchTable tbody");
    const batchForm = document.getElementById("batchForm");
    const adminTh = document.getElementById("adminth");
    const computerCourseSelect = document.getElementById("computerCourse");
    const englishCourseSelect = document.getElementById("englishCourse");
    const user = JSON.parse(localStorage.getItem("userData")) || [];
    const modal = new bootstrap.Modal(document.getElementById("addBatchModal"));

    const toast = new bootstrap.Toast(document.getElementById("toastMessage"));
    const toastBody = document.getElementById("toastBody");
    const toastElement = document.getElementById("toastMessage");

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
    const isSuperAdmin = user[0]?.designation === "supremeadmin";

    let batchList = [];
    let originalBatchList = [];

    window.addEventListener("DOMContentLoaded", loadBatches);

    async function loadBatches() {
    
      try {
        let res;
        if (isSuperAdmin) {
          console.log('super')
          res = await api.get(`/batch/all`);
          console.log(res)
        } else {
          console.log('working')
          res = await api.get(`/batch/getByCampus/${user[0].campus._id}`);
        }
        batchList = res.data.data;
        originalBatchList = [...batchList];
        renderTable();
      } catch (err) {
        console.error("Error loading batches:", err);
      }
    }

    function renderTable() {
      tableBody.innerHTML = "";
      adminTh.style.display = isSuperAdmin ? 'block' : 'none';

      if (batchList.length > 0) {
        batchList.forEach((batch, i) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${i + 1}</td>
            <td>${batch?.name}</td>
            <td>${batch.timings}</td>
            <td>${batch.fee}</td>
            <td>${batch.courseType}</td>
            <td>${batch.courseName?.name || 'N/A'}</td>
            ${isSuperAdmin ? `<td>${batch.campusId?.name || 'N/A'}</td>` : ''}
            <td>
              <button class="btn btn-sm btn-info me-1" onclick="editBatch('${batch._id}')">✏️</button>
              <button class="btn btn-sm btn-danger" onclick="deleteBatch('${batch._id}')">🗑️</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      } else {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No batches found</td></tr>`;
      }
    }

    async function deleteBatch(id) {
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
        const res = await api.delete(`/batch/delete/${id}`);
        batchList = batchList.filter(b => b._id !== id);
        originalBatchList = originalBatchList.filter(b => b._id !== id);
        showToast(res.data.message || "Deleted successfully");
        renderTable();
      } catch (err) {
        console.error("Failed to delete batch:", err);
        showToast("Failed to delete batch", false);
      }
    }

    // Add / Update Batch
    addButton.addEventListener("click", async (e) => {
      e.preventDefault();

      const name = batchNameInput.value.trim();
      const timings = batchTimingsInput.value.trim();
      const fee = batchFeeInput.value.trim();
      const courseType = courseTypeInput.value.trim();

      if (!name || !timings || !fee || !courseType) {
        alert("Please fill all fields");
        return;
      }
    const createdBy = user[0]._id

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
      var selectedCourse = null;
      if(courseType === 'computer'){
         selectedCourse = computerCourseSelect.value;
        if(!selectedCourse){
          alert("Please select a computer course");
          return;
        }
      } else if(courseType === 'english'){
         selectedCourse = englishCourseSelect.value;
        if(!selectedCourse){
          alert("Please select an english course");
          return;
        }
      }
      var courseName = selectedCourse ? (courseType === 'computer' ? computerCourseSelect.options[computerCourseSelect.selectedIndex].value : englishCourseSelect.options[englishCourseSelect.selectedIndex].value) : '';

      try {
        if (isEditing) {
          console.log(courseName)
          const res = await api.put(`/batch/update/${editingId}`, {
            name, timings, fee,   courseType, courseName, campusId
          });
          const { data, message } = res.data;
          const index = batchList.findIndex(s => s._id === editingId);
          console.log(data)
          batchList[index] = data;
          originalBatchList[index] = data;
          showToast(message || "Batch updated successfully");
        } else {
          const res = await api.post(`/batch/add`, {
            name, timings, fee, courseType, courseName, campusId , createdBy
          });
          const { data, message } = res.data;
          console.log(data ,message)
          if (data && data._id) {
            batchList.push(data);
            originalBatchList.push(data);
          }
          showToast(message, true);
        }

        isEditing = false;
        editingId = null;
        batchForm.reset();
        addButton.textContent = "Add Batch";
        document.getElementById("addBatchModalLabel").textContent = "Add New Batch";
        modal.hide();

        renderTable();
      } catch (err) {
        console.error("Error adding batch:", err.response?.data?.message || err.message);
        showToast(err.response?.data?.message || "Failed to add batch", false);
      }
    });

    window.deleteBatch = deleteBatch;

    window.editBatch = async function (id) {
      const batchData = batchList.find(b => b._id === id);
      if (!batchData) {
        showToast("Batch not found", false);
        return;
      }

      isEditing = true;
      editingId = id;
      batchNameInput.value = batchData.name;
      batchTimingsInput.value = batchData.timings;
      batchFeeInput.value = batchData.fee;
      courseTypeInput.value = batchData.courseType;
      if (isSuperAdmin) document.getElementById("campusDropdown").value = batchData.campusId._id;
     await handlefillDropDown(batchData.campusId._id)
     await handleDropDownDisplay(batchData.courseType)
      if(batchData.courseType === 'computer'){
        computerCourseSelect.value = batchData.courseName._id
      } else if(batchData.courseType === 'english'){
        englishCourseSelect.value = batchData.courseName._id
      }

      document.getElementById("addBatchModalLabel").innerText = "Update Batch";
      formSubmitBtn.innerText = "Update Batch";
      modal.show();
    }

    document.getElementById("addBatchModal").addEventListener("hidden.bs.modal", () => {
      batchForm.reset();
      isEditing = false;
      editingId = null;
      addButton.textContent = "Add Batch";
      document.getElementById("addBatchModalLabel").textContent = "Add New Batch";
    });
    let filteredBatchList = originalBatchList
    let selectedcampusId = '';


    const searchcampusInput = document.getElementById('searchBatch');
    // 👇 campus dropdown filter
    if (isSuperAdmin) {
      searchcampusInput.addEventListener('input', () => {
        const searchTerm = searchcampusInput.value.toLowerCase().trim();

        // Apply both filters: campus + search text
        filteredBatchList = originalBatchList.filter(cls =>
          (selectedcampusId === '' || cls.campusId._id === selectedcampusId) &&
          cls.name.toLowerCase().includes(searchTerm)
        );

        batchList = filteredBatchList;
        renderTable();
      });

      console.log(campusSelectBox1)
      campusSelectBox1.addEventListener('change', (e) => {
        selectedcampusId = e.target.value; // Save selected campus
        console.log(selectedcampusId)
        const searchTerm = searchcampusInput.value.toLowerCase().trim();

        // Apply both filters: campus + search text
        filteredBatchList = originalBatchList.filter(cls =>
          (selectedcampusId === '' || cls.campusId._id === selectedcampusId) &&
          cls.name.toLowerCase().includes(searchTerm)
        );

        batchList = filteredBatchList;
        renderTable();
      });
    }

    // API endpoints
    const computerCourseApi = `/course/getbyCampus/${user[0].campus?._id}`;
    const englishCourseApi = `/api/english-courses/getByCampus/${user[0].campus?._id}`;

    // Function to fill dropdown
    async function fillDropdown(apiUrl, dropdownId) {
      try {
        const res = await api.get(apiUrl);
        const data = res.data.data; // backend se response
        console.log(data)
        const dropdown = document.getElementById(dropdownId);

        // Clear old options (except default)
        dropdown.innerHTML = '<option value="">-- Select Option --</option>';

        data.forEach(item => {
          const option = document.createElement("option");
          option.value = item._id;       // assuming backend gives _id
          option.textContent = item.name // assuming backend gives name
          dropdown.appendChild(option);
        });

      } catch (error) {
        console.error(`Error loading ${dropdownId}:`, error);
      }
    }

    // Page load pr dropdowns fill karo
    if (!isSuperAdmin) {

      window.onload = () => {
        fillDropdown(computerCourseApi, "computerCourse");
        fillDropdown(englishCourseApi, "englishCourse");
      };
    }

    campusSelectBox2.addEventListener('change', (e) => {
      var selectedCampus = e.target.value
      if (selectedCampus) {
       handlefillDropDown(selectedCampus)
      }
    })
       courseTypeInput.addEventListener('change', (e) => {
      const selectedType = e.target.value;
     handleDropDownDisplay(selectedType)
    });

   async function handlefillDropDown(selectedCampus){
       await fillDropdown(`/course/getbyCampus/${selectedCampus}`, "computerCourse");
       await fillDropdown(`/english-courses/getbyCampus/${selectedCampus}`, "englishCourse");
    }

   async function handleDropDownDisplay(selectedType){
 if (selectedType === 'computer') {
        document.getElementById('computerCourseContainer').style.display = 'block';
        document.getElementById('englishCourseContainer').style.display = 'none';
      } else if (selectedType === 'english') {
        document.getElementById('computerCourseContainer').style.display = 'none';
        document.getElementById('englishCourseContainer').style.display = 'block';
      } else {
        document.getElementById('computerCourseContainer').style.display = 'none';
        document.getElementById('englishCourseContainer').style.display = 'none';
      }
    }