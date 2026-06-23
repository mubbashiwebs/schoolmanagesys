let classSelect = document.getElementById('Class')
let sectionSelect = document.getElementById('section')
let feeStrSelect = document.getElementById('feeStr')
let upadteBtn = document.getElementById('updateButton')

let schoolId = user[0].school._id
let campusId = isSuperAdmin ? null : user[0].campus._id
loadClasses()
loadSections()
let classList = []
async function loadClasses() {
    if (!campusId) return;
    try {
        let res = await axios.get(`${backendUrl}/api/class/getByCampus/${user[0].school._id}/${campusId}`);

        classList = res.data.data;
        console.log(classList)
        populateDropDown(classSelect,classList,'Class')
    } catch (err) {
        alert(err.response?.data?.message)
        console.error("Error loading classes:", err);
    }

}

let sectionList = []
async function loadSections() {
    if (!campusId) return;
    try {
        let res = await axios.get(`${backendUrl}/api/section/getByCampus/${user[0].school._id}/${campusId}`);

        sectionList = res.data.data;
        console.log(sectionList)
        populateDropDown(sectionSelect,sectionList,"Section")
    } catch (err) {
        alert(err.response?.data?.message)
        console.error("Error loading classes:", err);
    }

}

var feeStructures = []
async function loadFeeStructures() {
    console.log('loading fee structures')
    if (!campusId) return;
    try {
        const url = `http://localhost:3000/api/fee-structure?schoolId=${user[0].school._id}&&campusId=${campusId}`;
        const res = await axios.get(url);
        feeStructures = res.data.data;
        populateDropDown(feeStrSelect,feeStructures,"Fee Structure")
        console.log(feeStructures)
    } catch (err) {
        console.error("Error loading fee structures:", err);
    }
}

var studentList = []
async function loadStudents(classId,sectionId) {
    if(classId && sectionId ){
    try {
        let res = await axios.get(`http://localhost:3000/api/student/getByClsAndSec/${classId}/${sectionId}`);
        console.log(res.data);
        studentList = res.data;
    
    } catch (error) {
        console.error("Error loading students:", error.response?.data?.message || error.message);
    }}
   
}

// Handle Classes , Section and Fee Structure on Campus Select
campusSelectBox2.addEventListener('change', (e) => {
    const selectedCampusId = e.target.value;
    campusId = selectedCampusId;

    loadFeeStructures()
    loadSections()
    loadClasses();
});

classSelect.addEventListener('change',(e)=>{
    loadStudents(e.target.value, sectionSelect.value)
})
sectionSelect.addEventListener('change',(e)=>{
    loadStudents(classSelect.value, e.target.value)
})
function populateDropDown(select,list ,label){
    
    select.innerHTML = ""
    select.innerHTML = `<option value="">Select ${label}</option>`
    list.map((ls)=>{
      select.innerHTML += `<option value="${ls._id}">${ls.name}</option>`
    })
}