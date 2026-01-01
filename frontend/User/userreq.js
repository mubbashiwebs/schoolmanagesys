 
      function showLoader() {
    document.getElementById("loader").style.display = "flex";
  }

  // Hide loader
  function hideLoader() {
    document.getElementById("loader").style.display = "none";
  }

  // Auto show on page load
  window.addEventListener("load", () => {
    // Optional delay to simulate loading
    setTimeout(hideLoader, 300); // hide after 0.5s
  });

    const form = document.getElementById("registerForm");
    const userIdDisplay = document.getElementById("userIdDisplay");
    const copySection = document.getElementById("copySection");

    function showToast(type, message) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      copySection.style.display = "none";

      const formData = new FormData(form);
      const body = {};
      formData.forEach((val, key) => body[key] = val);

      try {
        showLoader()
        const res = await axios.post("http://202.143.127.181:3001/api/auth/register", body);
        const data = res.data;

        showToast('success', data.message || "Registered successfully! Check email.");

        // if (data.userId) {
        //   userIdDisplay.textContent = data.userId;
        //   copySection.style.display = "flex";
        // }
        hideLoader()
        form.reset();

      } catch (err) {
        
        const errorMessage = err.response?.data?.message || "Something went wrong.";
        showToast('error', errorMessage);
        hideLoader()
      }
    });

    function copyUserId() {
      const idText = userIdDisplay.textContent;
      navigator.clipboard.writeText(idText).then(() => {
        showToast('success', 'User ID copied to clipboard!');
      });
    }
