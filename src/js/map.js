const googleMap = googleMap || {};

googleMap.createMarker = function(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: this.map,
    position: place.geometry.location
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
};

googleMap.callback = function(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      googleMap.createMarker(results[i]);
      console.log(results[i]);
    }
  }
};

// Setup the map with the intial starting options
googleMap.mapSetup = function() {
  let canvas = document.getElementById('map-canvas');
  let lat = 51.506178;
  let lng = -0.088369;
  let newMap = new google.maps.LatLng(lat,lng);
  let mapOptions = {
    zoom: 12,
    center: newMap,
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  var request = {
    location: newMap,
    radius: '500',
    query: 'bar'
  };
  // *** This is the problem line that stops the map rendering ***
  this.service = new google.maps.places.PlacesService(this.map);
  this.service.textSearch(request, googleMap.callback);
  // this.service.nearbySearch(request, googleMap.callback);
  // this.infowindow = new google.maps.InfoWindow();
};

$(googleMap.mapSetup.bind(googleMap));






// ***************************************************

// Query listener to pick listen for text in search box.
$(init);

function init() {
  $('button').on("click", saveSearch);
}

googleMap.getSearch = function() {
  event.preventDefault();
  return $("#searchBox").val();
};
