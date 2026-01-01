
      const user = JSON.parse(localStorage.getItem("userData")) || [];
      const isSuperAdmin = user[0]?.designation === "superadmin";
      const schoolSelectContainer = document.getElementById("schoolSelectContainer");
      const schoolSelectTable = document.getElementById("schoolSelectTable");
      const modal = new bootstrap.Modal(document.getElementById("addTSModal"));
      var teacherId

      
      // if(user.length  <=0 ){
      //      window.location.href= 'Dashboard.html'

      // }
      



      let schoolList = [];

      async function loadSchools() {
        try {
          const res = await axios.get("http://localhost:3000/api/school/get");
          schoolList = res.data.data;

          const label = document.createElement("label");
          label.className = "form-label mt-2";
          label.innerText = "Select School";

          const select = document.createElement("select");
          select.className = "form-select col-md-6 mb-3";
          select.id = "schoolDropdown";
          select.required = true;

          const selectTable = document.createElement("select");
          selectTable.className = "form-select col-md-6 mb-3";
          selectTable.id = "schoolDropdownTable";
          selectTable.required = true;

          select.innerHTML = `<option value="">Select School</option>`;
          selectTable.innerHTML = `<option value="">Select School</option>`;
          schoolList.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s._id;
            opt.textContent = s.name;
            select.appendChild(opt);
          });

          schoolList.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s._id;
            opt.textContent = s.name;
            selectTable.appendChild(opt);
          });


          schoolSelectContainer.appendChild(label);
          schoolSelectContainer.appendChild(select);

          // schoolSelectTable.appendChild(label);
          schoolSelectTable.appendChild(selectTable);
        } catch (err) {
          alert("Failed to load schools");
          console.error(err);
        }
      }

      if (isSuperAdmin) loadSchools();

      var teacher

      document.getElementById('getTeacherBtn').addEventListener('click', async () => {
        const teacherIdInput = document.getElementById("teacherIdInput").value;
        const amountPaid = document.getElementById("amountPaid")

        const teacherName = document.getElementById("teachername");
        if (!teacherIdInput) return alert('enter teacher ID')
        let schoolId;
       

        var res = await axios.post('http://localhost:3000/api/teacher/getById', { id: teacherIdInput, })
        teacher = res.data
        teacherName.value = `${teacher.name}  ${teacher.fatherName} `
        amountPaid.value = teacher.Salary
        teacherId = teacher._id



      })


      document.getElementById("addSalary").addEventListener("click", async () => {


        const amountPaid = document.getElementById("amountPaid").value
        const salaryMonth = document.getElementById("salaryMonth").value;
        const salaryYear = document.getElementById("salaryYear").value;
        const paymentMethod = document.getElementById("paymentMethod").value;

        let schoolId;
        if (teacher?.schoolId._id) {
          schoolId = teacher.schoolId._id
          teacherId = teacher._id
        }
        else {
          alert('fisrt get teacher data')
          return
        }

        paidBy = user[0].email
        try {
          const res = await axios.post("http://localhost:3000/api/teacherSalary/add", {
            teacherId, amountPaid,
            salaryMonth: `${salaryMonth} ${salaryYear}`,
            paymentMethod, paidBy, schoolId
          });
          modal.hide()


          alert("Salary added successfully");
          // document.getElementById("salaryForm").reset();
          if (isSuperAdmin) document.getElementById("schoolDropdown").value = "";
        } catch (err) {
          alert("Failed to add salary");
          console.error(err);
        }
      });

      document.getElementById("searchForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const searchMonth = document.getElementById("searchMonth").value;
        const searchYear = document.getElementById("searchYear").value;

        if (!searchMonth || !searchYear) return alert("Please select month and year");

        let schoolId;
        if (isSuperAdmin) {
          schoolId = document.getElementById("schoolDropdownTable")?.value;
          if (!schoolId) return alert("Select school to search");
        } else {
          schoolId = user[0].school._id;
        }
        if (!schoolId) return alert('select school')

        try {
          const res = await axios.get(`http://localhost:3000/api/teacherSalary/getByMonthYear?month=${searchMonth}&year=${searchYear}&schoolId=${schoolId}`);
          const salaryList = res.data;
          const tbody = document.querySelector("#salaryTable tbody");
          tbody.innerHTML = "";

          if (salaryList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center">No records found</td></tr>`;
            return;
          }

          salaryList.forEach((item, i) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${i + 1}</td>
            <td>${item.teacherId.name} ${item.teacherId.fatherName}</td>
            <td>${item.teacherId.email}</td>
            <td>${item.amountPaid}</td>
            <td>${item.salaryMonth}</td>
            <td>${item.paidBy}</td>
            <td>${item.paymentMethod}</td>
            <td>${new Date(item.paymentDate).toLocaleDateString()}</td>
          `;
            tbody.appendChild(row);
          });
        } catch (err) {
          alert("Error fetching salary data");
          console.error(err);
        }
      });
