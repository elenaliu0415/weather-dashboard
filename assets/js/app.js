var weatherApiKey = "9ba2184f424558b17074bbc106ac975b";
var searchHistory = localStorage.getItem("searchHistory");
var searchHistoryContainer = $("#searcn-history");
var form = $("#search-form");
var searchInput = $("#city-search");
var selectedCityResult = $("#selected-result");
var forecastContainer = $("#forceast-results");

// create a function to get user input from the form
function handleFormSubmit(event) {
  event.preventDefault();
  var query = searchInput.val().trim();
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (query) {
    searchHistory.push(query);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    displayButtons();
    searchCity(query);
    searchInput.val("");
  }
}
// create a function to fetch data from the weather api
function searchCity(query) {
  var url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&APPID=" +
    weatherApiKey;

  fetch(url)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      fetchWeatherData(data.coord, query);
    });
}

function fetchWeatherData(result, city) {
  var lat = result.lat;
  var lon = result.lon;
  var url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial" +
    "&exclude=minutely,hourly,alerts" +
    "&appid=" +
    weatherApiKey;

  fetch(url)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      selectedCityResult.empty();
      displayCurrentWeather(data.current, city);
      displayForecast(data.daily);
      $("#forecastContainer").show();
    });
}

// create functions to display selected city results
function displayCurrentWeather(result, city) {
  //   console.log(result);
  var cityName = city;
  var date = new Date(result.dt * 1000);
  var dateStr =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
  var iconSrc =
    "http://openweathermap.org/img/wn/" + result.weather[0].icon + ".png";

  var iconImg = $("<img>").attr({
    src: iconSrc,
    alt: "weather icon",
  });
  var cityTitle = $("<h4>")
    .addClass("card-title")
    .html(cityName + " " + "(" + dateStr + ")");
  var temp = $("<p>")
    .addClass("card-text")
    .html("Temp: " + result.temp + "°F");
  var wind = $("<p>")
    .addClass("card-text")
    .html("Wind: " + result.wind_speed + " MPH");
  var humidity = $("<p>")
    .addClass("card-text")
    .html("Humidity: " + result.humidity + " %");

  var spanUVI = $("<span>").html(result.uvi);

  var uvi = $("<p>")
    .addClass("card-text")
    .html("UV Index: ");

  uvi.append(spanUVI);

  var cityResult = $("<div>")
    .addClass("card-body")
    .append(cityTitle, temp, wind, humidity, uvi);

    if (result.uvi >= 0 && result.uvi <= 2) {
        spanUVI.addClass("low");
      } else if (result.uvi > 2 && result.uvi <= 5) {
          spanUVI.addClass("moderate");
      } else if (result.uvi > 5 && result.uvi <= 7) {
          spanUVI.addClass("high");
      } else if (result.uvi > 7 && result.uvi <= 10) {
          spanUVI.addClass("very-high");
      } else if (result.uvi > 11){
          spanUVI.addClass("extreme");
      }

  selectedCityResult.append(cityResult);
  cityTitle.append(iconImg);
}

function displayForecast(results) {
  // console.log(results);
  for (var i = 1; i < 6; i++) {
    var result = results[i];
    var date = new Date(result.dt * 1000);
    var iconSrc =
      "http://openweathermap.org/img/wn/" + result.weather[0].icon + ".png";
    var forecastCard = $(".forecast").eq(i - 1);
    var dateStr =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    forecastCard.find(".date").text(dateStr);
    forecastCard.find(".icon").attr("src", iconSrc);
    forecastCard.find(".temp").text("Temp: " + result.temp.day + "°F");
    forecastCard.find(".wind").text("Wind: " + result.wind_speed + " MPH");
    forecastCard.find(".humidity").text("Humidity: " + result.humidity + " %");
  }
}

function displayButtons() {
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

  searchHistoryContainer.empty();
  for (var i = 0; i < searchHistory.length; i++) {
    var button = $("<button>")
      .attr({
        type: "button",
        class: "btn btn-outline-info btn-block btn-search",
      })
      .text(searchHistory[i]);
    searchHistoryContainer.append(button);
  }
}

function handleHistoryClick() {
  displayButtons();
  searchCity(this.textContent);
}

if (searchHistory == null) {
  localStorage.setItem("searchHistory", JSON.stringify([]));
}
// add event listener for form submit button
form.on("submit", handleFormSubmit);
searchHistoryContainer.on("click", ".btn-search", handleHistoryClick);
