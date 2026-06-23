console.log(window.location.origin); // ye tumhara actual origin batayega
console.log(document.cookie);

  const loader = document.getElementById("loader");

  const showLoader = () => loader.style.display = "flex";
  const hideLoader = () => loader.style.display = "none";

  // Hide loader after page load
  window.addEventListener("load", () => setTimeout(hideLoader, 300));
const showToast = (icon, message) => {
  Swal.fire({
    icon: icon,              // success | error | warning | info
    title: message,
    text: icon === "success"
      ? "You are being redirected to your dashboard."
      : "Please check your credentials and try again.",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    backdrop: true,
    customClass: {
      popup: 'rounded-xl shadow-lg',
      title: 'text-base font-semibold',
    }
  });
};


  document.getElementById('login').addEventListener('click', async () => {
    const email = document.getElementById('loginemail').value.trim();
    const password = document.getElementById('loginpassword').value.trim();

    if (!email || !password) {
      return showToast('warning', 'Please enter email and password');
    }

    try {
      showLoader();
      const res = await axios.post('http://localhost:3000/api/user/login', { email, password }, { withCredentials: true });
      const userData = res.data.data;

      showToast('success', res.data.message || 'Login successful!');

      if (userData) {
        console.log(userData)
        localStorage.setItem('userData', JSON.stringify(userData));
        setTimeout(() => {
          window.location.href = ' ../dashboard.html';
        }, 800);
      }
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Login failed. Try again.');
    } finally {
      hideLoader();
    }
  });
