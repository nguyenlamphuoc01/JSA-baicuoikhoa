async function loadWeather() {
  const apiKey = "e9d6bda09928e7a794cbc33229338a0c";
  if (!navigator.geolocation) {
    document.getElementById("weatherInfo").innerText =
      "Trình duyệt không hỗ trợ định vị :(";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`,
        );
        const data = await res.json();
        const city = data.name;
        const w = data.weather[0].description;
        const t = data.main.temp;

        document.getElementById("weatherInfo").innerText =
          `${city}: ${t}°C, ${w}`;
      } catch {
        document.getElementById("weatherInfo").innerText =
          "Không tải được thông tin thời tiết :(";
      }
    },
    () => {
      document.getElementById("weatherInfo").innerText =
        "Không lấy được vị trí của bạn :(";
    },
  );
}

loadWeather();
