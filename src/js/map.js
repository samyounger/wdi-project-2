const googleMap = googleMap || {};

// *****************************************************
// googleMap.add_marker = function( $marker, map ) {
// 	// var
// 	var latlng = $marker.geometry.location;
//   // new google.maps.LatLng( $marker.attr('$marker.geometry.location'), $marker.attr('data-lng') );
//   // console.log(latlng)
//   googleMap.markers = [];
//
//   var image = {
//     url:        $marker.icon,
//     size:       new google.maps.Size(71, 71),
//     origin:     new google.maps.Point(0, 0),
//     anchor:     new google.maps.Point(17, 34),
//     scaledSize: new google.maps.Size(25, 25)
//   };
//
//
// 	// create marker
// 	var marker = new google.maps.Marker({
// 		position: latlng,
// 		map:      map,
// 		icon:     image
// 	});
//
// 	// add to array
//   googleMap.markers.push( marker );
// 	// map.markers.push( marker );
//
//   // if marker contains HTML, add it to an infoWindow
//   // if( $marker.html()) {
//   // 	// create info window
//   // 	liTag=$(".barNamesContainer").find("[latlng='" + $marker.attr(laglng) + "']");
//   // 	// console.log(liTag);
//   // 	// show info window when marker is clicked
//   // 	$(liTag).click(function() {
//   // 		infowindow.setContent($marker.html());
//   // 		infowindow.open(map, marker);
//   // 	});
//   //
//   // 	google.maps.event.addListener(marker, 'click', function() {
//   // 		infowindow.setContent($marker.html());
//   // 		infowindow.open(map, marker);
//   // 	});
//   //
//   // 	// close info window when map is clicked
//   //   google.maps.event.addListener(map, 'click', function(event) {
//   //     if (infowindow) {
//   //         infowindow.close(); }
// 	//   });
// 	// }
// };

// *************************************************************

googleMap.createMarker = function(place) {

  var image = {
    url: place.icon,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  };

  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: this.map,
    position: place.geometry.location,
    icon: image
  });
  $(".barNamesContainer").append(`<h3>${place.name}</h3>`);

  google.maps.event.addListener(marker, 'click', function() {
    if(typeof this.infoWindow != "undefined") this.infoWindow.close();
    this.infoWindow = new google.maps.InfoWindow({
      map: this.map,
      content: `
      <form class="favourites">
        <h3>${place.name}</h3>
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
    [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  googleMap.searchArea();
};

$(googleMap.mapSetup.bind(googleMap));
