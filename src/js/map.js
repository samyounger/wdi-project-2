const googleMap = googleMap || {};

googleMap.getBars = function() {
  $.get("http://localhost:3000/api/bars").done(this.loopThroughBars);
};

googleMap.mapSetup = function() {
  let canvas = document.getElementById('map-canvas');
  let mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(canvas, mapOptions);
};

$(googleMap.mapSetup.bind(googleMap));
