var weatherApiKey = "9ba2184f424558b17074bbc106ac975b";

var form = $("#search-form");
var searchInput = $("#city-search");
var selectedCityResult = $("#selected-result");
var forecastContainer = $("#forceast-results");

// create a function to get user input from the form
function handleFormSubmit(event) {
  event.preventDefault();
  var query = searchInput.val().trim();

  if (query) {
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
      fetchWeatherData(data.coord);
    });
}

function fetchWeatherData(result) {
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
      console.log(data);

    });

}

// create a function to display selected city results

// add event listener for form submit button
form.on("click", handleFormSubmit);
