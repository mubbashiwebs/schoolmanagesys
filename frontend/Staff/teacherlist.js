 const user = JSON.parse(localStorage.getItem("userData")) ||[];
  const isSuperAdmin = user[0]?.designation === "supremeadmin";
       if(user.length <= 0){
     window.location.href= 'Dashboard.html'
        
  }

    const tbody = document.getElementById("teacherTableBody");
  const adminTh = document.getElementById('adminth')

   var teacherlist = []
    getTeachers()
 async function getTeachers(){
  if(isSuperAdmin){
    var res= await axios.get(`http://localhost:3000/api/teacher/school/${user[0]?.school._id}`)

  }
  else{
    var res= await axios.get(`http://localhost:3000/api/teacher/get/${user[0]?.school._id}/${user[0]?.campus._id}`)

  }
    console.log(res.data)
    console.log(res.data.message)
      teacherlist = res.data;
      renderTable(teacherlist);

  }

  function renderTable(data) {
  tbody.innerHTML = '';
      adminTh.style.display =  isSuperAdmin ?'block' : 'none'

  if (data.length > 0) {
    data.forEach((teacher, index) => {
      const employTypes = teacher.admissionTypes?.join(", ") || "N/A";
      console.log(teacher)
      // Format school class records
    //   const schoolClassDetails = teacher.schoolClassesRec?.map(
    //     rec => `${rec.class || ''} - ${rec.section || ''} -${rec.subject || ''}`
    //   ).join(", ") || "N/A";
    // console.log(teacher.schoolClassesRec.join(','))
    //   // Format tuition class records
    //   const tuitionClassDetails = teacher.schooltuitionRec?.map(
    //     rec => `${rec.class || ''} - ${rec.subject || ''}`
    //   ).join(", ") || "N/A";
    //   console.log(schoolClassDetails)
    //   const allClasses = `${schoolClassDetails}<br><strong>Tuition:</strong> ${tuitionClassDetails}`;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${teacher.name + ' ' + teacher.fatherName}</td>
        <td>${teacher.role}</td>
        <td>${employTypes}</td>
        <td>${teacher.Salary}</td>
                 ${isSuperAdmin ? `<td>${teacher.campus?.name || 'N/A'}</td>` : ''}
        
        <td>
          <button class="btn btn-info btn-sm" onclick='viewTeacher(${JSON.stringify(teacher)})'>View</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTeacher('${teacher._id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } else {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">No classes found</td></tr>`;
  }
}


   async function deleteTeacher(id) {
    console.log(id)
      if(!confirm('Are you sure you want to delete this class?'))return
      try {
        await axios.delete(`http://localhost:3000/api/teacher/delete/${id}`)
        teacherlist = teacherlist.filter((teacher)=>teacher._id != id)
        console.log(teacherlist)

        renderTable(teacherlist)
      } catch (error) {
      console.error("Failed to delete teacher:", error.message);
        
      }
    }
          const campusSelect = document.getElementById('campusSelect');

    if(isSuperAdmin){
      loadCampuses()
      campusSelect.style.display = 'inline-block'
    }
    else{
      campusSelect.style.display = 'none'

    }
    function loadCampuses() {
      return axios.get(`http://localhost:3000/api/campus/getBySchool/${user[0].school._id}`)
        .then(response => {
          const campuses = response.data;
          campuses.forEach(campus => {
            const option = document.createElement('option');
            option.value = campus._id; // Use campus name as value
            option.textContent = campus.name;
            campusSelect.appendChild(option);
          });
        })
        .catch(error => {
          console.error('Error loading campuses:', error);
        });
    }
    function viewTeacher(data) {
      localStorage.setItem("viewteacherData", JSON.stringify(data));
      window.location.href = "teacher.html?view=true";
    }
  function applyFilters() {
      const search = searchInput.value.toLowerCase();
    
      const selectedCampus = campusSelect.value;
      const selectedRole = roleSelect.value;

      const filtered = teacherlist.filter(staff => {
        const matchesSearch =
          staff.staffCode.includes(search) ||
          staff.name.toLowerCase().includes(search) ||
          staff.fatherName.toLowerCase().includes(search) ||
          staff.campus.name.toLowerCase().includes(search) ||
          staff.role.toLowerCase().includes(search);
       
        const matchesCampus = !selectedCampus || staff.campus._id === selectedCampus;
        const matchesRole = !selectedRole || staff.role === selectedRole;
        if(isSuperAdmin){
          return matchesSearch && matchesCampus && matchesRole;
        }
        else{
          return matchesSearch && matchesRole;
        }
      });

       renderTable(filtered);
    }

    // Event Listeners
    searchInput.addEventListener('input', applyFilters);
  
    campusSelect.addEventListener('change', applyFilters);
    roleSelect.addEventListener('change', applyFilters);
