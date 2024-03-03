const btn = document.getElementById("submit");

const d = new Date().toLocaleString("en-us", {
  timeStyle: "short",
  dateStyle: "full",
});



btn.addEventListener("click", (e) => {
  e.preventDefault();

  const expense = document.getElementById("addexpense").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const token = localStorage.getItem("token");
  axios
    .post(
      "/expense/addexpense",
      {
        expense: expense,
        description: description,
        category: category,
      },
      {
        headers: { Authorization: token },
      }
    )
    .then((res) => {
      console.log(res);
      const { id, createdAt } = res.data;

      const expenseList = document.getElementById("expenses-list");
      const expenseTable = document.getElementById("expensestable");

      const row = document.createElement("tr");
      row.setAttribute("id", `data-${id}`);

      const expenseCell = document.createElement("td");
      expenseCell.textContent = expense;

      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = description;

      const categoryCell = document.createElement("td");
      categoryCell.textContent = category;

      const dateCell = document.createElement("td");
      dateCell.textContent = createdAt.toLocaleString().substring(0, 10);

      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete Expense";
      deleteButton.addEventListener("click", () => deleteExpense(id));
      deleteCell.appendChild(deleteButton);

      row.appendChild(dateCell);
      row.appendChild(expenseCell);
      row.appendChild(descriptionCell);
      row.appendChild(categoryCell);
      row.appendChild(deleteCell);

      expenseTable.appendChild(row);
    })
    .catch((err) => {
      console.log(err);
    });
});

window.addEventListener("load", async (e) => {
  try {
    const token = localStorage.getItem("token");
    const decodetoken = parseJwt(token);
    const ispremium = decodetoken.ispremiumuser;
    const response = await axios.get("/expense/getexpenses", {
      headers: { Authorization: token },
    });
    console.log(response);
    const expenses = response.data;

    if (ispremium) {
      premiumusersexpenses(expenses);
      showpremiummessage();
      return;
    }

    const expensesBody = document.getElementById("expenses-list");

    const expenseHeading = document.createElement("p");
    expenseHeading.innerHTML = ` <h1 style="color":"red"> Day to Day expense Tracker </h1>`;
    expensesBody.appendChild(expenseHeading);

    const expensesTable = document.createElement("table");
    expensesTable.setAttribute("id", "expensestable");

    const headingsRow = document.createElement("tr");
    const headings = [
      "Created At",
      "Expense",
      "Description",
      "Category",
      "Actions",
    ];
    headings.forEach((headingText) => {
      const headingCell = document.createElement("th");
      headingCell.textContent = headingText;
      headingsRow.appendChild(headingCell);
    });
    expensesTable.appendChild(headingsRow);

    console.log();
    expenses.forEach((expense) => {
      const row = document.createElement("tr");
      row.setAttribute("id", `data-${expense.id}`);

      const dateCell = document.createElement("td");
      dateCell.textContent = expense.createdAt
        .toLocaleString()
        .substring(0, 10);

      const expenseCell = document.createElement("td");
      expenseCell.textContent = expense.expense;

      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = expense.description;

      const categoryCell = document.createElement("td");
      categoryCell.textContent = expense.category;

      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete Expense";
      deleteButton.addEventListener("click", () => deleteExpense(expense.id));
      deleteCell.appendChild(deleteButton);

      row.appendChild(dateCell);
      row.appendChild(expenseCell);
      row.appendChild(descriptionCell);
      row.appendChild(categoryCell);
      row.appendChild(deleteCell);

      expensesTable.appendChild(row);
    });
    expensesBody.appendChild(expensesTable);
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
});

// Function to delete an expense
async function deleteExpense(expenseId) {
  try {
    const expenseElement = document.querySelector(
      `#expenses-list [id=data-${expenseId}]`
    );
    // console.log(expenseElement);
    if (expenseElement) {
      expenseElement.remove();
    }
    const token = localStorage.getItem("token");
    await axios.delete(`/expense/delete/${expenseId}`, {
      headers: { Authorization: token },
    });
  } catch (error) {
    console.log("Error deleting expense:", error);
  }
}

document.getElementById("premium").addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");
  console.log(token);

  const response = await axios.get("/purchase/buypremiummembership", {
    headers: { Authorization: token },
  });
  console.log(response);
  console.log("iam here at premium membership");
  try {
    let options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      // This function will handle the success of payment
      handler: async function (response) {
        const res = await axios.post(
          "/purchase/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          {
            headers: { Authorization: token },
          }
        );

        alert("You are premium member now ");
        // localStorage.setItem("token", res.data.token);
        showpremiummessage();
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", function (response) {
      console.log(response);
      alert("something went wrong");
    });
  } catch (err) {
    console.log(err);
  }
});

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function showpremiummessage() {}

document.getElementById("leaderboard").addEventListener("click", async (e) => {
  try {
    const token = localStorage.getItem("token");
    const leaderboardArray = await axios.get("/premium/showleaderboard", {
      headers: { Authorization: token },
    });

    console.log(leaderboardArray);

    const leaderboardTable = document.createElement("table");
    leaderboardTable.innerHTML = "<h1>Leaderboard</h1>";

    const headingsRow = document.createElement("tr");
    const headings = ["Name", "Total Expense"];
    headings.forEach((headingText) => {
      const headingCell = document.createElement("th");
      headingCell.textContent = headingText;
      headingsRow.appendChild(headingCell);
    });
    leaderboardTable.appendChild(headingsRow);

    const leaderboardelements = document.getElementById("leaderboardelements");
    leaderboardelements.innerHTML = "";

    leaderboardArray.data.forEach((userDetails) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${userDetails.username}</td><td>${userDetails.total_cost}</td>`;
      leaderboardTable.appendChild(row);
    });
    leaderboardTable.style.width = "50%";

    leaderboardelements.appendChild(leaderboardTable);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }
});

function premiumusersexpenses(expenses) {
  document.getElementById("premium").style.visibility = "hidden";

  const youarepremium = document.getElementById("youarepremium");
  youarepremium.innerText = "You are Premium User now";

  const leaderboard = document.getElementById("leaderboard");
  leaderboard.style.visibility = "visible";
  leaderboard.innerText = "Show Leaderboard";
  const thisyearExpenses = expenses.filter((expense) => {
    return (
      expense.createdAt.substring(0, 4) == new Date().getFullYear().toString()
    );
  });

  const thismonthExpenses = thisyearExpenses.filter((expense) => {
    return (
      parseInt(expense.createdAt.substring(5, 7)) - 1 == new Date().getMonth()
    );
  });
  console.log(thisyearExpenses);
  const month = new Date().getMonth();
  const monthName = new Date().toLocaleString("en-us", { month: "long" });

  const expensesBody = document.getElementById("expenses-list");

  const expenseHeading = document.createElement("p");
  expenseHeading.innerHTML = ` <h1 style="color":"red"> Day to Day expense Tracker </h1>`;
  expensesBody.appendChild(expenseHeading);

  const expensesTable = document.createElement("table");
  expensesTable.setAttribute("id", "expensestable");

  const heading = document.createElement("p");
  heading.innerHTML = `<h1> ${monthName} ${new Date().getFullYear()} Expense </h1>`;
  expensesBody.appendChild(heading);

  const headingsRow = document.createElement("tr");
  const headings = [
    "Created At",
    "Expense",
    "Description",
    "Category",
    "Actions",
  ];
  headings.forEach((headingText) => {
    const headingCell = document.createElement("th");
    headingCell.textContent = headingText;
    headingsRow.appendChild(headingCell);
  });
  expensesTable.appendChild(headingsRow);

  console.log(thismonthExpenses);
  thismonthExpenses.forEach((expense) => {
    const row = document.createElement("tr");
    row.setAttribute("id", `data-${expense.id}`);

    const dateCell = document.createElement("td");
    dateCell.textContent = expense.createdAt.toLocaleString().substring(0, 10);

    const expenseCell = document.createElement("td");
    expenseCell.textContent = expense.expense;

    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = expense.description;

    const categoryCell = document.createElement("td");
    categoryCell.textContent = expense.category;

    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Expense";
    deleteButton.addEventListener("click", () => deleteExpense(expense.id));
    deleteCell.appendChild(deleteButton);

    row.appendChild(dateCell);
    row.appendChild(expenseCell);
    row.appendChild(descriptionCell);
    row.appendChild(categoryCell);
    row.appendChild(deleteCell);

    expensesTable.appendChild(row);
  });
  expensesBody.appendChild(expensesTable);

  let totalyearExpense = 0;
  thisyearExpenses.forEach((expense) => {
    console.log(expense.expense);
    totalyearExpense += expense.expense;
  });

  console.log(totalyearExpense);

  const totalYearExpensesTable = document.createElement("table");
  const totalYearHeadingRow = document.createElement("tr");
  const totalYearHeadingCell = document.createElement("th");
  totalYearHeadingCell.textContent = `Total Year ${new Date().getFullYear()} Expenses`;
  totalYearHeadingRow.appendChild(totalYearHeadingCell);
  totalYearExpensesTable.appendChild(totalYearHeadingRow);

  const totalYearValueRow = document.createElement("tr");
  const totalYearValueCell = document.createElement("td");
  totalYearValueCell.textContent = totalyearExpense;
  totalYearValueRow.appendChild(totalYearValueCell);
  totalYearExpensesTable.appendChild(totalYearValueRow);

  expensesBody.appendChild(totalYearExpensesTable);
}

function download() {
  axios
    .get("http://localhost:3000/user/download", {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status === 201) {
        var a = document.createElement("a");
        a.href = response.data.fileUrl;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      showError(err);
    });
}
