// console.log(user)

const currentPage = window.location.pathname.toLowerCase();
  // console.log(currentPage)
const faLink = document.createElement("link");
faLink.rel = "stylesheet";
faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
document.head.appendChild(faLink);

const mobileSidebar = `<div class="offcanvas offcanvas-start  " data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">${user[0].username}</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div class = 'sidebar-sm '> </div>
  </div>
</div>`
document.body.insertAdjacentHTML('beforeend', mobileSidebar);


const sidebar = document.querySelector(".sidebar");
const sidebar_sm = document.querySelector('.sidebar-sm')
sidebar.classList.toggle("open");


var navContent = document.getElementById('navContent')
navContent.innerHTML = `<div class="col position-sticky ">

 <div class="container-fluid bg-white py-3 d-md-none d-block   border-bottom">
  <div class="row align-items-center ">
    <div class=" col-2 text-center">
      <div id="" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions" title="Open menu" class= "m-0 p-0 " aria-label="Open menu">
      <p class = ' m-0 ms-4 fs-4 ' style='cursor:pointer'> 🗂️ </p>
</div>
   </div>
   <div class='col-6 text-center '>
    
      <p class="fs-6 m-0 text-center fw-bold d-md-none d-block">School Management</p>
    </div>
    <div class="col-4  text-center ">
      
      <a class='bg-dark text-white py-1 px-4 text-decoration-none text-dark  rounded cursor pointer' href='/user/profile.html'>Profile</a>
</div>

  </div>
 </div>


 <div class="container-fluid bg-white py-1 d-md-block d-none sticky-top border-bottom">
  <div class="row align-items-center">
    <div class="col-md-6  d-flex align-items-center  text-center">
      <div id="sidebarHamburger" title="Open menu" class= " " aria-label="Open menu">
      <p class = ' ms-4 fs-4 ' style='cursor:pointer'> 🗂️ </p>
</div>
   
    
      <p class="fs-5  text-center fw-bold d-md-none d-block">School Management</p>
      <h3 class="fw-bold text-start ms-4 d-md-block d-none">School Management</h3>
    </div>
    <div class="col-md-6 d-flex justify-content-end align-items-center  ">
      <span class="nav-link d-flex align-items-center">
  👋 Hi, <strong class='ms-1'>${user[0].username}</strong> 
</span>
      <a class='bg-dark text-white text-decoration-none text-dark mx-4  px-4 rounded cursor pointer' href='/user/profile.html'>Profile</a>
</div>

  </div>
 </div>

                      </div>`




const allLinks = {

  // ✅ CLASSES
  addclass: {
    name: "Add Class",
    file: "/classes/classform.html",
    icon: "🏫"
  },
  addCoachClass: {
    name: "Add Coaching Class",
    file: "/classes/coachClass.html",
    icon: "📘"
  },
  addsection: {
    name: "Add Section",
    file: "/classes/section.html",
    icon: "🗂️"
  },
  addsubject: {
    name: "Add Subject",
    file: "/subject/subject.html",
    icon: "📚"
  },

  // ✅ SCHOOL
  addCampus: {
    name: "Add Campus",
    file: "/school/campus.html",
    icon: "🏫"
  },

  // ✅ COURSES
  addBatch: {
    name: "Add Batch",
    file: "/courses/batch.html",
    icon: "👥"
  },
  addcomputercourse: {
    name: "Add Computer Course",
    file: "/courses/compcourse.html",
    icon: "💻"
  },
  addenglangcourse: {
    name: "Add English lang Course",
    file: "/courses/englangcourse.html",
    icon: "🗣️"
  },

  // ✅ STUDENT
  addstudent: {
    name: "Student Form",
    file: "/students/student.html",
    icon: "🧑‍🎓"
  },
  studentlist: {
    name: "Student List",
    file: "/students/studentlist.html",
    icon: "📋"
  },

  // ✅ STAFF
  addteacher: {
    name: "Teacher Form",
    file: "/staff/teacher.html",
    icon: "👨‍🏫"
  },
  teacherlist: {
    name: "Teacher List",
    file: "/staff/teacherlist.html",
    icon: "🧑‍🏫"
  },
  teacherSalary: {
    name: "Teacher Salary",
    file: "/staff/teacherSalary.html",
    icon: "💵"
  },

  // ✅ USER
  adduser: {
    name: "Add User",
    file: "/user/userform.html",
    icon: "👤"
  },

  // ✅ VOUCHERS
  createVoucher: {
    name: "Create Voucher",
    file: "/vouchers/vouchers.html",
    icon: "🎟️"
  },

  printVouchers: {
    name: "Print Vouchers",
    file: "/vouchers/printVoucher.html",
    icon: "🖨️"
  },
  stdlegderReport: {
    name: "Ledger Report",
    file: "/students/ledgerReport.html",
    icon: "📒"
  },
  CampusStdReport: {
    name: "Campus Std Report",
    file: "/students/stdCampuswisereoprt.html",
    icon: "📊"
  },
  stdClassMigration: {
    name: "Student Migration",
    file: "/students/stdClassMigration.html",
    icon: "🔀"
  },
  receipt: {
    name: "Receipt",
    file: "/receipts/receipt.html",
    icon: "🧾"
  }


};

/* --- categorized groups --- */
const categorizedLinks = {
  school: {
    title: "School Management",
    icon: "🏫",
    items: ["addclass", "addsection", "addsubject", "addCampus", "addBatch", "addCoachClass"]
  },
  courses: {
    title: "Courses",
    icon: "📚",
    items: ["addcomputercourse", "addenglangcourse"]
  },
  students: {
    title: "Students",
    icon: "🧑‍🎓",
    items: ["addstudent", "studentlist"]
  },
  teachers: {
    title: "Staff & Users",
    icon: "💼",
    items: ["addteacher", "teacherlist", "teacherSalary", "adduser"]
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
function openSidebar() {
  sidebar.classList.toggle('open');
  // overlay.classList.add('show');
  // sidebar.setAttribute('aria-hidden','false');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  // overlay.classList.remove('show');
  sidebar.setAttribute('aria-hidden', 'true');
}

/* attach events for SB-1 behavior */
hamb.addEventListener('click', ()=>{
  openSidebar()
  // console.log('working')
}
);

// closeBtn.addEventListener('click', closeSidebar);
// overlay.addEventListener('click', closeSidebar);

/* render sidebar content with dropdown groups */
function renderSidebar(user) {
  // build HTML
  let html = '';

  // Dashboard link (always visible)
  html += `<a href="../dashboard.html" class="sidebar-link ${currentPage === "dashboard.html" ? "active" : ""}">
           📊 Dashboard
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
          <div>${group.icon} ${group.title}</div>
          <div><i class="fa fa-chevron-down chev"></i></div>
        </div>
        <div id="drop-${groupIndex}" class="dropdown-links ${hasActiveItem ? 'open' : ''}">
    `;

    visibleItems.forEach(linkKey => {
      const link = allLinks[linkKey];
      const activeCls = (link.file.toLowerCase() === currentPage) ? 'active' : '';
      html += `<a href="${link.file}" class="sidebar-link ${activeCls}">
                 ${link.icon} ${link.name}
               </a>`;
    });

    html += `</div></div>`;
  }

  // Logout (always visible)
  html += `<a href="#" id="sidebarLogout" class="sidebar-link text-danger"><i class="fa-solid fa-right-from-bracket fa-fw"></i> Logout</a>`;

  sidebar.innerHTML = html;
  sidebar_sm.innerHTML = html
  attachDropdownHandlers(sidebar)
  attachDropdownHandlers(sidebar_sm)


  // attach dropdown toggles

  function attachDropdownHandlers(container) {
    container.querySelectorAll('.dropdown-header').forEach(header => {
      header.addEventListener('click', () => {
        const targetId = header.dataset.target;
        const panel = container.querySelector(`#${targetId}`);
        const isOpen = panel.classList.contains('open');
        if (isOpen) {
          panel.classList.remove('open');
          header.classList.remove('open');
        } else {
          // optional: close all other open dropdowns in the same sidebar
          container.querySelectorAll('.dropdown-links.open').forEach(p => p.classList.remove('open'));
          container.querySelectorAll('.dropdown-header.open').forEach(h => h.classList.remove('open'));

          panel.classList.add('open');
          header.classList.add('open');
        }
      });
    });
  }




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
      // // console.log(user[0])
      // // console.log(currentPage)
      // // console.log(allLinks[key].file.toLowerCase())
      // // console.log(allLinks[key] && allLinks[key].file.toLowerCase() === currentPage)
      if (allLinks[key] && allLinks[key].file.toLowerCase() === currentPage) {
        // console.log(key)
        // console.log('123')
        isAllowed = true;
        break;
      }
    }
  }
  // console.log(isAllowed)
  // console.log(currentPage)
  if (!isAllowed && currentPage !== "/dashboard.html") {
    // // console.log('reach')
    // window.location.href = "/Dashboard.html";
  }
}

/* initial call (if user missing, still renders groups that are public for superadmin check) */
renderSidebar(user);

const sFeatures = user[0].school.features
const schoolTypeField = document.getElementById('SchoolTypeField')
const TuitionTypeField = document.getElementById('TuitionTypeField')
const CompTypeField = document.getElementById('CompTypeField')
const EngTypeField = document.getElementById('EngTypeField')
if (schoolTypeField && TuitionTypeField && CompTypeField && EngTypeField) {
  if (!sFeatures.includes('school')) {
    schoolTypeField.style.display = 'none'
  }
  if (!sFeatures.includes('tuition')) {
    TuitionTypeField.style.display = 'none'
  } if (!sFeatures.includes('computer')) {
    CompTypeField.style.display = 'none'
  } if (!sFeatures.includes('english')) {
    EngTypeField.style.display = 'none'
  }
}



// const edit_btn = document.querySelector('.btn-info')
// edit_btn.innerHTML= '✏️'

// const del_btn = document.querySelector('.btn-danger')
// edit_btn.innerHTML= '🗑️'