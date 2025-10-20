 let campusList = [];
  var campusSelectBox1 = document.getElementById('campusSelectBox1')
  var campusSelectBox2 = document.getElementById('campusSelectBox2')
  // 🔽 Inject dropdown if superadmin
  if (isSuperAdmin) {
 console.log(123)

    const campusDropdown = document.createElement("select");
    campusDropdown.className = "form-select mb-3";
    campusDropdown.id = "campusDropdown";
    campusDropdown.required = true;

    const label = document.createElement("label");
    label.textContent = "Select campus";
    label.setAttribute("for", "campusDropdown");
    label.className = "form-label";

    const campusDropdownfilter = document.createElement("select");
    campusDropdownfilter.className = "form-select ";
    campusDropdownfilter.id = "campusDropdownfilter";
    campusDropdownfilter.required = true;

    const label2 = document.createElement("label");
    label2.textContent = "Select campus";
    label2.setAttribute("for", "campusDropdown");
    label2.className = "";

    const form = document.getElementById("classForm");
    campusSelectBox1.appendChild(label2)
    campusSelectBox1.appendChild(campusDropdownfilter)

    campusSelectBox2.appendChild(label)
    campusSelectBox2.appendChild(campusDropdown)
    // 🟢 Fetch and populate campuses dropdown
    async function loadcampuses() {
      try {
        const res = await axios.get(`http://localhost:3000/api/campus/getBySchool/${user[0].school._id}`);
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

          const option2 = document.createElement("option");
          option2.value = "";
          option2.textContent = 'Select campus';
          campusDropdownfilter.appendChild(option2);
        campusList.forEach(campus => {
          const option2 = document.createElement("option");
          option2.value = campus._id;
          option2.textContent = campus.name;
          campusDropdownfilter.appendChild(option2);
        });
      } catch (err) {
        console.error("Error fetching campuses:", err);
      }
    }

    loadcampuses();
  }

const currentPage = window.location.pathname.split("/").pop().toLowerCase();

// if(currentPage === 'compcourse.html' || currentPage === 'englangcourse.html'){
//     if(isSuperAdmin){
//     campusDropdown?.addEventListener("change", ()=>{
//       const campus = campusDropdown?.value 
//       console.log(campus)
//       if(campus){
//         loadBatches(campus);
//       }
//     });
//     }
//     else{
//     loadBatches();

//     }
//   const batchSelectBox = document.querySelector(".batchSelectBox");
//        const batchDropdown = document.createElement("select");
//     batchDropdown.className = "form-select mb-3";
//     batchDropdown.id = "batchDropdown";
//     batchDropdown.required = true;

//     const label = document.createElement("label");
//     label.textContent = "Select batch";
//     label.setAttribute("for", "batchDropdown");
//     label.className = "form-label";
//     batchSelectBox.appendChild(label);
//     batchSelectBox.appendChild(batchDropdown);
//     console.log(batchSelectBox.innerHTML)
//     let batchList = [];
//     async function loadBatches(campus) {
//         batchDropdown.innerHTML = "";

//       try {
//  let res;
//         if (isSuperAdmin) {
//             console.log(campus)
//           res = await axios.get(`http://localhost:3000/api/batch/getByCampus/${user[0].school._id}/${campus}`);
//         } else {
//             consoley.log('working')
//           res = await axios.get(`http://localhost:3000/api/batch/getByCampus/${user[0].school._id}/${user[0].campus}`);
//         }
//         const Data = res.data.data;
//         batchList = Data.filter(batch => batch.courseType === (currentPage === 'compcourse.html' ? 'computer' : 'english'));

//         console.log(batchList)  
//           const option = document.createElement("option");
//           option.value = "";
//           option.textContent = 'Select Batch';
//           batchDropdown.appendChild(option);
//         batchList.forEach(batch => {
//           const option = document.createElement("option");
//           option.value = batch._id;
//           option.textContent = batch.name;

//           batchDropdown.appendChild(option);
//         });
//       } catch (err) {
//         console.error(err);
//         showToast("Failed to load batches", "bg-danger");
//       }
//     }
  

// }