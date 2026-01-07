document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();

  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});

function checkLoginStatus() {
  const user = localStorage.getItem("user");
  const userInfo = document.querySelector(".user-info");
  const loginBtn = document.querySelector(".login-btn");

  if (!userInfo || !loginBtn) return;

  userInfo.style.display = user ? "block" : "none";
  loginBtn.style.display = user ? "none" : "block";
}
