async function loadWeather() {
  const apiKey = "e9d6bda09928e7a794cbc33229338a0c";
  const city = "Ho Chi Minh";
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=vi`
    );
    const data = await res.json();
    const w = data.weather[0].description;
    const t = data.main.temp;
    document.getElementById("weatherInfo").innerText = `${city}: ${t}°C, ${w}`;
  } catch {
    document.getElementById("weatherInfo").innerText =
      "Không tải được thời tiết.";
  }
}
loadWeather();

async function loadNews() {
  const apiKey = "pub_fec16eed290148a490568dc4d7a077f2";
  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`
    );
    const data = await res.json();
    const list = document.getElementById("newsList");
    list.innerHTML = "";
    data.articles.forEach((n) => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `<a href="${n.url}" target="_blank" class="text-decoration-none fw-semibold">${n.title}</a>`;
      list.appendChild(li);
    });
  } catch {
    document.getElementById("newsList").innerHTML =
      "<li class='list-group-item text-muted'>Không tải được tin tức.</li>";
  }
}
loadNews();

const items = document.querySelectorAll("#timeList .list-group-item");
const modal = new bootstrap.Modal(document.getElementById("taskModal"));
let currentHourKey = "";

items.forEach((item) => {
  item.addEventListener("click", () => {
    const hour = item.textContent.trim();
    const key = "task_" + hour;
    const stored = localStorage.getItem(key);
    currentHourKey = key;

    if (stored) {
      let task;
      try {
        task = JSON.parse(stored);
      } catch {
        task = { title: stored, description: "", location: "" };
      }
      document.getElementById("taskTitle").innerText = task.title;
      document.getElementById("taskDesc").innerText =
        task.description || "(không có)";
      document.getElementById("taskLoc").innerText =
        task.location || "(không có)";
      modal.show();
    } else {
      window.location.href = `add_event.html?hour=${encodeURIComponent(hour)}`;
    }
  });
});

document.getElementById("deleteBtn").addEventListener("click", () => {
  if (currentHourKey) {
    localStorage.removeItem(currentHourKey);
    modal.hide();
    alert("Đã xoá công việc khỏi khung giờ này!");
  }
});
