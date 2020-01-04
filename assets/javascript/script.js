// var url = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=Atlanta&APPID=32e8183a7007303bba605abc3fd9efbe";

// getWeather()

// function getWeather() {
//     $.ajax({
//         type: "GET",
//         url: url,
    
//     }).then(function (res) { console.log(res);
//      });
// }



var longitudeValue;
var latitudeValue;
var placeSentToGeocode;
var apikey = "YOUR API KEY";
var restaurants;
var place_idVariable;
var restaurantsOutput = '<ul class="list-group">';
var photo;

//**autocomplete function starts after user types text into input field**
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
latitudeValue = place.geometry['location'].lat();
longitudeValue = place.geometry['location'].lng();
placeSentToGeocode = place.formatted_address;

if(placeSentToGeocode !== undefined){
    geocode();
}

});
}



//**Geocode function is called after autocomplete option is selected**
function geocode(){
   
   console.log("Geocode function called...")


   $.ajax({
       url: 'https://maps.googleapis.com/maps/api/geocode/json?',
       data: {
       address: placeSentToGeocode,
       key: apikey
    }
   })
    .then(function(response){
        //log full response
        console.log(response);

        // Latitude and logitude coordinates 
         latitudeValue = (response.results[0].geometry.location.lat);
         longitudeValue = (response.results[0].geometry.location.lng);
        

       initMap(); 
       restaurantFinder();
    })
    .catch(function(error){
        console.log(error)
    }); 
}

//**Hitting enter invokes geocode function, searching for address that best matches user input**
document.addEventListener("keyup", function(event){
    if(event.key == "Enter"){
        geocode2();
    }
});

function geocode2(){
   
    console.log("Geocode function called after ENTER press...")
 
    var location = document.getElementById('userInput').value;
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?',
        data: {
            address: location,
            key: apikey
        } 
    })
     .then(function(response){
         //log full response
         console.log(response);
 
         // Latitude and logitude coordinates 
          latitudeValue = (response.results[0].geometry.location.lat);
          longitudeValue = (response.results[0].geometry.location.lng);
         
 
        initMap(); 
        restaurantFinder();
     })
     .catch(function(error){
         console.log(error)
     });
     
     
 }



//**map is initialized after geocode function retrieves location data**
function initMap(){

console.log("Map function called...")

//Map options
var options = {
zoom:18,
center: {lat: latitudeValue, lng: longitudeValue}
}

//New map
document.getElementById('mapTitle').innerHTML = "Map";
var map = new google.maps.Map(document.getElementById('map'), options);

//Add marker
var marker = new google.maps.Marker({
position:{lat: latitudeValue, lng: longitudeValue},
map:map

});

console.log("Map and marker displayed.")
}



//**restaurantFinder finds the place ID of restaurants within 1 mile of user's coordinates**  
function restaurantFinder(){
    //refresh the restaurantPoints div in html file
    restaurantsOutput = "";
    document.getElementById('restaurantPoints').innerHTML = restaurantsOutput; 
    console.log("restaurantFinder function called...")

    var stringifiedPosition = String(latitudeValue) + "," + String(longitudeValue);
    console.log("Stringified is..." + stringifiedPosition);
    $.ajax({
        url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?',

        data: {
            location: stringifiedPosition,
            radius: '1609.34',
            type: 'restaurant', 
            key: apikey
        
        }
    })

  

    .then(function(response){
        console.log(response);

       
        

        for (i=0; i < 12; i++){
           
           place_idVariable = response.results[i].place_id;
           
           restaurantData();
        } 
    })
    .catch(function(error){
        console.log(error)
        
    });

    
}


//**restaurantData is called at the end of restaurantFinder, providing more info about each restaurant **/
function restaurantData(){

    console.log("restaurantData function called...")
    


        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?',
    
            data: {
                key: apikey,
                place_id: place_idVariable,
            }
        })
        .then(function(response){
            console.log(response);
            restaurants = response.result.name;
            photo = response.result.photos[0].photo_reference;
            restaurantsOutput+= 
                `<li class="list-group-item">${restaurants}</li>`;

                document.getElementById('restaurantTitle').innerHTML = "Restaurants";
                document.getElementById('restaurantPoints').innerHTML = restaurantsOutput; 
                // restaurantPhoto();
        })
}

// function restaurantPhoto(){

//     console.log("restaurantPhoto funcation called...")

    
//         $.ajax({
//             url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?',
//             data: {
//             key: apikey,
//             photoreference: photo,
//             maxheight: 400
            
//             }

            
//         })
//         .then(function(response){
//             var actualphoto = response;
//             console.log(response);
//             restaurantsOutput+= `<li class="list-group-item">${actualphoto}</li>`
//         })
// }

