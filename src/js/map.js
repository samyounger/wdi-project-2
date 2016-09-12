const googleMap = googleMap || {};



googleMap.mapMarkerListen = function(startLocation, canvas) {
  
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
  // this.mapMarkerListen(startLocation, canvas);
};

$(googleMap.mapSetup.bind(googleMap));
