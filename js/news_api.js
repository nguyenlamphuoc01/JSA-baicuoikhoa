async function loadNews() {
  const apiKey = "fbde4352a14b45269d40b21fcd5f55ec";
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