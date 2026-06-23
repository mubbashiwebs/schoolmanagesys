 let campusList = [];
  var campusSelectBox1 = document.getElementById('campusSelectBox1')
  var campusSelectBox2 = document.getElementById('campusSelectBox2')
  // 🔽 Inject dropdown if superadmin
 // console.log(123)

  if (isSuperAdmin) {

    const campusDropdown = document.createElement("select");
    campusDropdown.className = "form-select mb-3";
    campusDropdown.id = "campusDropdown";
    campusDropdown.required = true;

    const label = document.createElement("label");
    label.innerHTML = "<i class='fa-solid fa-building'></i> Select Campus </br> ";
    label.setAttribute("for", "campusDropdown");
    label.className = "";

    const campusDropdownfilter = document.createElement("select");
    campusDropdownfilter.className = "form-select ";
    campusDropdownfilter.id = "campusDropdownfilter";
    campusDropdownfilter.required = true;

    const label2 = document.createElement("label");
    label2.textContent = "Select campus";
    label2.setAttribute("for", "campusDropdown");
    label2.className = "";

    const form = document.getElementById("classForm");
    if(campusSelectBox1){
    campusSelectBox1.appendChild(label2)
    campusSelectBox1.appendChild(campusDropdownfilter)
    }
    if(campusSelectBox2){
    campusSelectBox2.appendChild(label)
    campusSelectBox2.appendChild(campusDropdown)
    }
    
  if(!currentPage){
const currentPage = window.location.pathname.split("/").pop().toLowerCase();
// console.log(currentPage)
  }
  else{
// console.log(currentPage)
 
  }
    // 🟢 Fetch and populate campuses dropdown
    async function loadcampuses() {
      try {
        const res = await api.get(`/campus/getBySchool`);
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
        console.error("Error fetching campuses:", err.response?.data?.message || err.message);
      }
    }

    loadcampuses();
  

  }

  console.log(campusSelectBox1)