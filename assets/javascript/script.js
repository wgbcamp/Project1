var longitudeValue;
var latitudeValue;
var placeSentToGeocode;
var apikey = "AIzaSyBKJBbZHJd1DBTHNE0xbibPIu8RGz-QSxU";
var place_idVariable;
var photo;
var savedAppendRestaurants;
var dayNumber = new Date();
var dayOutput = dayNumber.getDay();
var place_idVariableForLodging;
var savedAppendLodging;

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



//**Geocode function is called after autocomplete option is selected, clearing div of past results**
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
	   document.getElementById("restaurantPoints").innerHTML = "";
	   document.getElementById("lodgingPoints").innerHTML = "";
       restaurantFinder();
	   lodgingFinder();
    })
    .catch(function(error){
        console.log(error)
    }); 
}

//**Hitting enter invokes geocode function, searching for address that best matches user input, clearing div of past results**
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
		document.getElementById("restaurantPoints").innerHTML = "";
		document.getElementById("lodgingPoints").innerHTML = "";
        restaurantFinder();
		lodgingFinder();
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


//**restaurantData is called at the end of restaurantFinder, providing more info about each restaurant and appending to div **/
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
			
			document.getElementById('restaurantTitle').innerHTML = "Restaurants";
            document.getElementById('lodgingTitle').innerHTML = "Hotels";
            
				photo = response.result.photos[1].photo_reference; 
				var storethis = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=' + photo + '&key=' + apikey;
				var restNameV = response.result.name;
				var restAddressV = response.result.formatted_address;
				var restPhoneNumberV = response.result.formatted_phone_number;
				var restHoursV = response.result.opening_hours.weekday_text[dayOutput];
				
				$('#restaurantPoints').append(`
				
				                    <div class="columns has-text-center">
                        <div class="column is-6" id="photoSpot">
                            <img id="thePhoto" src="${storethis}">
                        </div>
                        <div class="box">

                        <div class="column is-6" id="infoSpot">
                            <div class="columns boldThis" id="restName">
                                ${restNameV}
                            </div>
                            <div class="columns" id="restAddress">
                                ${restAddressV}
                            </div>
                            <div class="columns" id="restPhoneNumber">
                                ${restPhoneNumberV}
                            </div>
                            <div class="columns" id="restHours">
                                ${restHoursV}
                            </div>
                        </div>
                    </div>

                    </div>
                    <br>
                    <br>
				
				`);
				
                
                //show page elements
                document.getElementById('hiddencolumns').style.visibility = "visible";
                //saving results for now
				savedAppendRestaurants = document.getElementById("restaurantPoints").innerHTML;
                
        })
}




//**lodgingFinder finds the place ID of hotels within 1 mile of user's coordinates**  
function lodgingFinder(){

    console.log("restaurantFinder function called...")

    var stringifiedPosition = String(latitudeValue) + "," + String(longitudeValue);
    console.log("Stringified is..." + stringifiedPosition);
    $.ajax({
        url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?',

        data: {
            location: stringifiedPosition,
            radius: '1609.34',
            type: 'lodging', 
            key: apikey
        
        }
    })
    .then(function(response){
        console.log(response);

        for (i=0; i < 10; i++){
           place_idVariableForLodging = response.results[i].place_id;
           lodgingData();
        } 
    })
    .catch(function(error){
        console.log(error)      
    });   
}


//**lodgingData is called at the end of lodgingFinder, providing more info about each hotel and appending to div **/
function lodgingData(){

    console.log("restaurantData function called...")
    
        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?',
    
            data: {
                key: apikey,
                place_id: place_idVariableForLodging,
            }
        })
        .then(function(response){
            console.log(response);
			
			document.getElementById('restaurantTitle').innerHTML = "Restaurants";
            document.getElementById('lodgingTitle').innerHTML = "Hotels";
            
				photo = response.result.photos[1].photo_reference; 
				var storethis = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=' + photo + '&key=' + apikey;
				var lodgNameV = response.result.name;
				var lodgAddressV = response.result.formatted_address;
				var lodgPhoneNumberV = response.result.formatted_phone_number;
 				var lodgHoursV = response.result.opening_hours.weekday_text[dayOutput];
 				
				$('#lodgingPoints').append(`
				
				                    <div class="columns has-text-center">
                        <div class="column is-6" id="photoSpot">
                            <img id="thePhoto" src="${storethis}">
                        </div>
                        <div class="box">

                        <div class="column is-6" id="infoSpot">
                            <div class="columns boldThis" id="restName">
                                ${lodgNameV}
                            </div>
                            <div class="columns" id="restAddress">
                                ${lodgAddressV}
                            </div>
                            <div class="columns" id="restPhoneNumber">
                                ${lodgPhoneNumberV}
                            </div>
                            <div class="columns" id="restHours">
                                ${lodgHoursV}
                            </div>
                        </div>
                    </div>

                    </div>
                    <br>
                    <br>
				
				`);
				
                
                //loading page elements
                document.getElementById('hiddencolumns').style.visibility = "visible";
                //saving results for now
				savedAppendLodging = document.getElementById("lodgingPoints").innerHTML;
                
        })
}

