
  const classNameInput = document.getElementById("className");
  const classFeeInput = document.getElementById("classFee");
  const tuitionFeeInput = document.getElementById("tuitionFee");
  const admissionFeeInput = document.getElementById('admissionFee')
  const addButton = document.getElementById("formSubmitBtn");
  const tableBody = document.querySelector("#classTable tbody");
  const classForm = document.getElementById('classForm')
  const adminTh = document.getElementById('adminth')
  // const teacherIdInput = document.getElementById("teacherId");
  //     const teacherName = document.getElementById("teachername");
  const user = JSON.parse(localStorage.getItem("userData")) || [];

  const modal = new bootstrap.Modal(document.getElementById("addClassModal"));

const toast = new bootstrap.Toast(document.getElementById("toastMessage"));
const toastBody = document.getElementById("toastBody");
const toastElement = document.getElementById("toastMessage");
const searchcampusInput = document.getElementById('searchClass')
function showToast(message, isSuccess = true) {
 Swal.fire({
    toast: true,
    position: 'top-end',
    icon: isSuccess ? 'success' : 'error',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
}
let isEditing = false;
let editingId = null;

  console.log(user)
  const isSuperAdmin = user[0]?.designation === "supremeadmin";
  console.log(isSuperAdmin)

  // var classTeacherId
// const sidebar = document.getElementById("sidebar");

// const allLinks = {
//   // dashboard: { name: "Dashboard", file: "Dashboard.html" },
//   addclass: { name: "Add Class", file: "classform.html", active:true },
//   addsection: { name: "Add Section", file: "section.html", active:false },
//   addcomputercourse: { name: "Add Computer Course", file: "compcourse.html", active:false },
//   addenglangcourse: { name: "Add English lang Course", file: "englangcourse.html", active:false },

//   addstudent: { name: "Student Form", file: "student.html", active:false },
//   studentlist: { name: "Student List", file: "studentlist.html" , active:false},
//   addteacher: { name: "Teacher Form", file: "teacher.html",  active:false},
//   teacherlist: { name: "Teacher List", file: "teacherlist.html" , active:false},
//   teacherSalary: { name: "Teacher Salary", file: "teacherSalary.html" , active:false},
//   adduser: { name: "Add User", file: "userform.html" , active:false}



// };
if(user.length > 0 || !user == null){
// function renderSidebar(user) {
//   // console.log(user[0].allowPages)
//   // Always show Dashboard and Logout
//   sidebar.innerHTML = `<a class='active' href="Dashboard.html">Dashboard</a>`;
//    if(isSuperAdmin){
//   sidebar.innerHTML += `<a href="campusform.html">Add campus</a>`;

//   }

//   for (const key in allLinks) {
//     console.log(key)
//     if(isSuperAdmin){
//       sidebar.innerHTML += `<a href="${allLinks[key].file}" class="${allLinks[key].active?'active':''}">${allLinks[key].name}</a>`;

//     }
    
//    else {
//    if (user[0].allowedPages.includes(key)) {
//       sidebar.innerHTML += `<a href="${allLinks[key].file}" class="${allLinks[key].active?'active':''}">${allLinks[key].name}</a>`;
//       if(allLinks[key].active){
//         checkPermission(key)
//       }
//     }
//      else{
//         if(allLinks[key].active){
//             window.location.href='Dashboard.html'
//         }
//       }
//     }
//   }

//   sidebar.innerHTML += `<a href="#">Logout</a>`;
// }
const permissions = [{page: 'addclass',  permissions: ['read']},
{page: 'addsection', permissions: ['read']}
]

function checkPermission(currentPage){
  console.log(currentPage)
  const currentPagePerm= permissions.find(p=> p.page === currentPage)
  console.log(currentPagePerm)
  
  // permissions.forEach(permission => {
  //   if(permission.page== currentPage ){
  //     if(permission.permissions.includes('read')){
  //       console
  //     }
  //   }
  // });
}
// 
// renderSidebar(user);
  let originalClassList = []
  let classList = [];
  // let campusList = [];
  // var campusSelectBox1 = document.getElementById('campusSelectBox1')
  // var campusSelectBox2 = document.getElementById('campusSelectBox2')
  // // 🔽 Inject dropdown if superadmin
  // if (isSuperAdmin) {
  //   const campusDropdown = document.createElement("select");
  //   campusDropdown.className = "form-select mb-3";
  //   campusDropdown.id = "campusDropdown";
  //   campusDropdown.required = true;

  //   const label = document.createElement("label");
  //   label.textContent = "Select campus";
  //   label.setAttribute("for", "campusDropdown");
  //   label.className = "form-label";

  //   const campusDropdownfilter = document.createElement("select");
  //   campusDropdownfilter.className = "form-select mb-3";
  //   campusDropdownfilter.id = "campusDropdownfilter";
  //   campusDropdownfilter.required = true;

  //   const label2 = document.createElement("label");
  //   label2.textContent = "Select campus";
  //   label2.setAttribute("for", "campusDropdown");
  //   label2.className = "form-label";

  //   const form = document.getElementById("classForm");
  //   campusSelectBox1.appendChild(label2)
  //   campusSelectBox1.appendChild(campusDropdownfilter)

  //   campusSelectBox2.appendChild(label)
  //   campusSelectBox2.appendChild(campusDropdown)
  //   // 🟢 Fetch and populate campuses dropdown
  //   async function loadcampuses() {
  //     try {
  //       const res = await axios.get(`http://202.143.127.181:3001/api/campus/getBySchool/${user[0].school._id}`);
  //       campusList = res.data;
  //       console.log(campusList)
  //              const option = document.createElement("option");
  //         option.value = "";
  //         option.textContent = 'Select campus';
  //         campusDropdown.appendChild(option);
  //       campusList.forEach(campus => {
  //         const option = document.createElement("option");
  //         option.value = campus._id;
  //         option.textContent = campus.name;
  //         campusDropdown.appendChild(option);
  //       });

  //         const option2 = document.createElement("option");
  //         option2.value = "";
  //         option2.textContent = 'Select campus';
  //         campusDropdownfilter.appendChild(option2);
  //       campusList.forEach(campus => {
  //         const option2 = document.createElement("option");
  //         option2.value = campus._id;
  //         option2.textContent = campus.name;
  //         campusDropdownfilter.appendChild(option2);
  //       });
  //     } catch (err) {
  //       console.error("Error fetching campuses:", err);
  //     }
  //   }

  //   loadcampuses();
  // }

  // 🔁 Load classes on page load
  window.addEventListener("DOMContentLoaded", loadClasses);

  async function loadClasses() {
    try {
      let res;
      if (isSuperAdmin) {
        res = await axios.get(`http://localhost:3000/api/coachingClass/school/${user[0].school._id}`);
      } else {
        res = await axios.get(`http://localhost:3000/api/coachingClass/getByCampus/${user[0].school._id}/${user[0].campus._id}`);
      }
      classList = res?.data?.data || [];
      console.log(classList);
      originalClassList = [...res.data.data] 
      renderTable();
    } catch (err) {
      console.error("Error loading classes:", err);
    }
  }

  function renderTable() {
    tableBody.innerHTML = "";
      adminTh.style.display =  isSuperAdmin ?'block' : 'none'

    console.log(classList)
    if (classList.length > 0) {
    console.log(classList)

      classList.forEach((cls, i) => {
        console.log( cls)
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${i + 1}</td>
          <td>${cls.name}</td>
          <td>${cls.fee}</td>

          <td>${cls.admissionFee || 'N/A'}</td>
                 ${isSuperAdmin ? `<td>${cls.campusId?.name || 'N/A'}</td>` : ''}

          <td>
        <button class="btn btn-sm btn-info me-1" onclick="editClass('${cls._id}')">✏️</button>

            <button class="btn btn-sm btn-danger" onclick="deleteClass('${cls._id}')">🗑️</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No classes found</td></tr>`;
    }
  }

  async function deleteClass(id) {
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
     var res = await axios.delete(`http://localhost:3000/api/coachingClass/delete/${id}`);
      classList = classList.filter(cls => cls._id !== id);
originalClassList = originalClassList.filter(cls => cls._id !== id);
    showToast(res.data.message || "Deleted successfully");

      renderTable();
    } catch (err) {
      console.error("Failed to delete class:", err);
    showToast("Failed to delete campus", false);

    }
  }

  // ➕ Add Class
  addButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = classNameInput.value.trim();
    const fee = classFeeInput.value.trim();
    // const tuitionFee = tuitionFeeInput.value.trim();
    const admissionFee = admissionFeeInput.value.trim();

    if (!name || !fee  ) {
      alert("Please fill all fields");
      return;
    }

    let campusId;
    let schoolId = user[0]?.school?._id;
    const createdBy = user[0]._id
        if (isSuperAdmin) {
      const dropdown = document.getElementById("campusDropdown");
      campusId = dropdown.value;
      if (!campusId) {
        alert("Please select a campus");
        return;
      }
    } else {
      campusId = user[0].campus._id;
    }

    try {
       if (isEditing) {
      const res = await axios.put(`http://localhost:3000/api/coachingClass/update/${editingId}`, {
        name, fee,admissionFee,campusId , schoolId 
      });

      const { data, message } = res.data;
      const index = classList.findIndex(s => s._id === editingId);
      classList[index] = data;
      originalClassList[index] = data;

      showToast(message || "campus updated successfully");

    } else {
      const res = await axios.post("http://localhost:3000/api/coachingClass/add", {
        name, fee,admissionFee,campusId , schoolId , createdBy
      });

      const { data, message } = res.data;
      showToast(message, data && data._id);
      console.log(data,message)
      // Only push if campus added
      if (data && data._id) {
        classList.push(data);
        originalClassList.push(data)
      }
      console.log(classList)
      console.log(originalClassList)

      // Don't close modal if already exists
      if (message === "campus Already Exists") return;
    }

    // Reset and close modal
    isEditing = false;
    editingId = null;
    classForm.reset();
    addButton.textContent = "Add campus";
    document.getElementById("addClassModalLabel").textContent = "Add New campus";
    modal.hide();


      if (isSuperAdmin) document.getElementById("campusDropdown").value = "";

      renderTable();
    } catch (err) {
      console.error("Error adding class:", err);
    showToast(err.response?.data?.message || "Server error", false);
    }
  });

  // 🗑 Expose delete globally
  window.deleteClass = deleteClass;


  window.editClass = function (id) {
  const classData = classList.find(s => s._id === id);
  if (!classData) {
    showToast("Class not found", false);
    return;
  }

  isEditing = true;
  editingId = id;
  classNameInput.value = classData.name;
  classFeeInput.value = classData.fee;

  admissionFeeInput.value = classData.admissionFee
 

  if(isSuperAdmin) document.getElementById('campusDropdown').value = classData.campusId._id

  document.getElementById("addClassModalLabel").innerText = "Update Class";
  formSubmitBtn.innerText = "Update Class";
  modal.show();
}
let selectedcampusId = ''; // Store selected campus
let filteredClasses = originalClassList;

// 👇 Search filter
searchcampusInput.addEventListener('input', () => {
  const searchTerm = searchcampusInput.value.toLowerCase().trim();

  // Apply both filters: campus + search text
  filteredClasses = originalClassList.filter(cls =>
    (selectedcampusId === '' || cls.campusId._id === selectedcampusId) &&
    cls.name.toLowerCase().includes(searchTerm)
  );

  classList = filteredClasses;
  renderTable();
});

// 👇 campus dropdown filter
if (isSuperAdmin) {
  console.log(campusSelectBox1)
  campusSelectBox1.addEventListener('change', (e) => {
    selectedcampusId = e.target.value; // Save selected campus
console.log(selectedcampusId)
    const searchTerm = searchcampusInput.value.toLowerCase().trim();

    // Apply both filters: campus + search text
    filteredClasses = originalClassList.filter(cls =>
      (selectedcampusId === '' || cls.campusId._id === selectedcampusId) &&
      cls.name.toLowerCase().includes(searchTerm)
    );

    classList = filteredClasses;
    renderTable();
  });
}

document.getElementById("addClassModal").addEventListener("hidden.bs.modal", closeModal);


function closeModal() {
  classForm.reset();
  isEditing = false;
  editingId = null;
  formSubmitBtn.textContent = "Add campus";
  document.getElementById("addClassModalLabel").textContent = "Add New campus";
}

//  var teacher

//     document.getElementById('getTeacher').addEventListener('click',async()=>{
//       console.log(teacherIdInput)
//         if(!teacherIdInput.value) return alert('enter teacher id')
//       let schoolId;
//       if (isSuperAdmin) {
//         schoolId = document.getElementById("schoolDropdown").value;
//         if (!schoolId) return alert("Select school first");
//       } else {
//         schoolId = user[0].school._id;
//       }
//       var campus = user[0].campus._id
//       var res = await axios.post('http://202.143.127.181:3001/api/teacher/getById',{id:teacherIdInput.value,schoolId,campus})
//       teacher = res.data
//       teacherName.value = `${teacher.name}  ${teacher.fatherName} `
//       classTeacherId= teacher._id

        
//     })

}

else{
             window.location.href='Dashboard.html'

}


