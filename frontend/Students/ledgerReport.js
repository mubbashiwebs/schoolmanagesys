    const user = JSON.parse(localStorage.getItem("userData")) || [];
    const isSuperAdmin = user[0]?.designation === "supremeadmin";
    document.getElementById("reportForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        grNo: document.getElementById("grNo").value.trim(),
        feeType: document.getElementById("feeType").value,

        campusId: user[0]?.campus._id || "",
        schoolId: user[0]?.school._id || "",

      };

      try {
        const res = await fetch("http://localhost:3000/api/student/leisurereport", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!data.success) {
          alert(data.message || "Student not found!");
          return;
        }

        document.getElementById("reportResult").style.display = "block";

        // Student Info
        const s = data.student;
        console.log(s);
        const feeType = payload.feeType;
        document.getElementById("studentInfo").innerHTML = `
          <p><strong>Name:</strong> ${s.name}</p>
          <p><strong>Father Name:</strong> ${s.fatherName}</p>
          <p><strong>Class:</strong> ${s.class.name || "N/A"}</p>
          <p><strong>GR No:</strong> ${s.grNumbers[feeType]} </p>
        `;
        console.log(data.vouchers, data.receipts);

        // Combine voucher + receipt data month-wise
        const months = Array.from(
          new Set([
            ...data.vouchers.map(v => v.month),
            ...data.receipts.map(r => r.month)
          ])
        ).sort();

        const rows = [];
        let index = 1;
        months.forEach(month => {
          console.log(month);
          const voucher = data.vouchers.find(v => v.month === month);
          const receipt = data.receipts.find(r => r.month === month);
          console.log(voucher, receipt);
          const voucherAmount = voucher ? voucher.totalPayable || 0 : 0;
          const receiptAmount = receipt ? receipt.totalPayable || 0 : 0;
          const dueDate = voucher && voucher.dueDate ? new Date(voucher.dueDate).toLocaleDateString() : "-";
          const lateFee = receipt ? receipt.totalPayable - voucher.totalPayable || 0 : 0;

          // 👇 if no receipt, show N/A instead of 0
          const paidAmount = receipt ? receipt.amount || 0 : "N/A";
          const paidDate = receipt && receipt.date ? new Date(receipt.date).toLocaleDateString() : "N/A";

          const balance = receipt ? receipt.balanceAfterPayment : 'N/A';

          rows.push(`
            <tr class="${balance > 0 ? 'highlight' : ''}">
              <td>${index++}</td>
              <td>${month}</td>
              <td>${dueDate}</td>
              <td>${voucherAmount}</td>
                <td>${lateFee}</td>

                <td>${receiptAmount}</td>
              <td>${paidDate}</td>
              <td>${paidAmount}</td>
              <td>${balance}</td>
            </tr>
          `);
        });

        document.getElementById("reportTable").innerHTML = rows.join("");

      } catch (err) {
        console.error(err);
        alert("Error fetching report");
      }
    });
