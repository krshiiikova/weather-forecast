let now = new Date();

let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
let day = days[now.getDay()];
let months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minute = now.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}
let month = months[now.getMonth()];
let date = now.getDate();
let newDate = document.querySelector("#current-date");
newDate.innerHTML = `${day} ${date} ${month} ${hour}:${minute}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return days[day];
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;

  let days = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col forecast">
            ${formatDay(forecastDay.dt)}
            <div>
              <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />

              <div class="degrees">
                <span class="maximum">${Math.round(
                  forecastDay.temp.max
                )}°</span>

                <span class="minimum">${Math.round(
                  forecastDay.temp.min
                )}°</span>
              </div>
              </div>
              </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "daf140ea56db5995d6aebb374856a115";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  let currentWeather = document.querySelector("#temperature");
  currentWeather.innerHTML = Math.round(response.data.main.temp);
  let info = document.querySelector("#info");
  info.innerHTML = response.data.weather[0].main;
  let cityName = document.querySelector(".cityName");
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);
  cityName.innerHTML = response.data.name.toUpperCase();
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  celsiusTemperature = Math.round(response.data.main.temp);

  getForecast(response.data.coord);
}
function searchCity(city) {
  let apiKey = "daf140ea56db5995d6aebb374856a115";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function search(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "daf140ea56db5995d6aebb374856a115";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showWeather);
}

function currentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", currentLocation);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

searchCity("Kyiv");
