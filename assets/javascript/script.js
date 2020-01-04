var url = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=Atlanta&APPID=32e8183a7007303bba605abc3fd9efbe";

getWeather()

function getWeather() {
    $.ajax({
        type: "GET",
        url: url,
    
    }).then(function (res) { console.log(res);
     });
}
