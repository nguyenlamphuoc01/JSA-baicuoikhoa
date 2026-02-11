import { db } from "./firebase_config.js";
import { addDoc, collection } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// ==================================== //
const auth = getAuth();

const form = document.getElementById("eventForm");
const cancelBtn = document.getElementById("cancelBtn");

let currentUID = null;

// ==================================== //
// LẤY UID CHẮC CHẮN (kể cả khi localStorage rỗng)
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUID = user.uid;
    localStorage.setItem("uid", user.uid); // backup cho mấy trang khác
  } else {
    currentUID = null;
  }
});

// ==================================== //
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const locationText = document.getElementById("location").value.trim();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const color = document.querySelector(
    'input[name="eventColor"]:checked'
  )?.value || "bg-google-blue";

  if (!title || !startDate || !endDate) {
    alert("Nhập đầy đủ thông tin");
    return;
  }

  if (!currentUID) {
    alert("chưa đăng nhập");
    window.location.href = "../signin.html";
    return;
  }

  try {
    await addDoc(collection(db, "tasks"), {
      created_by: currentUID,
      taskName: title,
      taskDesc: description,
      taskLocation: locationText,
      startDate,
      endDate,
      colorCode: color,
    });

    alert("Đã lưu công việc ✅");
    window.location.href = "../index.html";
  } catch (err) {
    console.error(err);
    alert("Lưu công việc thất bại ❌");
  }
});

// ==================================== //
cancelBtn.addEventListener("click", () => {
  window.location.href = "../index.html";
});
