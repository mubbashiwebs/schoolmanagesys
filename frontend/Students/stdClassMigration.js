
const fromClassSelect = document.getElementById('fromClass');
const toClassSelect = document.getElementById('toClass');
const migrateButton = document.getElementById('migrateButton');
const campusDropdown = document.getElementById("campusSelect");
let campusId = null;
let classList = [];
let studentList = [];
let feeStructures = [];
// Load classes into dropdowns
async function loadClasses() {
    if (!campusId) return;
    try {
        let res = await axios.get(`${backendUrl}/api/class/getByCampus/${user[0].school._id}/${campusId}`);

        classList = res.data.data;
        console.log(classList);
        populateClassDropdowns(classList);
    } catch (err) {
        console.error("Error loading classes:", err);
    }



}
if (isSuperAdmin) {
    campusId = null
}
else {
    campusId = user[0].campus._id
}
loadFeeStructures()
loadClasses();

function populateClassDropdowns(classList) {
    if (!classList || classList.length === 0) return;
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

// populateClassDropdowns();



campusSelectBox2.addEventListener('change', (e) => {
    const selectedCampusId = e.target.value;
    campusId = selectedCampusId;
    // Clear existing options
    fromClassSelect.innerHTML = '<option value="">Select From Class</option>';
    toClassSelect.innerHTML = '<option value="">Select To Class</option>';
    // Reload classes for the selected campus
    loadFeeStructures()
    loadClasses();
});

fromClassSelect.addEventListener('change', (e) => {
    if (!toClassSelect.value) {
        document.querySelectorAll('.s-cell').forEach(cell => cell.style.display = 'none');

    }
    else {
        document.querySelectorAll('.s-cell').forEach(cell => cell.style.display = 'table-cell');
    }
    loadStudents(e.target.value);
});
toClassSelect.addEventListener('change', (e) => {
    if (toClassSelect.value === fromClassSelect.value) {
        alert("From Class and To Class cannot be the same.", "error");
        toClassSelect.value = "";

    }
    if (!toClassSelect.value) {
        document.querySelectorAll('.s-cell').forEach(cell => cell.style.display = 'none');

    }
    else {
        document.querySelectorAll('.s-cell').forEach(cell => cell.style.display = 'table-cell');
    }
    renderTable();
});

async function loadStudents(classId) {
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
                <td>

                    <select data-student-id="${student._id}" class="feeStrSelect">
                        <option data-class-id="${toClassSelect.value}" ${ student.feeStructure == null ? 'selected':""} value="default_class_fee">Default Class Fee</option>
                        ${feeStructures.map(fs => `<option data-class-id="${toClassSelect.value}" ${fs._id == student.feeStructure ? "selected":""} value="${fs._id}">${fs.name}</option>`).join('')}
                    </select>
                </td>

             
                ${console.log(toClassSelect.value), // This console.log is fine.
                toClassSelect.value
                    ? `<td class="classFeeCell">${classList.find(cls => cls._id === toClassSelect.value)?.fee}</td>
                       <td>
                       <input type="text"   data-student-id="${student._id}"
 class="discountInput" value="${student.feeDetails.school.discount}"  />
                       </td>
                       <td class="netFeeCell">${calculateNewNetFee(classList.find(cls => cls._id === toClassSelect.value)?.fee, student.feeDetails.school.discount)}</td>`
                    : ''
                }

            </tr>
            `;
        });

        tableBody.querySelectorAll('.feeStrSelect').forEach(select => {
            select.addEventListener('change', findClassForFeeStr);

        });
    }

}


const calculateNewNetFee = (classFee, discount) => {


    return classFee - discount;
}

let studentDiscounts = [];


tableBody.addEventListener('input', function (e) {
    if (e.target.classList.contains('discountInput')) {
     const row = e.target.closest('tr');

        const studentId = e.target.dataset.studentId;
        const discount = Number(e.target.value) || 0;
        const classFeeCell = row.querySelector('.classFeeCell')

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
        netFeeCell.textContent = calculateNewNetFee(classFeeCell.textContent,discount);


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
            studentDiscounts,
            stdFeeStructures
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


// / fetch fee structure
async function loadFeeStructures() {
    console.log(user)
    console.log('loading fee structures')
    if (!campusId) return;
    try {
        const url = `http://localhost:3000/api/fee-structure?schoolId=${user[0].school._id}&&campusId=${campusId}`;
        const res = await axios.get(url);
        feeStructures = res.data.data;

        console.log(feeStructures)
    } catch (err) {
        console.error("Error loading fee structures:", err.response?.data?.message || err.message);
    }
}
let stdFeeStructures = {}
let findClassForFeeStr = (e) => {
    if(toClassSelect.value){
    const row = e.target.closest('tr');

    const netFeeCell = row.querySelector('.netFeeCell');
    const classFeeCell = row.querySelector('.classFeeCell')

    const selectedOption = e.target.options[e.target.selectedIndex];
    const newClass = selectedOption.dataset.classId;
    console.log(classList)
    console.log(newClass)
    var newClassD_fee = classList.find(cls => cls._id == newClass).fee
    console.log(newClassD_fee)
    const feeStructureId = selectedOption.value;

    // Check if student has a discount
    const studentId = e.target.dataset.studentId;
    const student = studentList.find(std=> std._id == studentId )
    const studentDiscount = studentDiscounts.find(sd => sd.studentId === studentId)?.discount || student.feeDetails.school.discount;

    if (feeStructureId == "default_class_fee") {
        classFeeCell.textContent = newClassD_fee
        netFeeCell.textContent = calculateNewNetFee(newClassD_fee, studentDiscount);
    stdFeeStructures[studentId] = feeStructureId

        return
    }
    const feeStr = feeStructures.find(fee => fee._id == feeStructureId);
    const classes = feeStr ? feeStr.classFees : [];
    const selectedClass = classes.find(cls => cls.classId._id == newClass);

    ;

    const classFee = selectedClass ? selectedClass.Fee : 0;
    classFeeCell.textContent = classFee;

    stdFeeStructures[studentId] = feeStructureId
    console.log(stdFeeStructures)

    // Update net fee considering discount
    netFeeCell.textContent = calculateNewNetFee(classFee, studentDiscount);
}
else{
stdFeeStructures ={}
console.log(stdFeeStructures)
}
}
