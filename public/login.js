const login = document.getElementById("Login");

try {
  login.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    axios
      .post("/user/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        alert("Logged in successfully");
        localStorage.setItem("token", res.data.token);
        window.location.href = "/expense/addexpense";
      })
      .catch((err) => {
        const displayerror = document.getElementById("displayerror");
        displayerror.innerHTML += `${err}`;
        displayerror.innerHTML += "Invalid details";
      });
  });
} catch (err) {
  const displayerror = document.getElementById("displayerror");
  displayerror.innerHTML += `${err}`;
}

const newusersignup = document.getElementById("newusersignup");

newusersignup.addEventListener("click", (e) => {
  window.location.href = "/user/signup";
});

document.getElementById("forgotpassword").addEventListener("click", (e) => {
  e.preventDefault();

  window.location.href = "/password/forgotpassword";
});
