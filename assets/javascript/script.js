// var url = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=Atlanta&APPID=32e8183a7007303bba605abc3fd9efbe";

// getWeather()

// function getWeather() {
//     $.ajax({
//         type: "GET",
//         url: url,
    
//     }).then(function (res) { console.log(res);
//      });
// }



//latitude and longitude values will be held here

var longitude;
var latitude;
var placeSentToGeocode;
var apikey = "YOUR API KEY GOES HERE";
//hitting enter invokes geocode function
document.addEventListener("keyup", function(event){
    if(event.key == "Enter"){
        geocode2();
    }
});


//autocomplete function

google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {

console.log("Autocomplete function running...")

var input = document.getElementById('userInput');
var autocomplete = new google.maps.places.Autocomplete(input);

autocomplete.addListener('place_changed', function () {
var place = autocomplete.getPlace();

console.log("Place changed for: " + place.formatted_address);
console.log("Latitude: " + place.geometry['location'].lat());
console.log("Longitude: " + place.geometry['location'].lng());
latitude = place.geometry['location'].lat();
longitude = place.geometry['location'].lng();
placeSentToGeocode = place.formatted_address;

if(placeSentToGeocode !== undefined){
    geocode();
}

});
}





    




//Geocode function is called after autocomplete function, requesting 

function geocode(){
   
   console.log("Geocode function called...")


    axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {
       params:{
           address: placeSentToGeocode,
           key: apikey
       } 
    })
    .then(function(response){
        //log full response
        console.log(response);

        // Latitude and logitude coordinates 
         latitude = (response.data.results[0].geometry.location.lat);
         longitude = (response.data.results[0].geometry.location.lng);
        

       initMap(); 

    })
    .catch(function(error){
        console.log(error)
    });
    
    
}

//hitting enter starts this geocode function

function geocode2(){
   
    console.log("Geocode function called after ENTER press...")
 
    var location = document.getElementById('userInput').value;
    axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {
        params:{
            address: location,
            key: apikey
        } 
     })
     .then(function(response){
         //log full response
         console.log(response);
 
         // Latitude and logitude coordinates 
          latitude = (response.data.results[0].geometry.location.lat);
          longitude = (response.data.results[0].geometry.location.lng);
         
 
        initMap(); 
 
     })
     .catch(function(error){
         console.log(error)
     });
     
     
 }









//initialize map........................................
function initMap(){

console.log("Map function called...")

//Map options
var options = {
zoom:18,
center: {lat: latitude, lng: longitude}
}

//New map
var map = new google.maps.Map(document.getElementById('map'), options);

//Add marker
var marker = new google.maps.Marker({
position:{lat: latitude, lng: longitude},
map:map



});

console.log("Map and marker displayed.")
}


