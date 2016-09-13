const googleMap = googleMap || {};

googleMap.createMarker = function(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: this.map,
    position: place.geometry.location
  });
  $(".barNamesContainer").append(`<h3>${place.name}</h3>`);

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
      </form>`
    });
    this.infoWindow.open(this.map, marker);
    this.map.setCenter(marker.getPosition());
  });
};

googleMap.callback = function(results, status) {
  $(".barNamesContainer").empty();
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      googleMap.createMarker(results[i]);
      console.log(results[i]);
    }
  }
};

// Places Setup
googleMap.placesSetup = function(mapLocation) {
  var request = {
    location: mapLocation,
    radius: '50',
    query: 'bar',
    // type: 'bar'
  };
  this.service = new google.maps.places.PlacesService(this.map);
  this.service.textSearch(request, googleMap.callback);
};

googleMap.searchArea = function() {
  // Create the search box and link it to the UI element.
  let mapLocation = "";
  var input = document.getElementById('searchBox');
  var searchBox = new google.maps.places.SearchBox(input);
  googleMap.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  googleMap.map.addListener('bounds_changed', function() {
    searchBox.setBounds(googleMap.map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: googleMap.map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
      mapLocation = place.geometry.location;
    });
    googleMap.map.fitBounds(bounds);
    googleMap.placesSetup(mapLocation);
  });
};

// Setup the map with the intial starting options
googleMap.mapSetup = function() {
  let canvas = document.getElementById('map-canvas');
  let lat = 51.506178;
  let lng = -0.088369;
  let mapLocation = new google.maps.LatLng(lat,lng);
  let mapOptions = {
    zoom: 12,
    center: mapLocation,
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles:
    [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#3e3e3e"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#c81b1b"},{"lightness":20},{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#5c676f"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#9d9d9d"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#55b69f"},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"simplified"},{"color":"#747474"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"color":"#ffffff"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"},{"color":"#ffffff"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"simplified"},{"color":"#f6f6f6"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#0f252e"},{"lightness":17}]}]
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  googleMap.searchArea();
};

$(googleMap.mapSetup.bind(googleMap));
