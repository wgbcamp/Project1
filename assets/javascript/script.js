var longitudeValue;
var latitudeValue;
var placeSentToGeocode;
var apikey = "YOUR_API_KEY";
var restaurants;
var place_idVariable;
var restaurantsOutput = '<ul style="list-style-type:none;">';
var photo;
var photoLoopCounter=0;
var boxCounter = 1;



var dayNumber = new Date();
var dayOutput = dayNumber.getDay();


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
    //refresh the restaurantPoints div in html file .....commented!
    restaurantsOutput = "";
    // document.getElementById('restaurantPoints').innerHTML = restaurantsOutput;  commented!
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

       
        

        for (i=0; i < 10; i++){
           
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
            photo = response.result.photos[photoLoopCounter].photo_reference; 
                
                document.getElementById('restaurantTitle').innerHTML = "Restaurants";
                document.getElementById('shoppingTitle').innerHTML = "Shopping";
//^^^^^ placeholder

                document.getElementById('restName' + boxCounter).innerHTML = response.result.name;
                document.getElementById('restAddress' + boxCounter).innerHTML = response.result.formatted_address;
                document.getElementById('restPhoneNumber' + boxCounter).innerHTML = response.result.formatted_phone_number;
                document.getElementById('restHours' + boxCounter).innerHTML = response.result.opening_hours.weekday_text[dayOutput];
                
                
                //loading page elements
                document.getElementById('hiddencolumns').style.visibility = "visible";
                
                photoLoopCounter++;
                if(photoLoopCounter== 10){
                    photoLoopCounter -= 10;
                }
                boxCounter++;
                if(boxCounter == 10){
                    boxCounter -= 9;
                }
                restaurantPhoto();
        })
}

function restaurantPhoto(){
    console.log("restaurantPhoto funcation called...")
    var storethis = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=' + photo + '&key=' + apikey;
    $("#thePhoto" + photoLoopCounter).attr("src",storethis);
    console.log("photolooper is " + photoLoopCounter);
    console.log("boxcounter is " + boxCounter);
}

