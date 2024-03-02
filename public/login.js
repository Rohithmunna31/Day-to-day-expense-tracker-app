const login = document.getElementById("Login");

try {
  login.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(email, password);
    axios
      .post("/user/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res);
        alert("Logged in successfully");
        localStorage.setItem("token", res.data.token);
        window.location.href = "/expense/addexpense";
      })
      .catch((err) => {
        const displayerror = document.getElementById("displayerror");
        displayerror.innerHTML += `${err}`;
        displayerror.innerHTML += "Invalid details";
        console.log(err);
      });
  });
} catch (err) {
  const displayerror = document.getElementById("displayerror");
  displayerror.innerHTML += `${err}`;
  console.log(err);
}

const newusersignup = document.getElementById("newusersignup");

newusersignup.addEventListener("click", (e) => {
  window.location.href = "/user/signup";
});

document.getElementById("forgotpassword").addEventListener("click", (e) => {
  e.preventDefault();

  window.location.href = "/password/forgotpassword";
});
