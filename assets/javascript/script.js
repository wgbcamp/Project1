var url = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=Atlanta&APPID=32e8183a7007303bba605abc3fd9efbe";

getWeather()

function getWeather() {
    $.ajax({
        type: "GET",
        url: url,
    
    }).then(function (res) { console.log(res);
     });
}

var map;
         function initialize() {
           var prop = {
            center:new google.maps.LatLng(40.558896,-73.985130),
            zoom:5,
            mapTypeId:google.maps.MapTypeId.ROADMAP
           };
          return new google.maps.Map(document.getElementById("w3docs-map"), prop);
         }
         setTimeout(function(){
            map = initialize();
         },500);
         function w3Load(){
            document.getElementById("w3docs-map").style.display = 'block';
            google.maps.event.trigger(map, 'resize');
         }
   