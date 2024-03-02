const token = localStorage.getItem("token");
const decodetoken = parseJwt(token);
console.log(decodetoken);
const ispremium = decodetoken.ispremiumuser;
console.log(ispremium);
if (ispremium) {
  showpremiummessage();
}

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
      console.log(res);
      const { id } = res.data;

      const expenseList = document.getElementById("expenses-list");
      const show = document.createElement("div");

      show.setAttribute("id", `data-${id}`);

      show.innerHTML = `<p> ${expense} <p/>
                              <p> ${description} <p/>
                              <p> ${category} <p/>
                              <button onclick="deleteExpense(${id})">Delete Expense</button>
                                <hr> `;

      console.log(show.getAttribute("id"));
      expenseList.appendChild(show);
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
    if (ispremium) {
      showpremiummessage();
    }
    const response = await axios.get("/expense/getexpenses", {
      headers: { Authorization: token },
    });

    console.log(response);
    const expenses = response.data;

    const expensesList = document.getElementById("expenses-list");

    expensesList.innerHTML = "<h1> Expense List </h1>"; // Clear previous data

    expenses.forEach((expense) => {
      const expenseItem = document.createElement("div");
      expenseItem.setAttribute("id", `data-${expense.id}`);
      expenseItem.innerHTML = `
            <p>${expense.expense}</p>
            <p>${expense.description}</p>
            <p>${expense.category}</p>
            <button onclick="deleteExpense(${expense.id})">Delete Expense </button>
            <hr>
          `;
      // console.log(expenseItem);
      console.log(expenseItem.getAttribute("id"));
      expensesList.appendChild(expenseItem);
    });
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
    console.error("Error deleting expense:", error);
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

function showpremiummessage() {
  document.getElementById("premium").style.visibility = "hidden";

  const youarepremium = document.getElementById("youarepremium");
  youarepremium.innerText = "You are Premium User now";

  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerText = "Show Leaderboard";
}

document.getElementById("leaderboard").addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");

  const leaderboardArray = await axios.get("/premium/showleaderboard", {
    headers: { Authorization: token },
  });

  console.log(leaderboardArray);
  let leaderboardelements = document.getElementById("leaderboardelements");

  leaderboardelements.innerHTML = "";

  leaderboardelements.innerHTML += "<h1> Leaderboard <h1/>";
  leaderboardArray.data.forEach((userDetails) => {
    leaderboardelements.innerHTML += ` <li> Name - ${userDetails.username} , Total expense -${userDetails.total_cost} </li>`;
  });
});
