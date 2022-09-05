// MAIN SCRIPT

// API Key for access.
var keyAPI = "cbc1771cbc651edb467f2f4e8f058229";

// Search Button Event Listener. On click, makes open weather API call.
$(".buttonClick").on("click", function() {
    var location = $(this).siblings(".input").val();
    $(this).siblings(".input").val("");
    getWeather(location);
});

// Function to make Open Weather Geocoding API call. 
// Retrieves necessary longitude and latitude information by inputed city.
function getWeather(loc){
    var callUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + loc + "&units=imperial&appid=" + keyAPI;
    console.log(callUrl);
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
    console.log(cityData);
    var openCallURL = "https://api.openweathermap.org/data/3.0/onecall?lat=" + cityData.coord.lat + "&lon=" + cityData.coord.lon + "&units=imperial&appid=" + keyAPI;
    console.log(openCallURL);
    fetch(openCallURL)
    .then(response => response.json())
    .then(weatherData => {
        addWeather(weatherData);
    });
}

