const dateElement = document.getElementById("datenow");
dateElement.innerText = new Date().toLocaleString();

const btn = document.getElementById("submit");

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
      const { id, createdAt } = res.data;
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
      // let displayerror = document.getElementById("displayerror") || null;
      // displayerror.innerHTML = "";
      // displayerror += "cant add expense";
      // displayerror.style.color = "red";
      console.log(err);
    });
});

window.addEventListener("load", async (e) => {
  try {
    const limit = localStorage.getItem("limit");
    const token = localStorage.getItem("token");
    const decodetoken = parseJwt(token);
    const ispremium = decodetoken.ispremiumuser;

    let page = 1;
    const response = await axios.get(
      `/expense/getexpenses?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: token },
      }
    );
    if (ispremium) {
      premiumusersexpenses(response.data.expenses);
      paginationButtons(response.data);
    } else {
      showExpenses(response.data.expenses);
      paginationButtons(response.data);
    }
  } catch (error) {
    let displayerror = document.getElementById("displayerror");
    displayerror.innerHTML = "";
    displayerror += "error loading expense";
    displayerror.style.color = "red";
  }
});

async function deleteExpense(expenseId) {
  try {
    const expenseElement = document.querySelector(
      `#expenses-list [id=data-${expenseId}]`
    );
    if (expenseElement) {
      expenseElement.remove();
    }
    const token = localStorage.getItem("token");
    await axios.delete(`/expense/delete/${expenseId}`, {
      headers: { Authorization: token },
    });
  } catch (error) {
    const displayerror = document.getElementById("displayerror");
    displayerror.innerHTML = "";
    displayerror += "error deleting expense";
    displayerror.style.color = "red";
  }
}

document.getElementById("premium").addEventListener("click", async (e) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get("/purchase/buypremiummembership", {
      headers: { Authorization: token },
    });
    let options = {
      key: response.data.key_id,
      order_id: response.data.order.id,

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
        getpremiumuserexpenses(1, token);
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", function (response) {
      alert("something went wrong");
    });
  } catch (err) {
    const displayerror = document.getElementById("displayerror");
    displayerror.innerHTML = "";
    displayerror += "error deleting expense";
    displayerror.style.color = "red";
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

document.getElementById("leaderboard").addEventListener("click", async (e) => {
  try {
    const token = localStorage.getItem("token");
    const leaderboardArray = await axios.get("/premium/showleaderboard", {
      headers: { Authorization: token },
    });

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
    const displayerror = document.getElementById("displayerror");
    displayerror.innerHTML = "";
    displayerror += "An error occured";
    displayerror.style.color = "red";
  }
});

function premiumusersexpenses(expenses) {
  const expensesBody = document.getElementById("expenses-list");
  expensesBody.innerHTML = "";
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

  const monthName = new Date().toLocaleString("en-us", { month: "long" });

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
    totalyearExpense += expense.expense;
  });

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
  const token = localStorage.getItem("token");

  axios
    .get("/expense/download", {
      headers: { Authorization: token },
    })
    .then((response) => {
      var a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "myexpense.csv";
      a.click();
      window.location.href = response.data.fileUrl;
      return;
    })
    .catch((err) => {
      const displayerror = document.getElementById("displayerror");
      displayerror.innerHTML = "";
      displayerror += "error loading expense";
      displayerror.style.color = "red";
    });
}

function showExpenses(expenses) {
  try {
    const expensesBody = document.getElementById("expenses-list");

    expensesBody.innerHTML = "";
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
    const displayerror = document.getElementById("displayerror");
    displayerror.innerHTML = "";
    displayerror += "error loading expense";
    displayerror.style.color = "red";
  }
}

function getExpenses(page, token) {
  const limit = localStorage.getItem("limit") || 10;
  axios
    .get(`/expense/getexpenses?page=${page} &limit=${limit}`, {
      headers: { Authorization: token },
    })
    .then((response) => {
      showExpenses(response.data.expenses);
      paginationButtons(response.data);
    })
    .catch((err) => {
      return err;
    });
}

function getpremiumuserexpenses(page, token) {
  const limit = localStorage.getItem("limit") || 10;
  axios
    .get(`/expense/getexpenses?page=${page}&limit=${limit}`, {
      headers: { Authorization: token },
    })
    .then((response) => {
      premiumusersexpenses(response.data.expenses);
      paginationButtons(response.data);
    })
    .catch((err) => {
      return err;
    });
}

function paginationButtons(data) {
  const token = localStorage.getItem("token");
  const decodetoken = parseJwt(token);
  const ispremium = decodetoken.ispremiumuser;
  const paginationbutton = document.getElementById("paginatingbuttons");
  paginationbutton.innerHTML = "";
  const currentPage = data.currentPage;
  const previousPage = data.previousPage;
  const nextPage = data.nextPage;
  const hasNextpage = data.hasNextpage;
  const hasPreviouspage = data.hasPreviospage;

  if (hasPreviouspage) {
    const previousPageButton = document.createElement("button");
    previousPageButton.innerText = previousPage;
    paginationbutton.appendChild(previousPageButton);
    if (ispremium) {
      previousPageButton.addEventListener("click", (e) => {
        getpremiumuserexpenses(previousPage, token);
      });
    } else {
      previousPageButton.addEventListener("click", (e) => {
        getExpenses(previousPage, token);
      });
    }
  }

  const currentPageButton = document.createElement("button");
  currentPageButton.innerText = currentPage;
  paginationbutton.appendChild(currentPageButton);
  if (ispremium) {
    currentPageButton.addEventListener("click", (e) => {
      getpremiumuserexpenses(currentPage, token);
    });
  } else {
    currentPageButton.addEventListener("click", (e) => {
      getExpenses(currentPage, token);
    });
  }

  if (hasNextpage) {
    const nextPageButton = document.createElement("button");
    nextPageButton.innerText = nextPage;
    paginationbutton.appendChild(nextPageButton);
    if (ispremium) {
      nextPageButton.addEventListener("click", (e) => {
        getpremiumuserexpenses(nextPage, token);
      });
    } else {
      nextPageButton.addEventListener("click", (e) => {
        getExpenses(nextPage, token);
      });
    }
  }
  var limit = 0;
  document.getElementById("select").addEventListener("click", (e) => {
    limit = document.getElementById("select").value;
    localStorage.setItem("limit", limit);

    if (ispremium) {
      getpremiumuserexpenses(currentPage, token);
    } else {
      getExpenses(currentPage, token);
    }
  });
}
