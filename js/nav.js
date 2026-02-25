import { auth, db } from "./firebase_config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDoc,
  setDoc,
  or,
  doc,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

let currentUserID = localStorage.getItem("currentUserID");
const logoutBtn = document.getElementById("logout-btn");
if (!currentUserID) {
  // chua dang nhap
  // chuyen sang trang signin
  location.href = "./pages/signin.html";
} else {
  // da dang nhap
  // lay ten nguoi dung hien thi (Firestore)
  logoutBtn.textContent = await getUsername(currentUserID);
}

async function getUsername(userId) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const username = snap.data().username;
    console.log("Username:", username);
    return username;
  } else {
    console.log("User not found");
    return null;
  }
}

logoutBtn.addEventListener("click", async () => await logout());
async function logout() {
  // logout Firebase Auth
  await signOut(auth);
  // xoa du lieu o phan local storage
  localStorage.removeItem("currentUserID");
  // chuyen trang login
  location.href = "../pages/signin.html";
}
