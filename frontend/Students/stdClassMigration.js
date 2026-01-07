
const fromClassSelect = document.getElementById('fromClass');
const toClassSelect = document.getElementById('toClass');
const migrateButton = document.getElementById('migrateButton');
const campusDropdown = document.getElementById("campusSelect");
let cammpusId = null;
let classList = [];
let studentList = [];
// Load classes into dropdowns
async function loadClasses() {
    if(!cammpusId) return;
    try {
      let res = await axios.get(`https://lightsteelblue-lark-819414.hostingersite.com/api/class/getByCampus/${user[0].school._id}/${cammpusId}`);
    
      classList = res.data.data;
      console.log(classList);
      populateClassDropdowns(classList);
    } catch (err) {
      console.error("Error loading classes:", err);
    }
  

   
}
if(isSuperAdmin){
    cammpusId= null
}
else{
    cammpusId= user[0].campus._id
}

loadClasses();

function populateClassDropdowns(classList) {
    if(!classList || classList.length === 0) return;
    fromClassSelect.innerHTML = '<option value="">Select From Class</option>';
    toClassSelect.innerHTML = '<option value="">Select To Class</option>';
    classList.forEach(cls => {
        const option1 = document.createElement('option');
        option1.value = cls._id;
        option1.textContent = cls.name;
        fromClassSelect.appendChild(option1);
        const option2 = document.createElement('option');
        option2.value = cls._id;
        option2.textContent = cls.name;
        toClassSelect.appendChild(option2);
    }
    );
}

populateClassDropdowns();



campusSelectBox2.addEventListener('change', (e) => {
    const selectedCampusId = e.target.value;
    cammpusId = selectedCampusId;
    // Clear existing options
    fromClassSelect.innerHTML = '<option value="">Select From Class</option>';
    toClassSelect.innerHTML = '<option value="">Select To Class</option>';
    // Reload classes for the selected campus
    loadClasses();
});

fromClassSelect.addEventListener('change', (e) => {
        if(!toClassSelect.value){
        document.querySelectorAll('.s-cell').forEach(cell => cell.style.display = 'none');
       
    }
    else{
        document.querySelectorAll('.s-cell').forEach(cell => cell.style.display = 'table-cell');
    }
    loadStudents(e.target.value);
});
toClassSelect.addEventListener('change', (e) => {
    if(toClassSelect.value === fromClassSelect.value){
        alert("From Class and To Class cannot be the same.", "error");
        toClassSelect.value = "";
       
    }
    if(!toClassSelect.value){
        document.querySelectorAll('.s-cell').forEach(cell => cell.style.display = 'none');
       
    }
    else{
        document.querySelectorAll('.s-cell').forEach(cell => cell.style.display = 'table-cell');
    }
    renderTable();
});

async function loadStudents(classId){
    try {
        let res = await axios.get(`http://localhost:3000/api/student/getByClass/${classId}`);
        console.log(res.data);
        studentList = res.data;
        renderTable();
    } catch (error) {
        console.error("Error loading students:", error.message);
    }
}
  const tableBody = document.getElementById('studentBody');

function renderTable() {

    tableBody.innerHTML = "";
    if (studentList.length > 0) {
        studentList.forEach((student, i) => {
            tableBody.innerHTML += `
            <tr>
        <td><input type="checkbox" class="studentCheck" value="${student._id}"></td>

                <td>${i + 1}</td>

                <td>${student.name}</td>
                <td>${student.grNumbers['school']}</td>
                <td>${student.class.name}</td>
                                <td>${student.feeDetails.school.originalFee}</td>
                <td>${student.feeDetails.school.discount}</td>
                <td>${student.feeDetails.school.payableFee}</td>
                ${
                    console.log(toClassSelect.value), // This console.log is fine.
                    toClassSelect.value
                    ? `<td>${classList.find(cls => cls._id === toClassSelect.value)?.fee }</td>
                       <td>
                       <input type="text"   data-student-id="${student._id}"
 class="discountInput" value="${student.feeDetails.school.discount}"  />
                       </td>
                       <td class="netFeeCell">${calculateNewNetFee(student.feeDetails.school.discount)}</td>`
                    : ''
                }

            </tr>
            `;
        });
    }

}


const calculateNewNetFee = (discount) => {
    const newClassFee = classList.find(cls => cls._id === toClassSelect.value)?.fee || 0;

    return newClassFee - discount;
}

let studentDiscounts = [];


tableBody.addEventListener('input', function (e) {
    if (e.target.classList.contains('discountInput')) {

        const studentId = e.target.dataset.studentId;
        const discount = Number(e.target.value) || 0;

        // check if student already exists in array
        const index = studentDiscounts.findIndex(
            item => item.studentId === studentId
        );

        if (index !== -1) {
            // update existing discount
            studentDiscounts[index].discount = discount;
        } else {
            // add new record
            studentDiscounts.push({
                studentId,
                discount
            });
        }
        // Update net fee cell
        console.log(e.target);
        console.log(e.target.parentElement);
        const netFeeCell = e.target.parentElement.nextElementSibling;
        console.log(netFeeCell);
        netFeeCell.textContent = calculateNewNetFee(discount);


        console.log(studentDiscounts);
    }
});

migrateButton.addEventListener('click', async () => {
    const fromClassId = fromClassSelect.value;
    const toClassId = toClassSelect.value;
    if (!fromClassId || !toClassId) {
        alert("Please select both From Class and To Class.", "error");
        return;
    }

    const selectedStudentIds = Array.from(document.querySelectorAll('.studentCheck:checked')).map(cb => cb.value);
    if (selectedStudentIds.length === 0) {
        alert("Please select at least one student to migrate.", "error");
        return;
    }
    try {
        const res = await axios.post('http://localhost:3000/api/student/migrateClass', {
            fromClassId,
            toClassId,  
            studentIds: selectedStudentIds,
            studentDiscounts
        });
        console.log(res.data);
        alert("Students migrated successfully!");
        loadStudents(fromClassId)
        // Optionally, you can reload the student list to reflect changes
    } catch (error) {
        console.error("Error migrating students:", error);
        alert("Error migrating students. Please try again.", "error");
    }
});
