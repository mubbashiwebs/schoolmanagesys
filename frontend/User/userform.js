const user = JSON.parse(localStorage.getItem("userData")) || [];
const isSuperAdmin = user[0]?.designation === "supremeadmin";

const pagesContainer = document.querySelector("#pagesCheckboxes");
const permissionsTable = document.querySelector("#permissionsTable");

function showLoader() {
  document.getElementById("loader").style.display = "flex";
}
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
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
if(window.location.pathname.includes("userform.html")) {
 
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
    file: "/student/student.html", 
    icon: "fa-solid fa-user-plus" 
  },
  studentlist: { 
    name: "Student List", 
    file: "/student/studentlist.html", 
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
renderPagesCheckboxes(allLinks);

}






function renderPagesCheckboxes(allLinks) {
  pagesContainer.innerHTML = "";
  let availablePages = user[0]?.allowedPages || [];
  availablePages.forEach(pageKey => {
    let pageName = allLinks[pageKey]?.name || pageKey;
    pagesContainer.innerHTML += `
      <label>
        <input type="checkbox" name="pages" value="${pageKey}"> ${pageName}
      </label>
    `;
  });
  document.querySelectorAll("input[name='pages']").forEach(cb => {
    cb.addEventListener("change", updatePermissionsTable);
  });
}

function updatePermissionsTable() {
  permissionsTable.innerHTML = "";
  const selectedPages = Array.from(document.querySelectorAll("input[name='pages']:checked")).map(cb => cb.value);
  selectedPages.forEach(pageKey => {
    let pageName = allLinks[pageKey]?.name || pageKey;
    permissionsTable.innerHTML += `
      <tr>
        <td>${pageName}</td>
        <td><input type="checkbox" name="${pageKey}-read"></td>
        <td><input type="checkbox" name="${pageKey}-add"></td>
        <td><input type="checkbox" name="${pageKey}-edit"></td>
        <td><input type="checkbox" name="${pageKey}-delete"></td>
      </tr>
    `;
  });
}

function collectPermissions() {
  let permissionsData = [];
  const selectedPages = Array.from(document.querySelectorAll("input[name='pages']:checked")).map(cb => cb.value);
  selectedPages.forEach(pageKey => {
    let pagePermissions = [];
    ["read", "add", "edit", "delete"].forEach(action => {
      if (document.querySelector(`input[name='${pageKey}-${action}']`)?.checked) {
        pagePermissions.push(action);
      }
    });
    if(pagePermissions.length >0){
      permissionsData.push({ page: pageKey, permissions: pagePermissions });
    }
  });
  return permissionsData;
}


if(user.length <= 0){
  window.location.href= 'Dashboard.html';
}





document.getElementById("submit").addEventListener("click", async function () {
  const allowedPages = Array.from(document.querySelectorAll("input[name='pages']:checked")).map(cb => cb.value);
  // const firstname = document.getElementById("firstname").value;
  // const lastname = document.getElementById("lastname").value;
  // const cnic = document.getElementById("cnic").value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("Username").value;
  const password = document.getElementById("password").value;
  const designation = document.getElementById("designation").value;
  const contactNo = document.getElementById("contactNo").value;
  const campus = isSuperAdmin? document.getElementById("campusDropdown")?.value || null : user[0].campus._id;
  let school = user[0].school._id;
    const createdBy = user[0]._id

  if( !email || !username || !password || !designation || !contactNo || !campus) 
    return showToast('error', 'Please fill the required information');
  if(allowedPages.length <=0) 
    return showToast('error', 'Please select allowed pages');
  if(designation == 'superadmin' && !isSuperAdmin) 
    return showToast('error', 'You are not allowed to add superadmin');

   // ⭐⭐ EDIT MODE ⭐⭐
  if (editMode) {
    try {
      showLoader();
      const res = await axios.put(`http://localhost:3000/api/user/update/${editUserId}`, {
        email, username, password, designation, contactNo, allowedPages, campus
      });

      hideLoader();
      showToast("success", res.data.message);

      editMode = false;
      editUserId = null;
      bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
      getUsers();
    } catch (err) {
      hideLoader();
      console.log(err.response.data.message)
      showToast("error", err.response.data.message);
    }
    return;
  }

  try {
    showLoader();
    const res = await axios.post(" http://localhost:3000/api/user/add", {
       email, username, password, designation, allowedPages, school, contactNo , campus, createdBy
    });
    hideLoader();
    showToast('success', res.data.message || "User added!");
   user.push(res.data.data)
   filteredUsers.push(res.data.data)
    bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();

    
   renderTable()
  } catch (error) {
    hideLoader();
    showToast('error', "Failed to add user");
  }
});
var users 
var filteredUsers 
async function getUsers() {

  try {
    const res = await axios.get(`http://localhost:3000/api/user/getBySchool/${user[0].school._id}`);
     users = res.data.data;
     filteredUsers = [...res.data.data]
    console.log(users)
   renderTable()
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

getUsers();

function renderTable(){
   const tableBody = document.querySelector("#classTable tbody");
    tableBody.innerHTML = "";
    if(filteredUsers.length <=0){
     return  tableBody.innerHTML += `
        <tr>
          <td colspan="8" class ="text-center">No Record Found</td>
          
        </tr>
      `;
    }
    filteredUsers.forEach((user, index) => {
      tableBody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${user.contactNo}</td>
          <td>${user.designation}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.password}</td>
          <td>${user.campus?.name || "N/A"}</td>
                  
          <td>
            <button class="btn btn shadow-sm btn-sm" onclick="editUser('${user._id}')">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">🗑️</button>
          </td>
        </tr>
      `;
    });
}

async function deleteUser(id) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This action cannot be undone!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  });
  if (!result.isConfirmed) return;

  try {
    showLoader();
    const res = await axios.delete(` http://localhost:3000/api/user/delete/${id}`);
    hideLoader();
    showToast('success', res.data.message || "User deleted");
    getUsers();
  } catch (error) {
    hideLoader();
    showToast('error', "Failed to delete user");
  }
}
if(isSuperAdmin){
  renderCampusSelect()
}

function renderCampusSelect(){
  var campusSelectBox2 = document.getElementById('campusSelectBox2')

      const campusDropdown = document.createElement("select");
    campusDropdown.className = "form-select mb-3";
    campusDropdown.id = "campusDropdown";
    campusDropdown.required = true;

    const label = document.createElement("label");
    label.textContent = "Select campus";
    label.setAttribute("for", "campusDropdown");
    label.className = "form-label";

    
    campusSelectBox2.appendChild(label)
    campusSelectBox2.appendChild(campusDropdown)
    // 🟢 Fetch and populate campuses dropdown
    async function loadcampuses() {
      try {
        const res = await axios.get(` http://localhost:3000/api/campus/getBySchool/${user[0].school._id}`);
        campusList = res.data;
        console.log(campusList)
               const option = document.createElement("option");
          option.value = "";
          option.textContent = 'Select campus';
          campusDropdown.appendChild(option);
        campusList.forEach(campus => {
          const option = document.createElement("option");
          option.value = campus._id;
          option.textContent = campus.name;
          campusDropdown.appendChild(option);
        });

          
        
      } catch (err) {
        console.error("Error fetching campuses:", err);
      }
    }

    loadcampuses();
}



var searchInput = document.getElementById('searchUser').addEventListener('input' ,filters)
campusSelectBox1.addEventListener('change', filters)
function filters(){
     var selectedcampusId = isSuperAdmin ? document.getElementById('campusDropdownfilter').value : '';

  var searchValue = document.getElementById('searchUser').value
      var matchSearch = false
      var matchCampus = true

 filteredUsers = users.filter((user)=>{
      if(user.username.includes(searchValue)) matchSearch = true
      if(user.campus._id == selectedcampusId ){
        matchCampus = true
      }
      else if(user.campus._id !== selectedcampusId && selectedcampusId !== ''){
        matchCampus = false
      }
      console.log(matchCampus)
  return matchSearch && matchCampus
  })

  renderTable()
}


let editMode = false;
let editUserId = null;

async function editUser(id) {
  const selected = users.find(u => u._id === id);
  if (!selected) return;
    console.log(id)
  editMode = true;
  editUserId = id;

  // ⭐ Modal open karo
  const modal = new bootstrap.Modal(document.getElementById("addUserModal"));
  modal.show();

  // ⭐ Form fields fill karo
  document.getElementById("email").value = selected.email;
  document.getElementById("Username").value = selected.username;
  document.getElementById("password").value = selected.password;
  document.getElementById("designation").value = selected.designation;
  document.getElementById("contactNo").value = selected.contactNo;

  if (isSuperAdmin) {
    document.getElementById("campusDropdown").value = selected.campus?._id || "";
  }

  document.getElementById('addUserModalLabel').textContent = 'Update User'
  document.getElementById('submit').textContent = 'Update'
  // ⭐ Pages checkboxes auto-select
  // document.querySelectorAll("input[name='pages']").forEach(cb => {
  //   cb.checked = selected.allowedPages.includes(cb.value);
  // });
  var selectBoxes = document.querySelectorAll("input[name='pages']")
  
  selectBoxes.forEach((box)=>{
    user[0].allowedPages.forEach((page)=>{
      if(box.value == page) box.checked = true
    })
  })




}


document.getElementById("addUserModal").addEventListener("hidden.bs.modal", closeModal);


function closeModal() {
 
let editMode = false;
let editUserId = null;
 
 document.getElementById('addUserModalLabel').textContent = '➕ Add New User'
  document.getElementById('submit').textContent = '💾 Save User'
    const email = document.getElementById("email").value
    document.getElementById("email").value = "";
  document.getElementById("Username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("designation").value = "";
  document.getElementById("contactNo").value = "";

  if (isSuperAdmin) {
    const campusDropdown = document.getElementById("campusDropdown");
    if (campusDropdown) campusDropdown.value = "";
  }

  // ⭐ UNCHECK ALL ALLOWED PAGES
  document.querySelectorAll("input[name='pages']").forEach(cb => {
    cb.checked = false;
  });
}

