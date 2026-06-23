 const backendUrl = "https://lightsteelblue-lark-819414.hostingersite.com";



const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // 👈 ONE TIME
});


 // 🔥 GLOBAL AUTH FAIL HANDLER
  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        // 🔒 Session expire / unauthorized
        alert("Session expired. Please login again.");

        // local storage clear
        localStorage.removeItem("userData");

        // redirect to login
        window.location.href = "/user/login.html";
      }
      return Promise.reject(error);
    }
  );
  authGuard()
// 🔐 PAGE LOAD AUTH CHECK
async function authGuard() {
  // console.log("Running auth guard...");
  try {
  // console.log("Running auth guard...");

   var res = await api.get("/user/"); // protected route
    // user = [res.data.data];
    // console.log(res.data)
    // console.log("Authenticated user:", res.data.data);
    
  } catch (error) {
    // interceptor handle karega
  }
};