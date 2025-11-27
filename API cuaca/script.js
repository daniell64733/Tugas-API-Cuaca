// Anda bisa mendapatkannya secara gratis di https://openweathermap.org/appid
const apiKey = "0c598dff46ae3b0f27c3c56d28f6980c";

// --- Elemen DOM ---
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherInfo = document.getElementById("weatherInfo");
const initialMessage = document.getElementById("initialMessage");
const errorMessage = document.getElementById("errorMessage");
const loader = document.getElementById("loader");

const cityNameEl = document.getElementById("cityName");
const weatherIconEl = document.getElementById("weatherIcon");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("windSpeed");

// --- Fungsi untuk mengambil data cuaca ---
async function getWeather(city) {
  // Sembunyikan semua pesan/info dan tampilkan loader
  weatherInfo.classList.add("hidden");
  errorMessage.classList.add("hidden");
  initialMessage.classList.add("hidden");
  loader.classList.remove("hidden");

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=id`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      // Jika respons tidak berhasil (misal: 404 Not Found), lempar error
      throw new Error("Kota tidak ditemukan");
    }
    const data = await response.json();
    updateUI(data);
  } catch (error) {
    console.error("Gagal mengambil data cuaca:", error);
    errorMessage.classList.remove("hidden"); // Tampilkan pesan error
  } finally {
    loader.classList.add("hidden"); // Selalu sembunyikan loader setelah selesai
  }
}

// --- Fungsi untuk memperbarui UI dengan data cuaca ---
function updateUI(data) {
  // Ekstrak data yang relevan dari respons API
  const { name, main, weather, wind } = data;
  const iconCode = weather[0].icon;
  const descriptionText = weather[0].description;

  // Perbarui elemen-elemen di halaman
  cityNameEl.textContent = name;
  weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIconEl.alt = descriptionText;
  temperatureEl.textContent = `${Math.round(main.temp)}°C`;
  descriptionEl.textContent = descriptionText;
  humidityEl.textContent = `${main.humidity}%`;
  windSpeedEl.textContent = `${(wind.speed * 3.6).toFixed(1)} km/h`; // Konversi m/s ke km/h

  // Tampilkan kartu informasi cuaca
  weatherInfo.classList.remove("hidden");
}

// --- Event Listeners ---

// Menangani klik pada tombol pencarian
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    // Opsional: berikan feedback jika input kosong
    alert("Silakan masukkan nama kota.");
  }
});

// Menangani penekanan tombol 'Enter' pada input
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      getWeather(city);
    }
  }
});
