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

// ==========================================
// AUTH GUARD - chặn người dùng chưa đăng nhập
const uid = localStorage.getItem("currentUserID");
if (!uid && !location.href.includes("add_event")) {
  window.location.href = "./pages/signin.html";
}

// ==========================================
// Xử lý chuyển ngày cho lịch
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

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
  currentDate.setHours(0, 0, 0, 0);
  updateDateDisplay();
  renderTasksForDay(currentDate);
}

// ==========================================
// Render time labels (12AM -> 11PM)
function renderTimeLabels() {
  const timeLabels = document.getElementById("timeLabels");
  if (!timeLabels) return;
  timeLabels.innerHTML = "";
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
}

// ==========================================
// Fetch và render tasks từ Firestore cho ngày được chọn
async function renderTasksForDay(date) {
  const eventsColumn = document.getElementById("events-column");
  if (!eventsColumn) return;

  eventsColumn.innerHTML = `<div class="text-center text-muted py-3">Đang tải...</div>`;

  try {
    const q = query(collection(db, "tasks"), where("created_by", "==", uid));
    const snap = await getDocs(q);

    eventsColumn.innerHTML = "";

    if (snap.empty) {
      eventsColumn.innerHTML = `<div class="text-center text-muted py-3">Không có sự kiện nào hôm nay</div>`;
      return;
    }

    let hasEvents = false;

    snap.forEach((docSnap) => {
      const d = docSnap.data();
      console.log(d)
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
      if (html) {
        eventsColumn.innerHTML += html;
        hasEvents = true;
      }
    });

    if (!hasEvents) {
      eventsColumn.innerHTML = `<div class="text-center text-muted py-3">Không có sự kiện nào hôm nay</div>`;
    }
  } catch (err) {
    console.error("Lỗi khi tải tasks:", err);
    eventsColumn.innerHTML = `<div class="text-center text-danger py-3">Lỗi khi tải dữ liệu</div>`;
  }
}

// ==========================================
// Xử lý click vào events column
function setupEventsColumnListener() {
  document.getElementById("events-column")?.addEventListener("click", (e) => {
    const eventEl = e.target.closest(".calendar-event");

    // Click vào event → mở popup
    if (eventEl) {
      document.getElementById("taskTitle").innerText =
        eventEl.dataset.title || "Không có tiêu đề";
      document.getElementById("taskDesc").innerText =
        eventEl.dataset.desc || "Không có mô tả";
      document.getElementById("taskLoc").innerText =
        eventEl.dataset.loc || "Không có địa điểm";
      document.getElementById("deleteBtn").dataset.taskId =
        eventEl.dataset.taskId;

      new bootstrap.Modal(document.getElementById("taskModal")).show();
      return;
    }

    // Click khoảng trắng → chuyển sang trang thêm event
    window.location.href = "./pages/add_event.html";
  });
}

// ==========================================
// Xử lý xoá task
document.getElementById("deleteBtn")?.addEventListener("click", async () => {
  const taskId = document.getElementById("deleteBtn").dataset.taskId;
  if (!taskId) return;
  if (!confirm("Xoá công việc này?")) return;

  try {
    await deleteDoc(doc(db, "tasks", taskId));
    bootstrap.Modal.getInstance(document.getElementById("taskModal"))?.hide();
    renderTasksForDay(currentDate);
  } catch (err) {
    console.error("Lỗi khi xoá task:", err);
    alert("Xoá thất bại, vui lòng thử lại.");
  }
});

// ==========================================
// Xử lý nút điều hướng ngày
document
  .getElementById("prevDate-btn")
  ?.addEventListener("click", () => changeDate(-1));
document
  .getElementById("nextDate-btn")
  ?.addEventListener("click", () => changeDate(1));
document.getElementById("goToday-btn")?.addEventListener("click", goToToday);

// ==========================================
// TRANG ADD EVENT
if (location.href.includes("add_event")) {
  // Render color picker
  const container = document.getElementById("colorPickerContainer");
  if (container) {
    colorCode.forEach((color, index) => {
      container.innerHTML += `
        <label class="color-option ${color.cssSelector}" title="${color.name}">
          <input type="radio" name="eventColor" value="${color.cssSelector}" ${index === 0 ? "checked" : ""}>
          <i class="bi bi-check text-white" style="display:none"></i>
        </label>
      `;
    });
  }

  // Lấy taskId từ URL (nếu có → edit mode)
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get("taskId");

  if (taskId) {
    // Edit mode: load task từ Firestore
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "tasks"), where("__name__", "==", taskId)),
        );
        if (!snap.empty) {
          const d = snap.docs[0].data();
          const task = new Task(
            taskId,
            d.created_by,
            d.taskName,
            d.taskDesc,
            d.taskLocation,
            d.startDate,
            d.endDate,
            d.colorCode,
          );
          setEditMode(task);
        }
      } catch (err) {
        console.error("Lỗi khi tải task để chỉnh sửa:", err);
      }
    })();
  }
} else {
  // ==========================================
  // TRANG INDEX - khởi tạo lịch
  renderTimeLabels();
  updateDateDisplay();
  renderTasksForDay(currentDate);
  setupEventsColumnListener();
}

// ==========================================
// Set edit mode cho form add/edit event
function setEditMode(task) {
  const formTitle = document.getElementById("formTitle");
  const deleteBtn = document.getElementById("deleteBtn");

  if (formTitle) formTitle.innerText = "Chỉnh sửa công việc";
  if (deleteBtn) deleteBtn.classList.remove("d-none");

  const fields = {
    taskId: task.$taskId,
    title: task.$taskName,
    startDate: task.$startDate,
    endDate: task.$endDate,
    description: task.$taskDesc,
    location: task.$taskLocation,
  };

  Object.entries(fields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value || "";
  });

  // Chọn đúng màu
  const radio = document.querySelector(
    `input[name="eventColor"][value="${task.$colorCode}"]`,
  );
  if (radio) radio.checked = true;
}
