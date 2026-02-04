import { colorCode, Task } from "./entities.js";
import { db } from "./firebase_config.js";

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
  // Here you would typically fetch new data for this specific date
}

function goToToday() {
  currentDate = new Date(); // Real today
  updateDateDisplay();
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
  document
    .getElementById("events-column")
    ?.addEventListener("click", async function (event) {
      const target = event.target.closest(".calendar-event");
      // kiem tra nếu người dùng bấm vào task (event) -> chuyển đến edit task
      if (target) {
        location.href = "../pages/add_event.html?taskId=" + target.dataset.id;
      } else {
        // bấm ngoài khoảng không -> tạo mới task
        location.href = "../pages/add_event.html?taskId=null";
      }
    });

  // ================================================
  // hien thi event cua tai khoan
}

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
