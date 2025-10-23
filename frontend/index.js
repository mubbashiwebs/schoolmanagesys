
//   const user = JSON.parse(localStorage.getItem("userData")) || [];

// const isSuperAdmin = user[0]?.designation === "superadmin";
const faLink = document.createElement("link");
faLink.rel = "stylesheet";
faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
document.head.appendChild(faLink);

  console.log(isSuperAdmin)
const sidebar = document.querySelector(".sidebar");
sidebar.classList.toggle("open");


var navContent = document.getElementById('navContent')
 navContent.innerHTML = `<div class="col p-0 ">
 <div class="container-fluid bg-white py-3 border-bottom">
  <div class="row align-items-center">
    <div class="col-md-1 col-2  text-center">
      <div id="sidebarHamburger" title="Open menu" class= " " aria-label="Open menu">
  <i class="fa fa-bars fs-4"></i>
</div>
    </div>
    <div class="col-md-8 col-7">
      <p class="fs-5 text-center fw-bold d-md-none d-block">School Management</p>
      <h3 class="fw-bold text-start d-md-block d-none">School Management</h3>
    </div>
    <div class="col-3 text-end ms-auto ">
       <a class="nav-link dropdown-toggle  justify-content-end text-end m-auto d-flex align-items-center" href="#" data-bs-toggle="dropdown">
            <span class=" me-4 d-none d-md-block">${user[0].username} | ${user[0].designation}</span>
            <img src="https://i.pravatar.cc/40" class="rounded-circle" width="40" height="40" alt="User">
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li class = " me-4 d-block d-md-none">
            <span class="dropdown-item">${user[0].username} | ${user[0].designation}</span>

            </li>
            <li><hr class="dropdown-divider"></li>

            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="#">Logout</a></li>
          </ul>
    </div>
  </div>
 </div>

                      </div>`


// const allLinks = {
//   // dashboard: { name: "Dashboard", file: "Dashboard.html" },
//   addclass: { name: "Add Class", file: "classform.html", active:false },
//   addsection: { name: "Add Section", file: "section.html", active:false },
//   addsubject: { name: "Add Subject", file: "subject.html", active:false },
// addCampus: { name: "Add Campus", file: "campus.html", active: false },
// addBatch: { name: "Add Batch", file: "batch.html", active: false },

//   addcomputercourse: { name: "Add Computer Course", file: "compcourse.html", active:false },
//   addenglangcourse: { name: "Add English lang Course", file: "englangcourse.html", active:false },

//   addstudent: { name: "Student Form", file: "student.html", active:false },
//   studentlist: { name: "Student List", file: "studentlist.html" , active:false},
//   addteacher: { name: "Teacher Form", file: "teacher.html",  active:false},
//   teacherlist: { name: "Teacher List", file: "teacherlist.html" , active:false},
//   teacherSalary: { name: "Teacher Salary", file: "teacherSalary.html" , active:false},
//   adduser: { name: "Add User", file: "userform.html" , active:false}



// };

// const categorizedLinks = {
//   school: {
//     title: "School Management",
//     items: ["addclass","addsection","addsubject","addCampus","addBatch"]
//   },
//   courses: {
//     title: "Courses",
//     items: ["addcomputercourse","addenglangcourse"]
//   },
//   students: {
//     title: "Students",
//     items: ["addstudent","studentlist"]
//   },
//   teachers: {
//     title: "Staff & Users",
//     items: ["addteacher","teacherlist","teacherSalary","adduser"]
//   }
// };

// if(user.length > 0 || !user == null){
// function renderSidebar(user) {
//   const currentPage = window.location.pathname.split("/").pop().toLowerCase();
//   console.log(currentPage)
//   sidebar.innerHTML = `<a class='' href="Dashboard.html">Dashboard</a>`;
  
//   if(isSuperAdmin){
//     // sidebar.innerHTML += `<a href="schoolform.html">Add School</a>`;
//   }

//   // for (const key in allLinks) {

//   //     if (user[0].allowedPages.includes(key)) {
//   //       console.log(key)
//   //       sidebar.innerHTML += `<a href="${allLinks[key].file}" class="${allLinks[key].active?'active':''} ">${allLinks[key].name}</a>`;
//   //       // sidebar.innerHTML+='<hr>'
//   //     }
    
//   // }

//   // sidebar.innerHTML += `<a href="#">Logout</a>`;
//   let index = 0;
//   for (const categoryKey in categorizedLinks) {
//     const cat = categorizedLinks[categoryKey];
//     index++;

//     sidebar.innerHTML += `
//       <div class="dropdown-group">
//         <div class="dropdown-header" data-target="drop-${index}">
//           <span>${cat.title}</span>
//           <span class="arrow">▼</span>
//         </div>
//         <div id="drop-${index}" class="dropdown-links">
//     `;

//     cat.items.forEach(linkKey => {
//       if (user[0].allowedPages.includes(linkKey)) {
//         sidebar.innerHTML += `
//           <a href="${allLinks[linkKey].file}" 
//              class="sidebar-link ps-4 ${allLinks[linkKey].file.toLowerCase() === currentPage ? "active" : ""}">
//              ${allLinks[linkKey].name}
//           </a>
//         `;
//       }
//     });

//     sidebar.innerHTML += `
//         </div>
//       </div>
//     `;
//   }

//   sidebar.innerHTML += `<a href="#" class="sidebar-link text-danger">Logout</a>`;

//   // Toggle dropdown
//   document.querySelectorAll(".dropdown-header").forEach(header => {
//     header.addEventListener("click", () => {
//       const target = document.getElementById(header.dataset.target);
//       target.classList.toggle("open");
//       header.classList.toggle("open");
//     });
//   });
// }

  

  // // ✅ Check current page access
  // let isAllowed = false;

  // if (isSuperAdmin) {
  //   isAllowed = true;
  // } else {
  //   for (const key of user[0].allowedPages) {
  //     console.log(key)
  //     if (allLinks[key] && allLinks[key].file.toLowerCase() === currentPage) {
  //       console.log(key)
  //       isAllowed = true;
  //       break;
  //     }
  //   }
  // }
  // console.log(isAllowed)
  // if (!isAllowed && currentPage !== "dashboard.html") {
  //   // window.location.href = "Dashboard.html";
  // }
// }

// renderSidebar(user);
const allLinks = {
  addclass: { name: "Add Class", file: "classform.html", icon: "fa-solid fa-chalkboard" },
  addsection: { name: "Add Section", file: "section.html", icon: "fa-solid fa-layer-group" },
  addsubject: { name: "Add Subject", file: "subject.html", icon: "fa-solid fa-book-open" },
  addCampus: { name: "Add Campus", file: "campus.html", icon: "fa-solid fa-city" },
  addBatch: { name: "Add Batch", file: "batch.html", icon: "fa-solid fa-users" },

  addcomputercourse: { name: "Add Computer Course", file: "compcourse.html", icon: "fa-solid fa-laptop-code" },
  addenglangcourse: { name: "Add English lang Course", file: "englangcourse.html", icon: "fa-solid fa-language" },

  addstudent: { name: "Student Form", file: "student.html", icon: "fa-solid fa-user-plus" },
  studentlist: { name: "Student List", file: "studentlist.html", icon: "fa-solid fa-list" },

  addteacher: { name: "Teacher Form", file: "teacher.html", icon: "fa-solid fa-user-tie" },
  teacherlist: { name: "Teacher List", file: "teacherlist.html", icon: "fa-solid fa-users" },
  teacherSalary: { name: "Teacher Salary", file: "teacherSalary.html", icon: "fa-solid fa-money-bill" },
  adduser: { name: "Add User", file: "userform.html", icon: "fa-solid fa-user-gear" }
};

/* --- categorized groups --- */
const categorizedLinks = {
  school: {
    title: "School Management",
    icon: "fa-solid fa-building-columns",
    items: ["addclass","addsection","addsubject","addCampus","addBatch"]
  },
  courses: {
    title: "Courses",
    icon: "fa-solid fa-book",
    items: ["addcomputercourse","addenglangcourse"]
  },
  students: {
    title: "Students",
    icon: "fa-solid fa-user-graduate",
    items: ["addstudent","studentlist"]
  },
  teachers: {
    title: "Staff & Users",
    icon: "fa-solid fa-briefcase",
    items: ["addteacher","teacherlist","teacherSalary","adduser"]
  }
};

/* grab elements */
// const sidebar = document.getElementById('appSidebar');
// const sidebarBody = document.getElementById('sidebarBody');
// const overlay = document.getElementById('sidebarOverlay');
const hamb = document.getElementById('sidebarHamburger');
// const closeBtn = document.getElementById('sidebarCloseBtn');

/* user & role detection (reads localStorage, like your original code) */
// const user = JSON.parse(localStorage.getItem("userData")) || [];
// const isSuperAdmin = user[0]?.designation === "superadmin";

/* open/close helpers */
function openSidebar(){
  sidebar.classList.toggle('open');
  // overlay.classList.add('show');
  // sidebar.setAttribute('aria-hidden','false');
}
function closeSidebar(){
  sidebar.classList.remove('open');
  // overlay.classList.remove('show');
  sidebar.setAttribute('aria-hidden','true');
}

/* attach events for SB-1 behavior */
hamb.addEventListener('click', openSidebar);
// closeBtn.addEventListener('click', closeSidebar);
// overlay.addEventListener('click', closeSidebar);

/* render sidebar content with dropdown groups */
function renderSidebar(user){
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();
  // build HTML
  let html = '';

  // Dashboard link (always visible)
  html += `<a href="Dashboard.html" class="sidebar-link ${currentPage === "dashboard.html" ? "active" : ""}">
             <i class="fa-solid fa-gauge-high fa-fw"></i> Dashboard
           </a>`;

  // loop categories
  let groupIndex = 0;
  for (const key in categorizedLinks) {
    const group = categorizedLinks[key];
    groupIndex++;

    // Determine if any item in this group is allowed & exists
    const visibleItems = group.items.filter(k => (isSuperAdmin || (user[0]?.allowedPages || []).includes(k)) && allLinks[k]);
    if (visibleItems.length === 0) continue;

    // Check if currentPage belongs to this group -> auto open (U2)
    const hasActiveItem = visibleItems.some(k => allLinks[k].file.toLowerCase() === currentPage);

    html += `
      <div class="dropdown-group">
        <div class="dropdown-header ${hasActiveItem ? 'open' : ''}" data-target="drop-${groupIndex}">
          <div><i class="${group.icon} fa-fw"></i> ${group.title}</div>
          <div><i class="fa fa-chevron-down chev"></i></div>
        </div>
        <div id="drop-${groupIndex}" class="dropdown-links ${hasActiveItem ? 'open' : ''}">
    `;

    visibleItems.forEach(linkKey => {
      const link = allLinks[linkKey];
      const activeCls = (link.file.toLowerCase() === currentPage) ? 'active' : '';
      html += `<a href="${link.file}" class="sidebar-link ${activeCls}">
                 <i class="${link.icon} fa-fw"></i> ${link.name}
               </a>`;
    });

    html += `</div></div>`;
  }

  // Logout (always visible)
  html += `<a href="#" id="sidebarLogout" class="sidebar-link text-danger"><i class="fa-solid fa-right-from-bracket fa-fw"></i> Logout</a>`;

  sidebar.innerHTML = html;

  // attach dropdown toggles
  document.querySelectorAll('.dropdown-header').forEach(header => {
    header.addEventListener('click', () => {
      const targetId = header.dataset.target;
      const panel = document.getElementById(targetId);
      const isOpen = panel.classList.contains('open');
      if (isOpen) {
        panel.classList.remove('open');
        header.classList.remove('open');
      } else {
        panel.classList.add('open');
        header.classList.add('open');
      }
    });
  });

  // attach logout behavior if you want (example: clear localStorage & redirect)
//   const logoutBtn = document.getElementById('sidebarLogout');
//   if (logoutBtn) {
//     logoutBtn.addEventListener('click', (e) => {
//       e.preventDefault();
//       // customize to your logout logic:
//       localStorage.removeItem('userData');
//       // redirect to login page
//       window.location.href = 'login.html';
//     });
//   }

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

/* initial call (if user missing, still renders groups that are public for superadmin check) */
renderSidebar(user);