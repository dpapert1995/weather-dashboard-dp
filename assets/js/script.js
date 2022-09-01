// MAIN SCRIPT

// API Key to access
var keyAPI = "cbc1771cbc651edb467f2f4e8f058229";

// Search Button Event Listener. On click, makes open weather API call.
$(".buttonClick").on("click", function() {
    var location = $(this).siblings(".input").val();
    $(this).siblings(".input").val("");
    getWeather(location);
});

// Function to make Open Weather Geocoding API call. 
// Retrieves necessary longitude and latitude information by inputed city.
function getWeather(location){
    var callUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=" + keyAPI;
    console.log(callUrl);
    fetch(callUrl)
    .then(function(response){
    console.log(response.json());
    openCall(response);
})
}