function checkLoginStatus() {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const currentUser = localStorage.getItem("currentUser");

  if (currentUser !== null) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", checkLoginStatus);

document.getElementById("logout-btn").addEventListener("click", function () {
  localStorage.removeItem("currentUser");
});

