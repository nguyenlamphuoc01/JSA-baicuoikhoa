import { auth, db } from "./firebase_config.js";
import { createUserWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  or
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { User } from "./entities.js";

// ====================== SIGNUP ======================
const signupForm = document.getElementById("signup-form");

function validateSignupForm(email, username, password, confirmPassword) {
  if (username.length < 6) {
    alert("Tên người dùng phải có 6 kí tự trở lên.");
    return false;
  }
  if (username.includes(" ")) {
    alert("Tên người dùng không được dùng dấu cách");
    return false;
  }
  if (password.length < 6) {
    alert("Mật khẩu phải có 6 kí tự trở lên.");
    return false;
  }
  if (password !== confirmPassword) {
    alert("Mật khẩu không trùng khớp.");
    return false;
  }
  return true;
}

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("signupUsername");
  const email = document.getElementById("signupEmail");
  const password = document.getElementById("signupPassword");
  const confirmPassword = document.getElementById("signupConfirmPassword");

  if (
    !validateSignupForm(
      email.value,
      username.value,
      password.value,
      confirmPassword.value
    )
  ) return;

  // ---- check duplicate username / email
  const q = query(
    collection(db, "users"),
    or(
      where("username", "==", username.value),
      where("email", "==", email.value)
    )
  );

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    alert("Email hoặc Username đã được đăng kí, vui lòng đăng nhập!");
    return;
  }

  // ---- create account (Auth)
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    const user = userCredential.user;

    // ---- create user document (Firestore)
    const newUser = new User(username.value, email.value, user.uid);
    await addDoc(collection(db, "users"), newUser.toObject());

    localStorage.setItem("uid", user.uid);

    alert("Đăng kí tài khoản thành công!");
    location.href = "../index.html";

  } catch (error) {
    console.error(error.message);
    alert("Đăng kí thất bại 😢");
  }
});
