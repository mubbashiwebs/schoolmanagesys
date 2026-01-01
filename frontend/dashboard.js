var user = JSON.parse( localStorage.getItem('userData')) || []
console.log(user)
var mainHeading = document.getElementById('Main-Heading')
mainHeading.innerHTML = user.length > 0 ? user[0]?.username +' | ' + user[0].designation : ' Welcome Guest'
// console.log(user[0].school.name)
  const isSuperAdmin = user[0]?.designation === "supreradmin";

 const sidebar = document.getElementById("sidebar");
const allLinks = {

  // ✅ CLASSES
  addclass: { 
    name: "Add Class", 
    file: "/classes/classform.html", 
    icon: "fa-solid fa-chalkboard" 
  },
  addCoachClass: { 
    name: "Add Coaching Class", 
    file: "/classes/coachClass.html", 
    icon: "fa-solid fa-chalkboard" 
  },
  addsection: { 
    name: "Add Section", 
    file: "/classes/section.html", 
    icon: "fa-solid fa-layer-group" 
  },
  addsubject: { 
    name: "Add Subject", 
    file: "/subject/subject.html", 
    icon: "fa-solid fa-book-open" 
  },

  // ✅ SCHOOL
  addCampus: { 
    name: "Add Campus", 
    file: "/school/campus.html", 
    icon: "fa-solid fa-city" 
  },

  // ✅ COURSES
  addBatch: { 
    name: "Add Batch", 
    file: "/courses/batch.html", 
    icon: "fa-solid fa-users" 
  },
  addcomputercourse: { 
    name: "Add Computer Course", 
    file: "/courses/compcourse.html", 
    icon: "fa-solid fa-laptop-code" 
  },
  addenglangcourse: { 
    name: "Add English lang Course", 
    file: "/courses/englangcourse.html", 
    icon: "fa-solid fa-language" 
  },

  // ✅ STUDENT
  addstudent: { 
    name: "Student Form", 
    file: "/students/student.html", 
    icon: "fa-solid fa-user-plus" 
  },
  studentlist: { 
    name: "Student List", 
    file: "/students/studentlist.html", 
    icon: "fa-solid fa-list" 
  },

  // ✅ STAFF
  addteacher: { 
    name: "Teacher Form", 
    file: "/staff/teacher.html", 
    icon: "fa-solid fa-user-tie" 
  },
  teacherlist: { 
    name: "Teacher List", 
    file: "/staff/teacherlist.html", 
    icon: "fa-solid fa-users" 
  },
  teacherSalary: { 
    name: "Teacher Salary", 
    file: "/staff/teacherSalary.html", 
    icon: "fa-solid fa-money-bill" 
  },

  // ✅ USER
  adduser: { 
    name: "Add User", 
    file: "/user/userform.html", 
    icon: "fa-solid fa-user-gear" 
  }
};

function renderSidebar(user) {
if(user.length <= 0){
  sidebar.innerHTML = `<a class='active' href="Dashboard.html">Dashboard</a>`;
return
}
  sidebar.innerHTML = `<a class='active' href="Dashboard.html">Dashboard</a>`;
   if(isSuperAdmin){
  sidebar.innerHTML += `<a href="schoolform.html">Add School</a>`;

  }

  for (const key in allLinks) {
    console.log(key)
    if(isSuperAdmin){
      sidebar.innerHTML += `<a href="${allLinks[key].file}" class="${allLinks[key].active?'active':''}">${allLinks[key].name}</a>`;

    }
    
   else {
   if (user[0].allowedPages.includes(key)) {
      sidebar.innerHTML += `<a href="${allLinks[key].file}" class="${allLinks[key].active?'active':''}">${allLinks[key].name}</a>`;
    }
     else{
        if(allLinks[key].active){
            window.location.href='Dashboard.html'
        }
      }
    }
  }

  sidebar.innerHTML += `<a href="#">Logout</a>`;



}
renderSidebar(user);

