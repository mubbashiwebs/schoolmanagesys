
    // -------------------------
    // Configuration & state
    // -------------------------
    const user = JSON.parse(localStorage.getItem("userData")) || [];
    const isSuperAdmin = user[0]?.designation === "supremeadmin";
    let currentCampusId = user[0]?.campus?._id || '';
    let allotments = [];
    let originalAllotments = [];
    let classesList = [];
    let sectionsList = [];
    let subjectsList = [];

    // API endpoints (from your confirmation)
    const API_CLASS = (schoolId, campusId) => `/class/getByCampus/${campusId}`;
    const API_SECTION = (schoolId, campusId) => `/section/getByCampus/${campusId}`;
    const API_SUBJECT = (schoolId, campusId) => `/subject/getByCampus/${campusId}`;
    const API_TEACHER = `/teacher/getById`;
    const API_SUBJECT_ALLOT = "/subject-allotments";

    // Elements
    const allotmentTbody = document.getElementById("allotmentTableBody");
    const toastEl = document.getElementById("toastMessage");
    const toastBody = document.getElementById("toastBody");
    const toast = new bootstrap.Toast(toastEl);
    const modalEl = document.getElementById("subjectAllotmentModal");
    const modal = new bootstrap.Modal(modalEl);
    const form = document.getElementById("allotmentForm");
    const formSubmitBtn = document.getElementById("formSubmitBtn");
    const formBtnText = document.getElementById("formBtnText");
    const formSpinner = document.getElementById("formSpinner");
    const getTeacherBtn = document.getElementById("getTeacherBtn");
    const getTeacherSpinner = document.getElementById("getTeacherSpinner");
    const globalSpinner = document.getElementById("globalSpinner");

    // Filters / inputs
    const campusDropdown = document.getElementById("campusDropdown");
    const modalCampusDropdown = document.getElementById("modalCampusDropdown");
    const campusSelectBoxTop = document.getElementById("campusSelectBoxTop");
    const campusDropdownContainer = document.getElementById("campusDropdownContainer");
    const campusHeader = document.getElementById("campusHeader");
    const filterClass = document.getElementById("filterClass");
    const filterSection = document.getElementById("filterSection");
    const searchInput = document.getElementById("searchInput");

    // Form inputs
    const classIdSelect = document.getElementById("classId");
    const sectionIdSelect = document.getElementById("sectionId");
    const subjectIdSelect = document.getElementById("subjectId");
    const teacherIdInput = document.getElementById("teacherIdInput");
    const teacherHidden = document.getElementById("teacherId");
    const teacherNameInput = document.getElementById("teacherName");
    const isClassTeacherCheckbox = document.getElementById("isClassTeacher");
    const modalTitle = document.getElementById("modalTitle");

    // -------------------------
    // Helpers
    // -------------------------
    function showToast(message, success = true) {
      toastBody.textContent = message;
      toastEl.classList.remove("bg-success", "bg-danger");
      toastEl.classList.add(success ? "bg-success" : "bg-danger");
      toast.show();
    }

    function toggleGlobalSpinner(show = true) {
      globalSpinner.style.display = show ? "flex" : "none";
    }

    function toggleFormLoading(show = true) {
      formSpinner.style.display = show ? "inline-block" : "none";
      formBtnText.style.display = show ? "none" : "inline-block";
      formSubmitBtn.disabled = show;
    }

    function toggleGetTeacherLoading(show = true) {
      getTeacherSpinner.style.display = show ? "inline-block" : "none";
      getTeacherBtn.disabled = show;
    }

    function fillSelect(selectEl, list, labelField = 'name', includeDefault = true) {
      if (!selectEl) return;
      selectEl.innerHTML = includeDefault ? '<option value="">Select</option>' : '';
      list.forEach(item => {
        const label = labelField.split('.').reduce((o,k)=>o?.[k], item) ?? item[labelField];
        selectEl.innerHTML += `<option value="${item._id}">${label}</option>`;
      });
    }

    // -------------------------
    // Data loading
    // -------------------------
    async function loadDropdownsForCampus(schoolId, campusId, forModal = true) {
      try {
        const [cRes, sRes, subRes] = await Promise.all([
          api.get(API_CLASS(schoolId, campusId)),
          api.get(API_SECTION(schoolId, campusId)),
          api.get(API_SUBJECT(schoolId, campusId)),
        ]);

        classesList = cRes.data?.data ?? [];
        sectionsList = sRes.data?.data ?? [];
        subjectsList = subRes.data?.data ?? [];

        // fill modal selects
        fillSelect(classIdSelect, classesList, "name");
        fillSelect(sectionIdSelect, sectionsList, "name");
        fillSelect(subjectIdSelect, subjectsList, "name");

        // fill filter selects (top)
        fillSelect(filterClass, classesList, "name");
        fillSelect(filterSection, sectionsList, "name");
      } catch (err) {
        console.error("Error loading dropdowns:", err);
        showToast("Failed to load dropdown data", false);
      }
    }

    async function loadCampusesForSuperAdmin() {
      // If you maintain campus list endpoint, replace URL accordingly.
      // Here we assume campus list is under /api/campus/getBySchool/:schoolId
      try {
        const schoolId = user[0]?.school?._id;
        if (!schoolId) return;
        const res = await api.get(`/campus/getBySchool`);
        const campuses = res.data ?? [];
        console.log("Loaded campuses for superadmin:", campuses);
        // populate top and modal campus dropdown
        fillSelect(campusDropdown, campuses, "name");
        fillSelect(modalCampusDropdown, campuses, "name");
      } catch (err) {
        console.error("Failed to load campuses:", err);
        showToast("Failed to load campuses", false);
      }
    }

    async function loadAllotments() {
      try {
        toggleGlobalSpinner(true);
        // Optionally apply campus filter server-side if available
        const res = await api.get(`${API_SUBJECT_ALLOT}/`);
        allotments = res.data?.data ?? res.data ?? [];
        originalAllotments = [...allotments];
        renderAllotmentTable();
      } catch (err) {
        console.error("Failed to load allotments:", err.response.data.error || err);
        showToast("Failed to load allotments", false);
      } finally {
        toggleGlobalSpinner(false);
      }
    }

    // -------------------------
    // Rendering table
    // -------------------------
    function renderAllotmentTable(list = allotments) {
      allotmentTbody.innerHTML = "";
      if (!list || list.length === 0) {
        allotmentTbody.innerHTML = `<tr><td colspan="8" class="text-center">No allotments found</td></tr>`;
        return;
      }

      list.forEach((allot, idx) => {
        const teacherLabel = allot.teacherId ? (allot.teacherId.teacherName || allot.teacherId.name || allot.teacherId?.name) : "N/A";
        const isClassTeacher = allot.isClassTeacher ? "✅ Yes" : "❌ No";
        const campusName = allot.campusId?.name || (allot.classId?.campusId?.name) || "N/A";

        allotmentTbody.innerHTML += `
          <tr>
            <td>${idx+1}</td>
            <td>${allot.classId?.name ?? 'N/A'}</td>
            <td>${allot.sectionId?.name ?? 'N/A'}</td>
            <td>${allot.subjectId?.name ?? allot.subjectId?.name ?? 'N/A'}</td>
            <td>${teacherLabel}</td>
            <td>${isClassTeacher}</td>
            ${isSuperAdmin ? `<td>${campusName}</td>` : ''}
            <td>
              <button class="btn btn-sm btn-info me-1" onclick="editAllotment('${allot._id}')"><i class="fa fa-edit"></i></button>
              <button class="btn btn-sm btn-danger" onclick="deleteAllotment('${allot._id}')"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        `;
      });
    }

    // -------------------------
    // CRUD operations
    // -------------------------
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      toggleFormLoading(true);
    const createdBy = user[0]._id

      const payload = {
        classId: classIdSelect.value,
        sectionId: sectionIdSelect.value,
        subjectId: subjectIdSelect.value,
        teacherId: teacherHidden.value || null,
        isClassTeacher: isClassTeacherCheckbox.checked,
        campusId: isSuperAdmin ? (modalCampusDropdown.value || null) : currentCampusId,
        createdBy

      };

      // basic validation
      if (!payload.classId || !payload.sectionId || !payload.subjectId) {
        showToast("Please select class, section and subject", false);
        toggleFormLoading(false);
        return;
      }

      try {
        const editId = form.editId;
        if (editId) {
          const res = await api.put(`${API_SUBJECT_ALLOT}/${editId}`, payload);
          showToast(res.data?.message || "Allotment updated");
        } else {
          const res = await api.post(`${API_SUBJECT_ALLOT}`, payload);
          showToast(res.data?.message || "Allotment created");
        }
        form.reset();
        form.editId = null;
        modal.hide();
        await loadAllotments();
      } catch (err) {
        console.error("Save allotment error:", err.response.data.message || err.message  );
        showToast("Failed to save allotment", false);
      } finally {
        toggleFormLoading(false);
      }
    });

    window.editAllotment = async function(id) {
      try {
        toggleGlobalSpinner(true);
        const res = await api.get(`${API_SUBJECT_ALLOT}/${id}`);
        const allot = res.data?.data ?? res.data;

        // If superadmin, set campus in modal and reload dropdowns for that campus
        if (isSuperAdmin) {
          modalCampusDropdown.value = allot.campusId?._id || '';
          await loadDropdownsForCampus(user[0].school._id, modalCampusDropdown.value || currentCampusId);
          campusDropdown.value = modalCampusDropdown.value || campusDropdown.value;
        } else {
          await loadDropdownsForCampus(user[0].school._id, currentCampusId);
        }

        classIdSelect.value = allot.classId?._id || '';
        sectionIdSelect.value = allot.sectionId?._id || '';
        subjectIdSelect.value = allot.subjectId?._id || '';
        teacherHidden.value = allot.teacherId?._id || '';
        teacherIdInput.value = allot.teacherId?.staffCode || '';
        teacherNameInput.value = allot.teacherId?.teacherName || allot.teacherId?.name || '';
        isClassTeacherCheckbox.checked = allot.isClassTeacher;

        form.editId = id;
        modalTitle.textContent = "Update Subject Allotment";
        formSubmitBtn.querySelector('#formBtnText').textContent = "Update";
        modal.show();
      } catch (err) {
        console.error("Failed to fetch allotment:", err);
        showToast("Failed to fetch allotment", false);
      } finally {
        toggleGlobalSpinner(false);
      }
    };

    window.deleteAllotment = async function(id) {
      if (!confirm("Are you sure you want to delete this allotment?")) return;
      try {
        toggleGlobalSpinner(true);
        const res = await api.delete(`${API_SUBJECT_ALLOT}/${id}`);
        showToast(res.data?.message || "Deleted successfully");
        await loadAllotments();
      } catch (err) {
        console.error("Failed to delete allotment:", err);
        showToast("Failed to delete allotment", false);
      } finally {
        toggleGlobalSpinner(false);
      }
    };

    // -------------------------
    // Teacher fetch logic (Get Teacher)
    // -------------------------
    getTeacherBtn.addEventListener("click", async () => {
      const idVal = teacherIdInput.value.trim();
      if (!idVal) return alert("Enter teacher id");

      try {
        toggleGetTeacherLoading(true);
        // If your teacher endpoint requires school/campus in body, add them as earlier implementation did
        const payload = { staffCode: idVal };
        const res = await api.post(API_TEACHER, payload);
        const teacher = res.data?.data ?? res.data;
        if (!teacher) {
          showToast("Teacher not found", false);
          return;
        }
        teacherHidden.value = teacher._id;
        teacherNameInput.value = `${teacher.name || teacher.teacherName || ''} ${teacher.fatherName || ''}`.trim();
        showToast("Teacher loaded");
      } catch (err) {
        console.error("Failed to get teacher:", err.message || err.response.data.message);
        showToast("Failed to get teacher", false);
      } finally {
        toggleGetTeacherLoading(false);
      }
    });

    // -------------------------
    // Filters and search
    // -------------------------
    searchInput.addEventListener("input", () => applyFilters());
    filterClass.addEventListener("change", () => applyFilters());
    filterSection.addEventListener("change", () => applyFilters());

    function applyFilters() {
      const q = (searchInput.value || "").toLowerCase().trim();
      const selClass = filterClass.value;
      const selSection = filterSection.value;

      let filtered = originalAllotments.filter(a => {
        // campus filter if superadmin and campus dropdown top is used
        if (isSuperAdmin && campusDropdown.value) {
          if ((a.campusId?._id || a.campusId) !== campusDropdown.value) return false;
        }

        // class filter
        if (selClass && (a.classId?._id !== selClass)) return false;
        // section filter
        if (selSection && (a.sectionId?._id !== selSection)) return false;

        if (!q) return true;

        const className = (a.classId?.name || "").toLowerCase();
        const sectionName = (a.sectionId?.name || "").toLowerCase();
        const subjectName = (a.subjectId?.subjectName || a.subjectId?.name || "").toLowerCase();
        const teacherName = (a.teacherId?.teacherName || a.teacherId?.name || "").toLowerCase();

        return className.includes(q) || sectionName.includes(q) || subjectName.includes(q) || teacherName.includes(q);
      });

      allotments = filtered;
      renderAllotmentTable();
    }

    // When campus changes (superadmin), reload dropdowns and allotments
    campusDropdown?.addEventListener?.("change", async (e) => {
      const val = e.target.value;
      if (!val) return;
      currentCampusId = val;
      // reload dropdowns for top filters/modal
      await loadDropdownsForCampus(user[0].school._id, currentCampusId);
      // reload allotments from server or filter client-side if you prefer server-side
      await loadAllotments();
    });

    modalCampusDropdown?.addEventListener?.("change", async (e) => {
      const val = e.target.value;
      if (val) {
        await loadDropdownsForCampus(user[0].school._id, val);
      }
    });

    // Reset modal on close
    modalEl.addEventListener("hidden.bs.modal", () => {
      form.reset();
      form.editId = null;
      modalTitle.textContent = "Add Subject Allotment";
      formSubmitBtn.querySelector('#formBtnText').textContent = "Save";
      teacherHidden.value = '';
      teacherIdInput.value = '';
      teacherNameInput.value = '';
    });

    // -------------------------
    // Initialization
    // -------------------------
    (async function init() {
      // if no user stored -> redirect (similar to class form)
      if (!user || user.length === 0) {
        window.location.href = 'Dashboard.html';
        return;
      }

      // display superadmin controls if needed
      console.log(isSuperAdmin)
      if (isSuperAdmin) {
        campusSelectBoxTop.style.display = 'block';
        campusDropdownContainer.style.display = 'block';
        campusHeader.style.display = 'table-cell';
        // load campuses dropdown then select first (or leave empty)
        await loadCampusesForSuperAdmin();
      } else {
        campusSelectBoxTop.style.display = 'none';
        campusDropdownContainer.style.display = 'none';
      }

      // load dropdowns for user's campus initially
      const schoolId = user[0].school._id;
      const campusToLoad = isSuperAdmin ? (modalCampusDropdown.value || currentCampusId) : currentCampusId;
      await loadDropdownsForCampus(schoolId, campusToLoad);

      // load allotments list
      await loadAllotments();

      // fill filter selects might be populated already
      applyFilters();
    })();

    // expose helper functions globally for table buttons
    window.loadAllotments = loadAllotments;
    window.renderAllotmentTable = renderAllotmentTable;
