var url = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=Atlanta&APPID=32e8183a7007303bba605abc3fd9efbe";

getWeather()

function getWeather() {
    $.ajax({
        type: "GET",
        url: url,
    
    }).then(function (res) { console.log(res);
     });
}

// Jquery method document ready function
$(document).ready(function(){
    $("#searchAndButton").click(function () {

        var input = document.getElementById('autocomplete');
      var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
      google.maps.event.addListener(autocomplete, 'place_changed', function(){
         var place = autocomplete.getPlace();
      })

      




    })

});
   