// Weather App Logic
const weather_element = document.getElementById("weather");
const temperature_main_element = document.getElementById("temperature-main");
const weather_description_element = document.getElementById("weather-description");
const weather_icon_element = document.getElementById("icon");
const temperature_element = document.getElementById("temperature");
const humidity_element = document.getElementById("humidity");
const wind_speed_element = document.getElementById("wind-speed");
const country_element = document.getElementById("country");
const town_element = document.getElementById("city");
const forecastContainer = document.getElementById("forecast");
const weather_message_element = document.getElementById("weather-message");

const apiKey = "20a01944eda34a13f4a4dcecfff77197";
const urlParams = new URLSearchParams(window.location.search);
const city = urlParams.get("city");

if (!city) {
  alert("City not specified in URL. Use ?city=YourCityName");
} else {
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(currentWeatherURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found.");
      }
      return response.json();
    })
    .then((data) => {
      const weather = data.weather[0].main;
      const weather_description = data.weather[0].description;
      const weather_icon = data.weather[0].icon;
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const wind_speed = data.wind.speed;
      const country = data.sys.country;
      const town = data.name;

      weather_element.innerText = weather;
      country_element.innerText = country;
      town_element.innerText = town;
      temperature_main_element.innerText = `${temperature}°C`;
      weather_description_element.innerText = weather_description;
      humidity_element.innerText = `${humidity}%`;
      wind_speed_element.innerText = `${wind_speed} m/s`;
      temperature_element.innerText = `${temperature}°C`;
      weather_icon_element.src = `https://openweathermap.org/img/wn/${weather_icon}@2x.png`;

      updateWeatherMessage(weather, temperature); // 🌟 New weather message feature

      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
      return fetch(forecastURL);
    })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch forecast data.");
      return response.json();
    })
    .then((forecastData) => {
      forecastContainer.innerHTML = "";
      const dailyData = {};

      forecastData.list.forEach((item) => {
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });
        if (!dailyData[day] && date.getHours() === 12) {
          dailyData[day] = item;
        }
      });

      const days = Object.keys(dailyData).slice(0, 5);

      days.forEach((day) => {
        const entry = dailyData[day];
        const temp = Math.round(entry.main.temp);
        const icon = entry.weather[0].icon;
        const desc = entry.weather[0].main;

        const card = `
          <div class="flex flex-col items-center text-white bg-white/20 p-4 rounded-xl w-[90px] md:w-[100px]">
            <p class="font-semibold">${day}</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" class="w-12 h-12" />
            <p class="text-lg font-bold">${temp}°C</p>
            <p class="text-sm">${desc}</p>
          </div>
        `;
        forecastContainer.innerHTML += card;
      });
    })
    .catch((error) => {
      console.error("Error:", error.message);
      forecastContainer.innerHTML = `<p class="text-white">Forecast not available.</p>`;
    });
}

// 🌤️ Function to update weather-based message
function updateWeatherMessage(weather, temp) {
  let message = "";
  const t = parseFloat(temp);

  switch (weather.toLowerCase()) {
    case "clear":
    case "sunny":
      message = "It's a bright and sunny day! 😎 Enjoy the sunshine.";
      break;
    case "clouds":
      message = "A bit cloudy today. Perfect weather for a walk! ☁️";
      break;
    case "rain":
      message = "Don't forget your umbrella. ☔ It's raining!";
      break;
    case "thunderstorm":
      message = "Stay indoors and stay safe ⚡️. Thunderstorm alert!";
      break;
    case "snow":
      message = "Let it snow, let it snow! ❄️ Time for hot chocolate!";
      break;
    case "mist":
    case "fog":
      message = "Drive carefully! Visibility is low due to fog. 🌫️";
      break;
    default:
      if (t < 10) {
        message = "It's pretty cold out there! 🧥 Stay warm.";
      } else if (t >= 10 && t < 25) {
        message = "Mild and pleasant weather today. 🌼";
      } else if (t >= 25) {
        message = "It's quite warm. Stay hydrated! ☀️";
      }
      break;
  }

  if (message) {
    weather_message_element.innerText = message;
    weather_message_element.classList.remove("hidden");
  } else {
    weather_message_element.classList.add("hidden");
  }
}

// Scroll-triggered Slide-In Animation (Left to Right)
document.addEventListener("DOMContentLoaded", () => {
  const slideElements = document.querySelectorAll(".slide-in-on-scroll");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, {
    threshold: 0.15
  });

  slideElements.forEach(el => observer.observe(el));
});
