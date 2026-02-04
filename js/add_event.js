import { db } from "./firebase_config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { addDoc, collection } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// ==================================== //
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

const hourParam = getParam("hour");

// ==================================== //
const form = document.getElementById("eventForm");
const cancelBtn = document.getElementById("cancelBtn");

// ==================================== //
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const locationText = document.getElementById("location").value.trim();

  if (!title) {
    alert("Nhập tiêu đề công việc");
    return;
  }

  const uid = localStorage.getItem("uid");
  if (!uid) {
    alert("chưa đăng nhập ");
    window.location.href = "../signin.html";
    return;
  }

  try {
    await addDoc(collection(db, "tasks"), {
      title,
      description,
      location: locationText,
      hour: hourParam || null,
      userId: uid,
      createdAt: Date.now()
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
