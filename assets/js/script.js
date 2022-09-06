// MAIN SCRIPT

// API Key for access.
var keyAPI = "cbc1771cbc651edb467f2f4e8f058229";

// Display search history as clickable butons
var storedSearches = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Displays search history on page.
displayHistory(storedSearches);

// Displays current weather of most recent search if one exists. 
// If Search History is empty, nothing happens!
    getWeather(storedSearches[storedSearches.length-1]);

// Search Button Event Listener. On click, makes open weather API call.
$(".buttonClick").on("click", function() {
    var location = $(this).siblings(".input").val();
    $(this).siblings(".input").val("");
    getWeather(location);
    displayHistory(storedSearches);
});

// Delete Button Event Listener. On click, delete.
$(".deleteClick").on("click", function() {
    localStorage.removeItem("searchHistory")
    storedSearches = [];
    $("#search-history").empty();
});

// Search History Button Event Listener. On click, search for that specific city.
$("#search-history").on("click", function() {
    let id = event.target.id;
    var location = id.replace("-"," ");
    getWeather(location);
    displayHistory(storedSearches);
});

// Function to make Open Weather Geocoding API call. 
// Retrieves necessary longitude and latitude information by inputed city.
function getWeather(loc){
    var callUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + loc + "&units=imperial&appid=" + keyAPI;
    fetch(callUrl)
    .then(response => response.json())
    .then((cityData) => {
    openCall(cityData);
});
}

// This function is called after getWeather() to retrieve the necessary data to be displayed.
// GRADERS: PLEASE NOTE THAT YOU NEED TO GET THE FREE SUBSCRIPTION ON https://openweathermap.org/price TO RUN TEST CALLS WITH 3.0.
// ONE CALL VERSION 2.5 PROVIDED TO US IN THE MODULE CHALLENGE IS OUTDATED AND THIS IS NOW REQUIRED.
function openCall(cityData){
    var openCallURL = "https://api.openweathermap.org/data/3.0/onecall?lat=" + cityData.coord.lat + "&lon=" + cityData.coord.lon + "&units=imperial&appid=" + keyAPI;
    fetch(openCallURL)
    .then(response => response.json())
    .then(weatherData => {
        addWeather(cityData.name, weatherData);
        // Only adds to history if call is successful to this point.
        addToHistory(cityData.name);
    });
}

// Function to display current weather conditions
// Since we are only storing recent searches, this information all updates when the user refreshes the page to reflect updated conditions for a search.
function addWeather(city, weatherData) {
    
    // Clear previous entry for all information fields
    $("#info-header").empty();
    $("#icon").empty();
    $("#temperature").empty();
    $("#humidity").empty();
    $("#windSpeed").empty();
    $("#uvIndex").empty();
    $("#forecast-display").empty();

    // Day and Time From moment.js
    // Nested in this function so it updates each time a Weather Call is made, rather than a page refresh.
    var day = moment().format('LLLL');

    // Populate and display today's weather info per the user requirements.
    $("#todays-info").removeClass("hide");
    $("#todays-info").addClass("show");
    $("#info-header").append(city + " (" + day + ")");
    $("#icon").append(`<img id="day1Icon" src = "https://openweathermap.org/img/w/${weatherData.daily[0].weather[0].icon}.png">`);
    $("#temperature").append("Temperature: " + weatherData.current.temp + " °F");
    $("#humidity").append("Humidity: " + weatherData.current.humidity + "%");
    $("#windSpeed").append("Wind Speed: " + weatherData.current.wind_speed + " MPH");
    $("#uvIndex").append("UV Index: " + `<span id = uvNum> ${weatherData.current.uvi}</span>`);

    // Determines background color for UV Index depending on sevrity:
    let uv = weatherData.current.uvi;
    if (uv < 3) {
        $("#uvNum").css("background-color", "green");
        $("#uvNum").css("color", "white");
    }
    else if (3 <= uv && uv < 6) {
        $("#uvNum").css("background-color", "yellow");
    }
    else if (6 <= uv && uv < 8) {
        $("#uvNum").css("background-color", "orange");
    }
    else if (8 <= uv && uv < 10) {
        $("#uvNum").css("background-color", "red");
        $("#uvNum").css("color", "white");
    }
    else {
        $("#uvNum").css("background-color", "purple");
        $("#uvNum").css("color", "white");
    }

    // Populate and display five day weather forecast info per the user requirements.
    $("#five-day-forecast").removeClass("hide");
    $("#five-day-forecast").addClass("show");
     for (i = 1; i < 6; i++) {
        let futureDate = weatherData.daily[i].dt
        let dateString = moment.unix(futureDate).format("MM/DD/YYYY")
        let fiveDayCard = 
            `<div class="col">  
             <div class = "fiveDayCard">
               <p id = "dateCard">${dateString}<p>
               <img id = "dayIcon" src = "https://openweathermap.org/img/w/${weatherData.daily[i].weather[0].icon}.png">
               <ul id = "dayTemp">Temperature: ${weatherData.daily[i].temp.day}°F</ul>
               <ul id = "dayWind">Wind Speed: ${weatherData.daily[i].wind_speed} MPH</ul>
               <ul id ="dayHumidity">Humidity: ${weatherData.daily[i].humidity}%</ul>
             </div>
             </div>`
        $("#forecast-display").append(fiveDayCard);
      }
}

// Function to add the search to history.
// Conditions ensure no search is repeated in the side bar.
function addToHistory (location) {
    // If the search matches any previous ones in local storage, move that search to the end of the array and reorder the other elements in the array.
    if (storedSearches.includes(location)){
        storedSearches.splice(storedSearches.indexOf(location),1);
        storedSearches.push(location);
    }
    // Otherwise, put it at the end of the array.
    else {
        storedSearches.push(location);
    }
    localStorage.setItem("searchHistory", JSON.stringify(storedSearches));
    displayHistory(storedSearches);
}

// Function to Display Searches
function displayHistory (storedSearches) {
$("#search-history").empty();
for (i = storedSearches.length-1; i > -1; i--){
    // Replaces white space to properly fill element id.
    let temp = storedSearches[i].replace(/\s+/g, "-")
      $("#search-history").append(`<button id = "${temp}" class= "searchClick" type = "submit"">${storedSearches[i]}</button>`)
    }
}
