function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const hourParam = getParam("hour");

document.getElementById("eventForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  if (!title) {
    alert("Nhập tiêu đề sự kiện");
    return;
  }
  if (hourParam) {
    localStorage.setItem("task_" + hourParam, title);
  }
  window.location.href = "index.html";
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});
