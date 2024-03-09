document.getElementById("sendemail").addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;

  axios
    .post("/password/forgotpassword", { email })
    .then((res) => {
      document.body.innerHTML += "<div >Mail Successfuly sent <div>";
    })
    .catch((err) => {
      document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    });
});
