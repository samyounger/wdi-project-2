const googleMap = googleMap || {};

googleMap.createMarker = function(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: this.map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    if(typeof this.infoWindow != "undefined") this.infoWindow.close();
    this.infoWindow = new google.maps.InfoWindow({
      map: this.map,
      content: `
        <form class="favourites">
          <h3>${place.name}</h3>
          ${place.photos[0].html_attributions[0]}
          <p><strong>Rating:</strong> ${place.rating}</p>
          <input type="submit" id="favourite" value="Favourite">
        </form>
      `});
    this.infoWindow.open(this.map, marker);
    this.map.setCenter(marker.getPosition());
  });
};

googleMap.callback = function(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      googleMap.createMarker(results[i]);
      // console.log(results[i]);
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
    query: 'shoreditch',
    type: 'bar'
  };
  // *** This is the problem line that stops the map rendering ***
  this.service = new google.maps.places.PlacesService(this.map);
  this.service.textSearch(request, googleMap.callback);
};

$(googleMap.mapSetup.bind(googleMap));

// ***************************************************

// Query listener to pick listen for text in search box.
$(init);

function init() {
  $('button').on("click", googleMap.saveBar);
  $(".search").on("click", googleMap.searchLocation);
}

googleMap.saveBar = function() {
  event.preventDefault();
};

googleMap.searchLocation = function() {
  event.preventDefault();
  return $("#searchBox").val();
};
