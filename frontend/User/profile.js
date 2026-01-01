    const user = JSON.parse(localStorage.getItem("userData")) || [];
    const isSuperAdmin = user[0]?.designation === "supremeadmin";

   
    // Helper: safe parse
    function getuserDataArray() {
      try {
        const raw = localStorage.getItem("userData");
        if (!raw) return null;
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr) || arr.length === 0) return null;
        return arr;
      } catch (e) {
        return null;
      }
    }

    function showToast(message) {
      const toastEl = document.getElementById("appToast");
      document.getElementById("toastBody").textContent = message;
      const toast = new bootstrap.Toast(toastEl, { delay: 2400 });
      toast.show();
    }

    // Populate UI from userDataData
    function populateProfile() {
      const arr = getuserDataArray();
      if (!arr) {
        // default fallback
        document.getElementById("username").textContent = "Unknown";
        document.getElementById("email").textContent = "—";
        document.getElementById("contactNo").textContent = "—";
        document.getElementById("role").textContent = "—";
        document.getElementById("campusName").textContent = "—";
        document.getElementById("schoolName").textContent = "—";
        document.getElementById("createdBy").textContent = "—";
        document.getElementById("allowedPagesContainer").innerHTML = '';
        return;
      }

      const userData = arr[0];

      // Basic fields
      document.getElementById("username").textContent = userData.username || "—";
      document.getElementById("email").textContent = userData.email || "—";
      document.getElementById("contactNo").textContent = userData.contactNo || "—";
      document.getElementById("role").textContent = (userData.designation || "—");
      document.getElementById("campusName").textContent = userData.campus?.name || "—";
      document.getElementById("schoolName").textContent = userData.school?.name || "—";
      document.getElementById("createdBy").textContent = userData.createdBy || "—";
      document.getElementById("designation").textContent = userData.designation || "—";

      // lastLogin placeholder (if you have one)
      document.getElementById("lastLogin").textContent = userData.lastLogin || "—";

      // avatar
      const avatarImg = document.getElementById("avatarImg");
      if (userData.profileImage) {
        avatarImg.src = userData.profileImage;
      } else {
        // use seeded pravatar by id to keep consistent avatar
        // const seed = userData._id ? encodeURIComponent(userData._id) : 'default';
        avatarImg.src = `./ipt logo.jpg`;
      }

      // allowed pages
      const pagesContainer = document.getElementById("allowedPagesContainer");
      const pages = Array.isArray(userData.allowedPages) ? userData.allowedPages : [];
      pagesContainer.innerHTML = pages.map(p => `<span class="badge-pill-light">${escapeHtml(p)}</span>`).join("");
    }

    // Escape HTML to avoid injection
    function escapeHtml(s) {
      return String(s)
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'",'&#039;');
    }

    // Initialize form values in Edit modal
    function initEditModal() {
      const arr = getuserDataArray();
      if (!arr) return;
      const userData = arr[0];

      document.getElementById("editAvatarPreview").src = userData.profileImage || `./ipt logo.jpg`;
      document.getElementById("inputusername").value = userData.username || '';
      document.getElementById("inputEmail").value = userData.email || '';
      document.getElementById("inputContact").value = userData.contactNo || '';
      document.getElementById("inputDesignation").value = userData.designation || '';
      document.getElementById("inputSchool").value = userData.school?.name || '';
      document.getElementById("inputCampus").value = userData.campus?.name || '';
    }

    // Validate bootstrap form (simple)
    (function () {
      'use strict';
      window.addEventListener('load', function () {
        // populate UI on load
        populateProfile();
        initEditModal();
      }, false);
    })();

    // Avatar upload preview + read as data URL
    const avatarInput = document.getElementById("avatarInput");
    let avatarDataUrl = null;
    avatarInput?.addEventListener('change', function (e) {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = function (ev) {
        avatarDataUrl = ev.target.result;
        console.log(avatarDataUrl)
        document.getElementById("editAvatarPreview").src = avatarDataUrl;
      };
      reader.readAsDataURL(file);
      console.log(avatarDataUrl)
    });

    // Edit form submit
    document.getElementById("editForm").addEventListener('submit', function (e) {
      e.preventDefault();
      const form = e.target;
      // simple bootstrap validation
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const arr = getuserDataArray() || [];
      if (!arr) {
        showToast("No userData data available to update.");
        return;
      }
      const userData = arr[0];

      const newusername = document.getElementById("inputusername").value.trim();
      const newEmail = document.getElementById("inputEmail").value.trim();
      const newContact = document.getElementById("inputContact").value.trim();

      // basic checks
      if (!newusername || !newEmail) {
        showToast("username & email are required.");
        return;
      }

      // update object
      userData.username = newusername;
      userData.email = newEmail;
      userData.contactNo = newContact;
      console.log(avatarDataUrl)
      if (avatarDataUrl) {
        userData.profileImage = avatarDataUrl;
      }

      // save
      try {
        localStorage.setItem("userDataData", JSON.stringify(arr));
        populateProfile();
        initEditModal();
        // close modal
        const modalEl = document.getElementById('editModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        showToast("Profile updated successfully.");
      } catch (err) {
        console.error(err);
        showToast("Failed to save profile locally.");
      }
    });

    // Password change submit
    document.getElementById("passForm").addEventListener('submit', function (e) {
      e.preventDefault();
      const form = e.target;
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const arr = getuserDataArray() || [];
      if (!arr) {
        showToast("No userData data available.");
        return;
      }
      const userData = arr[0];

      const oldPass = document.getElementById("oldPassword").value;
      const newPass = document.getElementById("newPassword").value;
      const confirmPass = document.getElementById("confirmPassword").value;

      if (newPass !== confirmPass) {
        showToast("New & Confirm passwords do not match.");
        return;
      }

      // demo: comparing with stored plaintext password (server-side required in real app)
      if (String(userData.password || '') !== String(oldPass)) {
        showToast("Old password is incorrect.");
        return;
      }

      // update
      userData.password = newPass;
      try {
        localStorage.setItem("userDataData", JSON.stringify(arr));
        // close modal
        const modalEl = document.getElementById('passwordModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        // clear fields
        document.getElementById("oldPassword").value = '';
        document.getElementById("newPassword").value = '';
        document.getElementById("confirmPassword").value = '';
        showToast("Password updated successfully.");
      } catch (err) {
        console.error(err);
        showToast("Failed to update password locally.");
      }
    });

    // Re-init modal values when opened
    const editModalEl = document.getElementById('editModal');
    editModalEl.addEventListener('show.bs.modal', function () {
      avatarDataUrl = null; // reset pending avatar upload
      // remove previous validation classes
      document.getElementById("editForm").classList.remove('was-validated');
      initEditModal();
    });

    const passModalEl = document.getElementById('passwordModal');
    passModalEl.addEventListener('show.bs.modal', function () {
      // remove validation state
      document.getElementById("passForm").classList.remove('was-validated');
      document.getElementById("oldPassword").value = '';
      document.getElementById("newPassword").value = '';
      document.getElementById("confirmPassword").value = '';
    });

    // Initial populate on script load (again)
    populateProfile();

