document.getElementById("confirm").addEventListener("click", (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("PasswordAgain").value;
  const id = window.location.href.split("resetpassword/")[1];
  if (password == confirmPassword) {
    axios
      .post("/password/resetpassword", { newPassword: password, id })
      .then((res) => {
        document.body.innerHTML += `<div style="color:blue;"> Password changed successfully try log in <div>`;
      })
      .catch((err) => {
        document.body.innerHTML += `<div style="color:red;"> ${err} <div>`;
      });
  } else {
    document.body.innerHTML += `<div style="color:red;"> Password and Confirm password does'nt match try again  <div>`;
  }
});
