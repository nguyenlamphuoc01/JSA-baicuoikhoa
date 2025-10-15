const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showLoginFormBtn = document.getElementById("showLoginFormBtn");
const showSignupFormBtn = document.getElementById("showSignupFormBtn");

function changeForm(isLogin) {
  if (isLogin) {
    loginForm.classList.add("d-block");
    signupForm.classList.remove("d-block");
    signupForm.classList.add("d-none");
    loginForm.classList.remove("d-none");
  } else {
    loginForm.classList.add("d-none");
    loginForm.classList.remove("d-block");
    signupForm.classList.remove("d-none");
    signupForm.classList.add("d-block");
  }
}

showSignupFormBtn.addEventListener("click", function () {
  this.classList.add("btn-primary");
  this.classList.remove("btn-outline-primary");

  showLoginFormBtn.classList.add("btn-outline-primary");
  showLoginFormBtn.classList.remove("btn-primary");

  changeForm(false);
});

showLoginFormBtn.addEventListener("click", function () {
  this.classList.add("btn-primary");
  this.classList.remove("btn-outline-primary");

  showSignupFormBtn.classList.add("btn-outline-primary");
  showSignupFormBtn.classList.remove("btn-primary");
  changeForm(true);
});

function validateSignupForm(email, username, password) {
  if (username.length < 5) {
    alert("Username must be at least 5 characters long.");
    return false;
  }
  if (password.length < 5) {
    alert("Password must be at least 5 characters long.");
    return false;
  }
  return true;
}

function isEmailRegistered(email) {
  if (localStorage.getItem(email) !== null) {
    alert("Email is already registered. Please use a different email.");
    return true;
  }
  return false;
}

function signupToLocalStorage() {
  const email = document.getElementById("signupEmail").value;
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;

  const checked =
    validateSignupForm(email, username, password) && !isEmailRegistered(email);
  if (checked == true) {
    localStorage.setItem(email, password);

    alert("Registration successful! You can now log in.");

    changeForm(true);
  }
}

function loginToHome() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (isEmailRegistered(email)) {
    const passwordStored = localStorage.getItem(email);

    if (passwordStored === password) {
      localStorage.setItem("currentUser", email);
      alert("Login successful! Redirecting to home page...");

      window.location.href = "../index.html";
    } else {
      alert("Incorrect password. Please try again.");
      return;
    }
  } else {
    alert("Email not registered. Please sign up first.");
    return;
  }
}

document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    signupToLocalStorage();
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    loginToHome();
  });
