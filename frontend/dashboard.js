var user = JSON.parse( localStorage.getItem('userData')) || []
console.log(user)
var mainHeading = document.getElementById('Main-Heading')
mainHeading.innerHTML = user.length > 0 ? user[0]?.username +' | ' + user[0].designation : ' Welcome Guest'
// console.log(user[0].school.name)
  const isSuperAdmin = user[0]?.designation === "supreradmin";

 const sidebar = document.getElementById("sidebar");

const allLinks = {
  // dashboard: { name: "Dashboard", file: "Dashboard.html" },
  addclass: { name: "Add Clas", file: "classform.html", active:false },
  addsection: { name: "Add Section", file: "section.html", active:false },
  addcomputercourse: { name: "Add Computer Course", file: "compcourse.html", active:false },
  addstudent: { name: "Student Form", file: "student.html", active:false },
  studentlist: { name: "Student List", file: "studentlist.html" , active:false},
  addteacher: { name: "Teacher Form", file: "teacher.html",  active:false },
  teacherlist: { name: "Teacher List", file: "teacherlist.html" , active:false},
  teacherSalary: { name: "Teacher Salary", file: "teacherSalary.html" , active:false},

  adduser: { name: "Add User", file: "userform.html" , active:false}

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

