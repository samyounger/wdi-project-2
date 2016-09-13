const googleMap = googleMap || {};

// googleMap.addMarker = function($marker) {
//   // var
//   var latlng = new google.maps.LatLng( $marker.attr('data-lat'), $marker.attr('data-lng') );
//
//   // create marker
//   var marker = new google.maps.Marker({
//     position	: latlng,
//     map			: this.map,
//     icon: '...'
//   });
//
//   // add to array
//   map.markers.push( marker );
//
//   // if marker contains HTML, add it to an infoWindow
//   if($marker.html()){
//     // create info window
//     liTag = $("body ul.utilities").find("[data-lat='" + $marker.attr('data-lat') + "']");
//     // console.log(liTag);
//     // show info window when marker is clicked
//     $(liTag).click(function() {
//       infowindow.setContent($marker.html());
//       infowindow.open(this.map, marker);
//     });
//
//     google.maps.event.addListener(marker, 'click', function() {
//       infowindow.setContent($marker.html());
//       infowindow.open(this.map, marker);
//     });
//
//     // close info window when map is clicked
//     google.maps.event.addListener(this.map, 'click', function(event) {
//       if (infowindow) {
//         infowindow.close(); }
//       });
//
//     }
//   };

// ********************************************

googleMap.createMarker = function(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: this.map,
    position: place.geometry.location
  });
  $(".barNamesContainer").append(`
    <h3>${place.name}</h3>
    `);

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
      $(".barNamesContainer").empty();
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
        query: 'shoreditch',
        type: 'bar'
      };

      // Create the search box and link it to the UI element.
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
        });
        googleMap.map.fitBounds(bounds);
      });
      // this.service = new google.maps.places.PlacesService(this.map);
      // this.service.textSearch(request, googleMap.callback);
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
