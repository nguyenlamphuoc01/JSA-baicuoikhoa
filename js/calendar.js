import { colorCode, Task } from "./entities.js";
import { db } from "./firebase_config.js";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const items = document.querySelectorAll("#timeList .list-group-item");
// ==========================================
// xu ly chuyen ngay khac cho lich
let currentDate = new Date(2026, 0, 28); // Starting date: Jan 28, 2026

function updateDateDisplay() {
  const options = { month: "short", day: "numeric", year: "numeric" };
  document.getElementById("currentDateDisplay").innerText =
    currentDate.toLocaleDateString("en-US", options);
}

function changeDate(days) {
  currentDate.setDate(currentDate.getDate() + days);
  updateDateDisplay();
  renderTasksForDay(currentDate);
}
function goToToday() {
  currentDate = new Date();
  updateDateDisplay();
  renderTasksForDay(currentDate);
}

// ================================================
// TRANG ADD EVENT
if (location.href.includes("add_event")) {
  // Render the color picker
  const container = document.getElementById("colorPickerContainer");
  colorCode.forEach((color, index) => {
    container.innerHTML += `
      <label class="color-option ${color.cssSelector}" title="${color.name}">
        <input type="radio" name="eventColor" value="${color.cssSelector}" ${index === 0 ? "checked" : ""}>
        <i class="bi bi-check text-white" style="display:none"></i>
      </label>
    `;
  });

  // ================================================
  // lay bien task ID:
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get("taskId");
  if (taskId == null) {
    // ================================================
    // add event
  } else {
    // ================================================
    // edit event (xoa event)
    // Viewing Jan 28
    const currentView = new Date(2026, 0, 28);

    // Task: Jan 28, 2PM -> Jan 29, 9AM
    const longTask = new Task(
      taskId,
      "uid",
      "Sleepover",
      "Desc",
      "Home",
      "2026-01-28T14:00:00",
      "2026-01-29T09:00:00",
      "bg-google-purple",
    );
    setEditMode(longTask);
    // TODO
  }
} else {
  // ================================================
  // TRANG INDEX
  // Populate time labels 12AM to 11PM
  updateDateDisplay();
  renderTasksForDay(currentDate);
  const timeLabels = document.getElementById("timeLabels");
  for (let i = 0; i < 24; i++) {
    const hour =
      i === 0
        ? "12 AM"
        : i < 12
          ? i + " AM"
          : i === 12
            ? "12 PM"
            : i - 12 + " PM";
    timeLabels.innerHTML += `<div class="time-slot-label">${hour}</div>`;
  }

  // ================================================
  // kiem tra nguoi dung click vao lich
  document.getElementById("events-column")?.addEventListener("click", (e) => {
    const eventEl = e.target.closest(".calendar-event");

    // ✅ CLICK VÀO EVENT → MỞ POPUP
    if (eventEl) {
      document.getElementById("taskTitle").innerText = eventEl.dataset.title;
      document.getElementById("taskDesc").innerText =
        eventEl.dataset.desc || "Không có mô tả";
      document.getElementById("taskLoc").innerText =
        eventEl.dataset.loc || "Không có địa điểm";

      document.getElementById("deleteBtn").dataset.taskId =
        eventEl.dataset.taskId;

      new bootstrap.Modal(document.getElementById("taskModal")).show();
      return;
    }

    // ✅ CLICK KHOẢNG TRẮNG → ADD EVENT
    window.location.href = "../pages/add_event.html";
  });

  // ================================================
  // hien thi event cua tai khoan
}
document.getElementById("deleteBtn")?.addEventListener("click", async () => {
  const taskId = document.getElementById("deleteBtn").dataset.taskId;
  if (!taskId) return;

  if (!confirm("Xoá công việc này?")) return;

  await deleteDoc(doc(db, "tasks", taskId));
  location.reload();
});

// =======================================================
function setEditMode(task) {
  document.getElementById("formTitle").innerText = "Chỉnh sửa công việc";
  document.getElementById("deleteBtn").classList.remove("d-none");

  // Fill the fields
  document.getElementById("taskId").value = task.taskId;
  document.getElementById("title").value = task.taskName;
  document.getElementById("startDate").value = task.startDate;
  document.getElementById("endDate").value = task.endDate;
  document.getElementById("description").value = task.taskDesc;
  document.getElementById("location").value = task.taskLocation;

  // Select the correct color
  const radio = document.querySelector(
    `input[name="eventColor"][value="${task.colorCode}"]`,
  );
  if (radio) radio.checked = true;
}
async function renderTasksForDay(date) {
  const uid = localStorage.getItem("uid");
  if (!uid) return;

  const eventsColumn = document.getElementById("events-column");
  if (!eventsColumn) return;

  eventsColumn.innerHTML = "";

  const q = query(collection(db, "tasks"), where("created_by", "==", uid));

  const snap = await getDocs(q);

  snap.forEach((docSnap) => {
    const d = docSnap.data();
    const task = new Task(
      docSnap.id,
      d.created_by,
      d.taskName,
      d.taskDesc,
      d.taskLocation,
      d.startDate,
      d.endDate,
      d.colorCode,
    );

    const html = task.toUIHTMLTag(date);
    if (html) eventsColumn.innerHTML += html;
  });
}
