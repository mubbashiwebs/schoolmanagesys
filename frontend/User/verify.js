
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
    setTimeout(hideLoader, 1000); // hide after 1s
  });

    async function verifyEmail() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      try {
        // showLoader()
        const res = await axios.get(`http://202.143.127.181:3001/api/auth/verify-email?token=${token}`);
        
        document.getElementById("icon").innerHTML = `<div class="success-icon">✅</div>`;
        document.getElementById("card-title").innerText = "Email Verified Successfully!";
        document.getElementById("card-message").innerText = "You can now proceed with school registration.";

        document.getElementById("userId").value = res.data.userId;
        document.getElementById("userIdContainer").classList.remove("d-none");

        const link = document.getElementById("action-link");
        link.innerText = "Go to School Registration";
        link.href = "schoolreq.html";

        document.getElementById("card-container").classList.remove("d-none");

        showToast("Email verified successfully!", true);
        // hideLoader()
      } catch (err) {
        console.error(err);
        const data = err.response?.data;
        document.getElementById("icon").innerHTML = `<div class="error-icon">❌</div>`;
        document.getElementById("card-title").innerText = "Verification Failed";
        document.getElementById("card-message").innerText = data?.message || "Invalid or expired link.";

        const link = document.getElementById("action-link");
        link.innerText = "Resend Verification Email";
        link.href = "/register.html";

        document.getElementById("card-container").classList.remove("d-none");

        showToast("Verification failed: " + (data?.message || "Unknown error"), false);
        // hideLoader()
      }
    }

    function copyUserId() {
      const userIdInput = document.getElementById("userId");
      navigator.clipboard.writeText(userIdInput.value);
      showToast("User ID copied!", true);
    }

    function showToast(message, isSuccess = true) {
      const toastEl = document.getElementById("toast");
      document.getElementById("toast-message").innerText = message;
      toastEl.classList.remove("bg-success", "bg-danger");
      toastEl.classList.add(isSuccess ? "bg-success" : "bg-danger");

      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }

    verifyEmail();
