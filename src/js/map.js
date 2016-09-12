const googleMap = googleMap || {};

// googleMap.getBars = function() {
//   $.get("http://localhost:3000/api/bars").done(this.loopThroughBars);
// };

// Activate googlePlaces details on click of marker
googleMap.mapPlacesDetails = function() {
  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);

  document.getElementById('submit').addEventListener('click', function() {
    placeDetailsByPlaceId(service, map, infowindow);
  });
}

function placeDetailsByPlaceId(service, map, infowindow) {
  // Create and send the request to obtain details for a specific place,
  // using its Place ID.
  var request = {
    placeId: document.getElementById('place-id').value
  };

  service.getDetails(request, function (place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      // If the request succeeds, draw the place location on the map
      // as a marker, and register an event to handle a click on the marker.
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          'Place ID: ' + place.place_id + '<br>' +
          place.formatted_address + '</div>');
        infowindow.open(map, this);
      });

      map.panTo(place.geometry.location);
    }
  });
};

googleMap.mapPlaces = function() {
  // Places radius request
  let request = {
  location: startLocation,
  radius: '500',
  types: ['store']
  };
  // Request data from googlePlaces
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        // If the request succeeds, draw the place location on
        // the map as a marker, and register an event to handle a
        // click on the marker.
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
      }
    }
  });
};

// Add event listener infoWindow
googleMap.mapMarkerListen = function() {
  let infowindow = new google.maps.InfoWindow();
  let service = new google.maps.places.PlacesService(map);

  document.getElementById('submit').addEventListener('click', function() {
    placeDetailsByPlaceId(service, map, infowindow);
  });
  console.log(this);
};

// Setup the map with the intial starting options
googleMap.mapSetup = function() {
  let canvas = document.getElementById('map-canvas');
  let startLocation = new google.maps.LatLng(51.506178,-0.088369);
  let mapOptions = {
    zoom: 12,
    center: startLocation,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.mapMarkerListen();
};

$(googleMap.mapSetup.bind(googleMap));
