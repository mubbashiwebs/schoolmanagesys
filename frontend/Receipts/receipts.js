  const user = JSON.parse(localStorage.getItem("userData"));
  const isSuperAdmin = user[0]?.designation === "supremadmin";
const currentPage = null
var campusId = user[0]?.campus?._id || null;

const masterIdInpt = document.getElementById("masterIdInput");
const getStudentBtn = document.getElementById("getStudentBtn");
let tableBody = document.getElementById("receiptsTableBody");
let form = document.getElementById("receiptForm");

let selectedStudentId = null;
let stdClass = null;
let stdSection = null;

  async function getStudentByMasterId() {
    const masterId = masterIdInpt.value;
    if (!masterId) {
      alert("Please enter a Master ID");
      return;
    }
    if(isSuperAdmin) {
      campusId = campusSelectBox1.querySelector("select")?.value;
    }

    try {
      const response = await api.post(
        `/student/getByMasterId/${masterId}`,
        { campusId: campusId },
        { withCredentials: true }
      );

      console.log(response.data);
      selectedStudentId = response.data._id;
      stdClass = response.data.class?._id || null;
      stdSection = response.data.section?._id || null;
      // Example: UI me show karna
      document.getElementById("result").innerHTML = `
        <div class="bg-white p-2 rounded-lg border border-slate-100">
                <p class="text-slate-400 uppercase tracking-wider font-bold">Name</p>
                <p id="studentName" class="text-slate-700 font-medium">${response.data.name}</p>
              </div>
              <div class="bg-white p-2 rounded-lg border border-slate-100">
                <p class="text-slate-400 uppercase tracking-wider font-bold">Father</p>
                <p id="studentFather" class="text-slate-700 font-medium">${response.data.fatherName}</p>
              </div>
              <div class="bg-white p-2 rounded-lg border border-slate-100">
                <p class="text-slate-400 uppercase tracking-wider font-bold">Class</p>
                <p id="studentClass" class="text-slate-700 font-medium">${response.data.class?.name || 'N/A'}-${response.data.section?.name || 'N/A'}</p>
              </div>
              <div class="bg-white p-2 rounded-lg border border-slate-100">
                <p class="text-slate-400 uppercase tracking-wider font-bold">GR #</p>
                <p id="studentGR" class="text-slate-700 font-medium">${response.data.grNumbers.school}</p>
              </div>
      `;

    } catch (error) {
        selectedStudentId = null;
      console.error(error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Error fetching student");
      document.getElementById("result").innerHTML = `
        <div class="bg-white p-2 rounded-lg border border-slate-100">
                <p class="text-slate-400 uppercase tracking-wider font-bold">Name</p>
                <p id="studentName" class="text-slate-700 font-medium">-</p>
              </div>
              <div class="bg-white p-2 rounded-lg border border-slate-100">
                <p class="text-slate-400 uppercase tracking-wider font-bold">Father</p>
                <p id="studentFather" class="text-slate-700 font-medium">-</p>
              </div>
              <div class="bg-white p-2 rounded-lg border border-slate-100">
                <p class="text-slate-400 uppercase tracking-wider font-bold">Class</p>
                <p id="studentClass" class="text-slate-700 font-medium">-</p>
              </div>
              <div class="bg-white p-2 rounded-lg border border-slate-100">
                <p class="text-slate-400 uppercase tracking-wider font-bold">GR #</p>
                <p id="studentGR" class="text-slate-700 font-medium">-</p>
              </div>
      `;
    }
  }


 let allReceipts = [];

// =====================================
// 📥 FETCH ALL RECEIPTS
// =====================================
async function fetchReceipts() {
  try {
    const res =  isSuperAdmin ? await api.get('/receipts/') : await api.get(`/receipts/byCampus/${campusId}`);
    allReceipts = res.data.data;   // 🔥 store globally
    console.log("Fetched Receipts:", allReceipts);
    renderReceipts(allReceipts);
  } catch (err) {
    console.error("Fetch Receipt Error:", err);
  }
}

// =====================================
// 🖥 RENDER RECEIPTS TABLE
// =====================================
function renderReceipts(receipts) {
    console.log(tableBody)
  tableBody.innerHTML = "";
if (receipts.length === 0) {
  return tableBody.innerHTML = `
    <tr>
      <td colspan="6" class="text-center py-6 text-slate-400">
        No matching receipts found
      </td>
    </tr>
  `;
}

  receipts.forEach((r) => {
    const row = document.createElement("tr");
    row.className =
      "hover:bg-slate-50/80 transition-colors group";

    row.innerHTML = `
      <td class="px-6 py-4 font-mono text-xs text-slate-400">
        #${r.receiptNumber}
      </td>

      <td class="px-6 py-4">
        <div class="font-semibold text-slate-700">
          ${r.student?.name || "-"} | ${r.student?.fatherName || "-"}
        </div>
        <div class="text-xs text-slate-400">
          Class: ${r.student?.class?.name || "-"} 
          | GR: ${r.student?.grNumbers?.school || "-"}
        </div>
      </td>
       <td class="px-6 py-4 font-bold text-slate-900">
        ${r.class?.name || "-"} - ${r.section?.name || "-"}
      </td>
  <td class="px-6 py-4 font-bold text-slate-900">
        ${r.type || "-"}
      </td>
      <td class="px-6 py-4 font-bold text-slate-900">
        Rs. ${r.amount}
      </td>

      <td class="px-6 py-4">
        <span class="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
          ${r.paymentMethod}
        </span>
      </td>

      <td class="px-6 py-4 text-slate-500">
        ${new Date(r.date).toLocaleDateString()}
      </td>

   
      <td class="px-6 py-4 text-right space-x-2">
  <button onclick="printReceipt('${r._id}')"
    class="opacity-0 group-hover:opacity-100 px-3 py-1 text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 text-xs transition">
    Print
  </button>

  <button onclick="deleteReceipt('${r._id}')"
    class="opacity-0 group-hover:opacity-100 px-3 py-1 text-red-500 border border-red-200 rounded-md hover:bg-red-50 text-xs transition">
    Delete
  </button>
</td>
     
    `;

    tableBody.appendChild(row);
  });
}

// =====================================
// ➕ CREATE RECEIPT
// =====================================
async function formSubmitHandler() {
  campusId = isSuperAdmin ? campusSelectBox1.querySelector("select")?.value : campusId
const receiptType = document.getElementById("receiptType").value;
  if (!selectedStudentId) {
    alert("Please search and select a student first");
    return;
  }
console.log(campusId, receiptType)
  const receiptData = {
    student: selectedStudentId,
    amount: document.getElementById("amount").value,
    date: document.getElementById("date").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    campusId,
    classId: stdClass,
    sectionId: stdSection,
    receiptType
  };

  try {
    await api.post(`/receipts/`, receiptData, {
      withCredentials: true,
    });

    alert("Receipt Generated Successfully ✅");

  
    selectedStudentId = null;


    fetchReceipts();

  } catch (error) {
    alert(error.response?.data?.message || "Error creating receipt");
  }
}

// =====================================
// ❌ DELETE RECEIPT
// =====================================
async function deleteReceipt(id) {
  if (!confirm("Are you sure you want to delete this receipt?"))
    return;

  try {
    await api.delete(`/receipts/${id}`, {
      withCredentials: true,
    });

    fetchReceipts();
  } catch (error) {
    alert("Error deleting receipt");
  }
}

// =====================================
// 🚀 INITIAL LOAD
// =====================================
fetchReceipts();


async function printReceipt(id) {
  try {
    const res = await api.get(`/receipts/${id}`, {
      withCredentials: true,
    });

    const r = res.data.data;
    console.log(r);

    const printWindow = window.open("", "", "width=900,height=700");

    printWindow.document.write(`
      <html>
      <head>
        <title>Receipt #${r.receiptNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            background: #f8fafc;
          }

          .receipt-box {
            max-width: 700px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
          }

          .header {
            text-align: center;
            margin-bottom: 30px;
          }

          .header h1 {
            margin: 0;
            font-size: 22px;
            letter-spacing: 1px;
          }

          .receipt-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .section {
            margin-bottom: 15px;
          }

          .label {
            font-weight: bold;
            color: #555;
          }

          .amount-box {
            margin-top: 25px;
            padding: 15px;
            background: #f1f5f9;
            border-radius: 6px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }

          @media print {
            body {
              background: white;
            }
            .receipt-box {
              box-shadow: none;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt-box">

          <div class="header">
            <h1>School Fee Receipt</h1>
            <p>Receipt No: #${r.receiptNumber}</p>
          </div>

          <div class="receipt-info">
            <div>
              <div class="section">
                <span class="label">Student Name:</span>
                ${r.student?.name || "-"}
              </div>

              <div class="section">
                <span class="label">Father Name:</span>
                ${r.student?.fatherName || "-"}
              </div>

              <div class="section">
                <span class="label">Class:</span>
                ${r.student?.class?.name || "-"}
              </div>

              <div class="section">
                <span class="label">GR Number:</span>
                ${r.student?.grNumbers?.school || "-"}
              </div>
            </div>

            <div>
              <div class="section">
                <span class="label">Date:</span>
                ${new Date(r.date).toLocaleDateString()}
              </div>

              <div class="section">
                <span class="label">Payment Method:</span>
                ${r.paymentMethod}
              </div>
            </div>
          </div>

          <div class="amount-box">
            Amount Paid: Rs. ${r.amount}
          </div>

          <div class="footer">
            This is a computer generated receipt.<br>
            No signature required.
          </div>

        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>

      </body>
      </html>
    `);

    printWindow.document.close();
  } catch (error) {
    alert("Error printing receipt");
  }
}


const searchInput = document.getElementById("receiptSearchInput");

searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase().trim();

  const filtered = allReceipts.filter((r) => {
    const name = r.student?.name?.toLowerCase() || "";
    const masterId = r.student?.masterId?.toString() || "";
    const grNumber = r.student?.grNumbers?.school?.toString() || "";

    return (
      name.includes(value) ||
      masterId.includes(value) ||
      grNumber.includes(value)
    );
  });

  renderReceipts(filtered);
});
