const apiKey = "c23472f44ad6904f9bb99b20b454048e";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const locationEl = document.getElementById("location");
const descriptionEl = document.getElementById("description");
const tempEl = document.getElementById("temp");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const weatherEl = document.getElementById("weather");
const errorEl = document.getElementById("error");

function displayWeather(data) {
  locationEl.textContent = `${data.name}, ${data.sys.country}`;
  descriptionEl.textContent = data.weather[0].description;
  tempEl.textContent = data.main.temp.toFixed(1); // Already in °C
  humidityEl.textContent = data.main.humidity;
  windEl.textContent = (data.wind.speed * 3.6).toFixed(1); // m/s to km/h

  weatherEl.classList.remove("hidden");
  errorEl.classList.add("hidden");
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
  weatherEl.classList.add("hidden");
}

function getWeatherByCity(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => displayWeather(data))
    .catch(err => showError(err.message));
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherByCity(city);
  }
});
    
function getWeatherByLocation(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => displayWeather(data))
    .catch(() => showError("Could not fetch weather for your location"));
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherByCity(city);
  }
});

// Auto-fetch based on user's location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      getWeatherByLocation(position.coords.latitude, position.coords.longitude);
    },
    () => {
      showError("Location permission denied. Please enter a city.");
    }
  );
} else {
  showError("Geolocation is not supported by your browser.");
}
