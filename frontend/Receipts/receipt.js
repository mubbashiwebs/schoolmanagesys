     const user = JSON.parse(localStorage.getItem("userData")) || [];
    const isSuperAdmin = user[0]?.designation === "supremeadmin";

    const campusWrap = document.getElementById('campusWrap');
const campusSelect = document.getElementById('campusSelect');
    window.onload = init;
 function init() {
      if (isSuperAdmin) {
        campusWrap.style.display = 'block';
        loadCampuses();
      }
    }
    let campusList = [];    
    async function loadCampuses() {
      if (isSuperAdmin) {

      try {
        const res = await axios.get(`${backendUrl}/api/campus/getBySchool/${user[0].school._id}`);

        campusList = res.data;
        console.log(campusList)
      campusSelect.innerHTML = `<option value="">Select Campus</option>`;

        campusList.forEach(campus => {
          const option = document.createElement("option");
          option.value = campus._id;
          option.textContent = campus.name;
          campusSelect.appendChild(option);
        });
      } catch (err) {
        console.error("Error fetching schools:", err);
      }
    }
    }

    const API_BASE = `${backendUrl}/api`;
    const voucherNoInput = document.getElementById('voucherNo');
    const feeTypeInput = document.getElementById('feeType');
    const getVoucherBtn = document.getElementById('getVoucherBtn');
    const voucherDetails = document.getElementById('voucherDetails');
    const saveReceiptBtn = document.getElementById('saveReceiptBtn');
    const alertBox = document.getElementById('alertBox');

    const amountInput = document.getElementById('amount');
    const balanceInput = document.getElementById('balance');

    const currentMonthTotalInput = document.getElementById('currentMonthTotal');
   

    let currentVoucher = null;
    let payableWithin = 0;
    let payableAfter = 0;
    let receipt = null;

    function showAlert(message, type = "success") {
      alertBox.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    }

    // ✅ Fetch Voucher
    getVoucherBtn.addEventListener('click', async () => {
      const voucherNo = voucherNoInput.value.trim();
      const feeType = feeTypeInput.value;
      const campus = isSuperAdmin ? campusSelect.value : user[0].campus._id;
      const school = user[0].school._id;

      if (!voucherNo || !feeType || !campus || !school) {
        return showAlert("Please enter voucher number and select fee type and campus and school", "warning");
      }

      try {
        voucherDetails.classList.toggle('d-none');

        const res = await fetch(`${API_BASE}/voucher/single`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ voucherNo, feeType , campus, school})
        });
        const data = await res.json();
        console.log(data);

        if (!res.ok) return showAlert(data.message || "Voucher not found", "danger");

        currentVoucher = data.data;
        console.log(currentVoucher);
        if(currentVoucher.voucherNo !== voucherNoInput.value){
            alert("This student has already a new voucher!");
          voucherNoInput.value = currentVoucher.voucherNo;
        }

        document.getElementById('studentName').value = currentVoucher.student?.name || "";
        document.getElementById('fatherName').value = currentVoucher.student?.fatherName || "";
        document.getElementById('className').value = currentVoucher.class?.name || "";
        document.getElementById('campusName').value = currentVoucher.campus?.name || "";
        document.getElementById('schoolName').value = currentVoucher.school?.name || "";
        document.getElementById('month').value = (currentVoucher.month) || "";
        document.getElementById('session').value = currentVoucher.session || "";
        document.getElementById('previousDueDetail').value = currentVoucher.previousDueDetail || "";
        if(currentVoucher.previousDuesDetail && currentVoucher.previousDuesDetail.length > 0){
          document.getElementById('previousDueDetail').value += currentVoucher.previousDuesDetail.map(item => `${item.month}: ${item.amount}`).join(", ");
          var previousDuesTotal = currentVoucher.previousDuesDetail.reduce((sum, item) => sum + item.amount, 0);
            document.getElementById('previousDueTotal').value = previousDuesTotal;
        }

        const cExtrasTotal = currentVoucher.breakdown.extras.reduce((sum, item) => sum + item.amount, 0);
        document.getElementById('currentMonthTotal').value = currentVoucher.breakdown.monthlyFee + cExtrasTotal || 0;
        payableWithin = currentVoucher.totalPayable || 0;
        payableAfter = currentVoucher.totalPayableWithLateFee || 0;

        document.getElementById('payableWithin').textContent = payableWithin;
        document.getElementById('payableAfter').textContent = payableAfter;

        document.getElementById('withinDueDate').checked = true;
        amountInput.value = payableWithin;
        balanceInput.value = 0;

        voucherDetails.classList.remove('d-none');
        showAlert("Voucher found successfully ✅", "success");
      } catch (error) {
        console.error(error);
        showAlert("Error fetching voucher", "danger");
      }
    });

    // ✅ When radio changes, update amount
    document.getElementById('withinDueDate').addEventListener('change', () => {
      if (document.getElementById('withinDueDate').checked) {
        amountInput.value = payableWithin;
        updateBalance();
      }
    });
    document.getElementById('afterDueDate').addEventListener('change', () => {
      if (document.getElementById('afterDueDate').checked) {
        amountInput.value = payableAfter;
        updateBalance();
      }
    });

    // ✅ Live balance calculation
    amountInput.addEventListener('input', updateBalance);
    function updateBalance() {
      let selectedTotal = document.getElementById('withinDueDate').checked ? payableWithin : payableAfter;
      let paid = Number(amountInput.value);
      console.log(paid)
      balanceInput.value = (selectedTotal - paid).toFixed(2);
    }

    // ✅ Save Receipt
    saveReceiptBtn.addEventListener('click', async () => {
      if (!currentVoucher) return showAlert("Please get a voucher first", "warning");

      const amount = amountInput.value;
      const paymentMethod = document.getElementById('paymentMethod').value;
      const note = document.getElementById('note').value;
      const totalPayable = document.getElementById('withinDueDate').checked ? payableWithin : payableAfter;

      if (!amount || !paymentMethod) {
        return showAlert("Amount and payment method are required", "warning");
      }

      const balance = Number(balanceInput.value) || 0;

      try {
        const res = await fetch(`${API_BASE}/receipt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            voucher: currentVoucher._id,
            student: currentVoucher.student._id,
            amount: Number(amount),
            paymentMethod,
            note,
            feeType: currentVoucher.feeType,
            month: currentVoucher.month,
            session: currentVoucher.session,
            balanceAfterPayment: balance,
            createdBy: user[0]._id,
            totalPayable,
            school: isSuperAdmin ? currentVoucher.school._id : user[0].school._id,
            campus: isSuperAdmin ? currentVoucher.campus._id : user[0].campus._id,
          })
        });
        const data = await res.json();
            receipt = data.receipt;

        if (!res.ok) return showAlert(data.message || "Failed to save receipt", "danger");

        showAlert("Receipt created successfully 🎉", "success");
      } catch (error) {
        console.error(error);
        showAlert("Error saving receipt", "danger");
      }
    });


const printReceipt = () => {
    const student = receipt.student || {};
    const voucher = receipt.voucher || {};
    const school = receipt.school || {};
    const campus = receipt.campus || {};
    console.log(receipt);
    // Format date and month
    const date = new Date(receipt.date).toLocaleDateString("en-GB");
    const month = receipt.month || voucher.month || "-";

    // Optional: voucher breakdown for table
    const breakdown = voucher.breakdown || {};
    const extras = breakdown.extras || [];

    const monthlyFee = breakdown.monthlyFee || 0;
    const extrasHtml = extras
      .map(
        (e) => `
        <tr>
          <td>${e.name}</td>
          <td class="text-end">${e.amount}</td>
        </tr>`
      )
      .join("");

    const previousDuesTotal = voucher.breakdown?.previousDuesTotal || 0;
    const paidAmount = receipt.amount || 0;
    const balance = receipt.balanceAfterPayment 

      const receiptContent = `<div class="receipt-container mt-0">
        <div class="header">
          <h2>${school.name }</h2>
          <p><strong>Campus:</strong> ${campus.name || "-" } | <strong>Phone:</strong> ${campus.contact || "-"}</p>
          <h5>Fee Receipt</h5>
        </div>

        <div class="row">
          <div class="col-6">
            <p><strong>Student Name:</strong> ${student.name || "-"}</p>
            <p><strong>Father Name:</strong> ${student.fatherName || "-"}</p>
            <p><strong>GR No:</strong> ${student.grNumbers[voucher.feeType] || "-"}</p>
          </div>
          <div class="col-6 text-end">
            <p><strong>Receipt No:</strong> ${receipt.receiptNo}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Month:</strong> ${month}</p>
          </div>
        </div>

       
        <table class="table table-bordered mt-2">
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-end">Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monthly Fee</td>
              <td class="text-end">${monthlyFee}</td>
            </tr>
            ${extrasHtml}
          </tbody>
          <tfoot>
            <tr>
              <th>Arrears</th>
              <td class="text-end">${previousDuesTotal}</td>
            </tr>
                <tr>
              <th>Total Amount</th>
              <th class="text-end">${receipt.totalPayable}</th>
            </tr>
            <tr>
              <th>Paid Amount</th>
              <th class="text-end">${paidAmount}</th>
            </tr>
            <tr>
              <th>Remaining Balance</th>
              <th class="text-end text-danger">${balance}</th>
            </tr>
          </tfoot>
        </table>

        <div class="row mt-2">
          <div class="col-6">
            <p><strong>Payment Method:</strong> ${receipt.paymentMethod || "-"}</p>
            <p><strong>Received By:</strong> ${
              receipt.createdBy?.username || "Admin"
            }</p>
          </div>
          <div class="col-6 text-end">
            <p><strong>Signature:</strong> _______________________</p>
          </div>
        </div>

     
      </div>`;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = receiptContent;
      window.print();
      document.body.innerHTML = originalContent;
    //   window.location.reload(); // Reload to restore event listeners
    };

    document.getElementById("getReceiptBtn").addEventListener("click", async () => {
  const stdGrno = document.getElementById("receiptNo").value.trim();
  const feeType = document.getElementById("feeTypeforSingle").value.trim();
  const month = document.getElementById("monthInput").value.trim();
  const session = document.getElementById("sessionforSingle").value.trim();
console.log({stdGrno, feeType, month, session});
  // Validation
  if (!stdGrno || !feeType || !month || !session ) {
    alert("Please fill all required fields.");
    return;
  }
if(!campusSelect.value){
    alert("Please select campus.");
    return;
  }
  // Request payload
  const payload = {
    stdGrno,
    feeType,
    month,
    session,
    campus: isSuperAdmin ? campusSelect.value : user[0].campus._id,
    school: user[0].school._id,

    // school and campus optional — backend handle karega
  };

  try {
    const res = await fetch(`${API_BASE}/receipt/student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      console.log("✅ Receipt Found:", data.data);
      renderReceiptDetails(data.data);
      receipt = data.data;
        // renderReceiptDetails(data.data);
      // Example display (you can make it fancy later)
      alert(`Receipt Found for ${data.data.student.name}\nFee Type: ${data.data.feeType}\nMonth: ${data.data.month}`);
    } else {
      alert(data.message || "Receipt not found.");
    }
  } catch (err) {
    console.error("❌ Error:", err);
    alert("Server error! Please try again later.");
  }
});

 function renderReceiptDetails(receipt) {
    // Implement rendering logic here


    const table= `
        <table class="table table-bordered mt-2">
            <thead>
            <tr>
                <th>Student Name</th>
                <th>Fee Type</th>
                <th>Month</th>
                <th>Session</th>
                <th class="text-end">PaidAmount (Rs)</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>${receipt.student.name}</td>
                <td>${receipt.feeType}</td>
                <td>${receipt.month}</td>
                <td>${receipt.session}</td>
                <td class="text-end">${receipt.amount}</td>
            </tr>
            </tbody>
        </table>
    `
    // document.getElementById('body').innerHTML += table;
  }

