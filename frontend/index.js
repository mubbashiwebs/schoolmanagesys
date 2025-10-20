
//   const user = JSON.parse(localStorage.getItem("userData")) || [];

// const isSuperAdmin = user[0]?.designation === "superadmin";
  console.log(isSuperAdmin)
const sidebar = document.getElementById("sidebar");
var navContent = document.getElementById('navContent')
// navContent.innerHTML = `
// <nav class="navbar navbar-expand-lg bg-white w-100 m-0 p-0 border-bottom">
//   <div class="container-fluid m-0 p-2">
//     <a class="navbar-brand fw-bold fs-3" href="#">School Management</a>

//     <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
//       <span class="navbar-toggler-icon"></span>
//     </button>

//     <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
//       <ul class="navbar-nav mb-2 mb-lg-0">
//         <li class="nav-item dropdown">
//           <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" data-bs-toggle="dropdown">
//             <span class="me-3">${user[0].username} | ${user[0].designation}</span>
//             <img src="https://i.pravatar.cc/40" class="rounded-circle" width="40" height="40" alt="User">
//           </a>
//           <ul class="dropdown-menu dropdown-menu-end">
//             <li><a class="dropdown-item" href="#">Profile</a></li>
//             <li><hr class="dropdown-divider"></li>
//             <li><a class="dropdown-item text-danger" href="#">Logout</a></li>
//           </ul>
//         </li>
//       </ul>
//     </div>
//   </div>
// </nav>
// `;


const allLinks = {
  // dashboard: { name: "Dashboard", file: "Dashboard.html" },
  addclass: { name: "Add Class", file: "classform.html", active:false },
  addsection: { name: "Add Section", file: "section.html", active:false },
  addsubject: { name: "Add Subject", file: "subject.html", active:false },
addCampus: { name: "Add Campus", file: "campus.html", active: false },
addBatch: { name: "Add Batch", file: "batch.html", active: false },

  addcomputercourse: { name: "Add Computer Course", file: "compcourse.html", active:false },
  addenglangcourse: { name: "Add English lang Course", file: "englangcourse.html", active:false },

  addstudent: { name: "Student Form", file: "student.html", active:false },
  studentlist: { name: "Student List", file: "studentlist.html" , active:false},
  addteacher: { name: "Teacher Form", file: "teacher.html",  active:false},
  teacherlist: { name: "Teacher List", file: "teacherlist.html" , active:false},
  teacherSalary: { name: "Teacher Salary", file: "teacherSalary.html" , active:false},
  adduser: { name: "Add User", file: "userform.html" , active:false}



};
if(user.length > 0 || !user == null){
function renderSidebar(user) {
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();
  console.log(currentPage)
  sidebar.innerHTML = `<a class='' href="Dashboard.html">Dashboard</a>`;
  
  if(isSuperAdmin){
    // sidebar.innerHTML += `<a href="schoolform.html">Add School</a>`;
  }

  for (const key in allLinks) {

      if (user[0].allowedPages.includes(key)) {
        console.log(key)
        sidebar.innerHTML += `<a href="${allLinks[key].file}" class="${allLinks[key].active?'active':''}">${allLinks[key].name}</a>`;
      }
    
  }

  sidebar.innerHTML += `<a href="#">Logout</a>`;
  

  // ✅ Check current page access
  let isAllowed = false;

  if (isSuperAdmin) {
    isAllowed = true;
  } else {
    for (const key of user[0].allowedPages) {
      console.log(key)
      if (allLinks[key] && allLinks[key].file.toLowerCase() === currentPage) {
        console.log(key)
        isAllowed = true;
        break;
      }
    }
  }
  console.log(isAllowed)
  if (!isAllowed && currentPage !== "dashboard.html") {
    // window.location.href = "Dashboard.html";
  }
}
}
renderSidebar(user);
