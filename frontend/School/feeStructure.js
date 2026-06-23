 let campusId = isSuperAdmin ? null : (user[0]?.campus?._id || null);
    let classFees = [];
    let ClassList = [];
    let isEditMode = false;
    let saveBtn = document.querySelector('.btn-save');
    let cancelBtn = document.querySelector('.btn-cancel');
    async function loadClasses() {
        if(!campusId) return;
        try {
            let res = await api.get(`/class/getByCampus/${campusId}`);
            ClassList = res.data.data;
            populateClasses();
        } catch (err) {
            console.error("Error loading classes:", err);
            document.getElementById("ClassContainer").innerHTML = `<p>${err.response?.data.message || err.message}</p>`;
            
        }
    }

    function populateClasses() {
        
        const container = document.getElementById("ClassContainer");
        container.innerHTML = ""; 

     
        console.log(ClassList);
        if(isEditMode){
            console.log(cuurentFeeStructure);
            ClassList = cuurentFeeStructure.classFees.map(feeObj => {
                const cls = ClassList.find(c => c._id === feeObj.classId);
                return {
                    _id: feeObj.classId._id,
                    name: feeObj.classId.name || 'N/A',
                    fee: feeObj.Fee || 0
                };
            });
        }
           if(!ClassList || ClassList.length === 0) {
            container.innerHTML = "<p>No classes found for this campus.</p>";
            return;
        }
        console.log(ClassList);
        classFees = ClassList.map(c => ({
            classId: c._id,
            Fee: c.fee || 0
        }));
        ClassList.forEach(c => {
            container.innerHTML += `
                <div class="class-card">
                    <label title="${c.name}"><i class="fa-solid fa-graduation-cap"></i> ${c.name}</label>
                    <input type="number" id="${c._id}" class="feeInput" value="${c.fee || 0}" placeholder="Amount">
                </div>`;
                
        });

        // Event listener to track changes
        document.querySelectorAll('.feeInput').forEach(input => {
            input.addEventListener('input', (e) => {
                const classId = e.target.id;
                const fee = parseFloat(e.target.value) || 0;
                const className = ClassList.find(cl => cl._id === classId)?.name || 'N/A';
                
                const idx = classFees.findIndex(f => f.classId === classId);
                if (idx !== -1) {
                    classFees[idx].Fee = fee;
                } else {
                    classFees.push({ classId, Fee: fee });
                }
                console.log(classFees);
            });
        });
    }

    // Campus selection logic
    window.addEventListener('load', () => {
        const campusBox = document.getElementById("campusSelectBox2");
        if(campusBox) {
            campusBox.addEventListener("change", e => {
                campusId = e.target.value;
                loadClasses();
            });
        }
        loadClasses();
    });
let allClassesFees = [];
async function saveFeeStructure() {
    const name = document.getElementById("feeName").value;
   
    console.log(allClassesFees);
    if (!name || !campusId || classFees.length === 0) {
        alert("Please fill all fields and enter at least one fee.");
        return;
    }

    // ensure every class has entry
    console.log(ClassList);
    ClassList.forEach(cls => {
        console.log(cls._id);
        const exists = classFees.some(
            feeObj => feeObj.classId.toString() === cls._id.toString()
        );

        console.log(exists)

        if (!exists) {
            classFees.push({
                classId: cls._id,
                Fee: 0
               
            });
        }
    });

    console.log({ name, classFees, campusId });
if(isEditMode){
        const result = await Swal.fire({
    title: 'Are you sure?',
    text: "All Linked Students Class Fee will be updated !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, Update!'
  });
  if (!result.isConfirmed) return;
    await updateFeeStructure();
    return;
}
    try {
        await api.post("/fee-structure/add", {
            name,
            classFees,
          
            campusId
        });
        alert("Fee Structure Saved Successfully!");
    } catch (err) {
        console.error(err);
        alert("Failed to save fee structure.");
    }
}
const API_URL = "/fee-structure";
    const params = {
        campusId: isSuperAdmin ? null : user[0].campus._id
    };
    
var structures = [];
            const tableBody = document.getElementById('feeTableBody');

    campusSelectBox1.addEventListener('change',(e)=>{
        params.campusId = e.target.value
        fetchFeeStructures()
    })

    // 1. Fetch Data using api
    async function fetchFeeStructures() {
      if(!params.campusId)return
        try {
            const response = await api.get(API_URL, { params });
             structures = response.data.data;
            console.log(structures);
            filters()
    //         if(structures.length <=0){
    //             console.log('reach')
    //             tableBody.innerHTML = ` <tr>
    //                     <td style='text-align:center' colspan=2>No Record Found.</td>
                    
    //                     </tr>`
    //                     return
    //         }
    //         structures.forEach(item => {
    //             tableBody.innerHTML += `
    //                 <tr>
    //                     <td><strong>${item.name || 'Monthly Fee'}</strong></td>
    //                      <td style="text-align: right;">
    //                     <button class=" btn-edit" onclick="editStructure('${item._id}')">
    //     <i class="fa-solid fa-pen-to-square"></i> Edit
    // </button>
    //                     </td>
    //                     <td style="text-align: left;">
    //                         <button class="btn-delete" onclick="deleteStructure('${item._id}')">
    //                             <i class="fa-solid fa-trash-can"></i> Delete
    //                         </button>
    //                     </td>
    //                 </tr>
    //             `;
    //         });
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Could not load fee structures.");
        }
    }

    
    const renderTable = (structures)=>{
            tableBody.innerHTML = ''; 

         if(structures.length <=0){
                console.log('reach')
                tableBody.innerHTML = ` <tr>
                        <td style='text-align:center' colspan=2>No Record Found.</td>
                    
                        </tr>`
                        return
            }
            structures.forEach(item => {
                tableBody.innerHTML += `
                    <tr>
                        <td><strong>${item.name || 'Monthly Fee'}</strong></td>
                         <td style="text-align: right;">
                        <button class=" btn-edit" onclick="editStructure('${item._id}')">
        <i class="fa-solid fa-pen-to-square"></i> Edit
    </button>
                        </td>
                        <td style="text-align: left;">
                            <button class="btn-delete" onclick="deleteStructure('${item._id}')">
                                <i class="fa-solid fa-trash-can"></i> Delete
                            </button>
                        </td>
                    </tr>
                `;
            });
    }

    // 2. Delete Data using api
    async function deleteStructure(id) {
        if (!confirm("Are you sure you want to delete this?")) return;

        try {
            await api.delete(`${API_URL}/${id}`);
            alert("Structure deleted successfully!");
            fetchFeeStructures(); // Refresh table
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Error deleting record.");
        }
    }
    
    var cuurentFeeStructure = null;
    function editStructure(id) {
        cuurentFeeStructure = structures.find(fs => fs._id === id);
        if(!cuurentFeeStructure) {
            alert("Fee structure not found!");
            return;
        }
        document.getElementById("feeName").value = cuurentFeeStructure.name || '';
        classFees = cuurentFeeStructure.classFees.map((fee) => ({ classId: fee.classId._id, Fee: fee.Fee })) || [];
        campusId = cuurentFeeStructure.campusId || '';
     
        campusSelectBox2.querySelector('select').value = campusId;
        saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Update Fee Structure';
        cancelBtn.style.display = 'inline-block';
        isEditMode = true;
        console.log(ClassList,classFees);
        populateClasses();
    }
    fetchFeeStructures();
    function cancel() {
        document.getElementById("feeName").value = '';
        classFees = [];
        isEditMode = false;
        cuurentFeeStructure = null;
        saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Fee Structure';
        cancelBtn.style.display = 'none';
        ClassList = [];
         campusSelectBox2.querySelector('select').value = '';
        populateClasses();
    }
    async function updateFeeStructure() {
        // Similar to saveFeeStructure but uses PUT method
        if (!cuurentFeeStructure) {
            alert("No structure selected for update.");
            return;
        }
        // Similar to saveFeeStructure but uses PUT method
        const name = document.getElementById("feeName").value;
        if (!name || !campusId || classFees.length === 0) {
            alert("Please fill all fields and enter at least one fee.");
            return;
        }
        try {
            const res = await api.put(`${API_URL}/${cuurentFeeStructure._id}`, {
                name,
                classFees,
               
                campusId
            });
            alert(res.data.message || "Fee Structure Updated Successfully!");
            isEditMode = false;
            cuurentFeeStructure = null;
            saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Fee Structure';
            cancelBtn.style.display = 'none';
            document.getElementById("feeName").value = '';
            campusSelectBox2.querySelector('select').value = '';
            classFees = [];
            ClassList = [];
            fetchFeeStructures(); // Refresh table
            populateClasses();
        } catch (err) {
            console.error(err);
            alert("Failed to update fee structure.");
        }
    }
var searchInput = document.getElementById('search');

if (searchInput) {
  searchInput.addEventListener('input', filters);
}

function filters() {
    
  var filteredStr = structures.filter((str) => {

    var matchName =
      !searchInput.value ||
      str.name.toLowerCase().includes(searchInput.value.toLowerCase());

    var matchCampus = params.campusId == str.campusId; // future use

    return matchName && matchCampus;
  });

  console.log(filteredStr);
  renderTable(filteredStr);
}
