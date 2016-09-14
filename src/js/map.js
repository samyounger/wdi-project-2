(function(globals){
  if (!('App' in globals)) { globals.App = {}; }

  // *****************************************************
  globals.App.add_marker = function( $marker, map ) {
    // // var
    // console.log($marker.geometry.location);
    // var latlng = new google.maps.LatLng( $marker.attr('data-lat'), $marker.attr('data-lng') );
    //
    // // create marker
    // var marker = new google.maps.Marker({
    //   position	: latlng,
    //   map			: map,
    //   icon: '...'
    // });

    // add to array
    // globals.App.map.markers.push( marker );

    // if marker contains HTML, add it to an infoWindow
    if( $marker.html() )
    {
      // create info window

      liTag=$(".barNamesContainer").find("[data-lat='" + $marker.attr('data-lat') + "']");
      // console.log(liTag);
      // show info window when marker is clicked
      $(liTag).click(function() {
        infowindow.setContent($marker.html());
        infowindow.open(map, marker);
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent($marker.html());
        infowindow.open(map, marker);
      });

      // close info window when map is clicked
      google.maps.event.addListener(map, 'click', function(event) {
        if (infowindow) {
          infowindow.close(); }
        });

      }
    };

    // *************************************************************

    // Remove Markers
    globals.App.removeMarkers = function() {
      for (var i = 0; i < globals.App.markers.length; i++) {
        globals.App.markers[i].setMap(null);
        console.log("removed marker");
      }
    };

    globals.App.addInfoWindowForBar = function(data, marker) {
      let bar = data.json.result;

      if (typeof this.infoWindow != "undefined") this.infoWindow.close();

      this.infoWindow = new google.maps.InfoWindow({
        map: this.map,
        content: `
        <form class="favourites">
        <h3>${bar.formatted_address}</h3>
        </form>`
      });


      this.infoWindow.open(this.map, marker);
      this.map.setCenter(marker.getPosition());
    };


    globals.App.markerListen = function(marker, place) {
      $(".barNamesContainer").append(`<li class="list-group-item">${place.name}</li>`);
      google.maps.event.addListener(marker, 'click', function() {
        let url = `http://localhost:3000/api/bar/${place.place_id}`;
        globals.App.ajaxRequest(url, "get", null, (data) => {
          globals.App.addInfoWindowForBar(data, marker);
        });
      });
    };

    globals.App.addMarker = function(place) {

      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      var marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
        icon: image
      });
      globals.App.markers.push(marker);
      globals.App.markerListen(marker, place);
    };

    globals.App.callback = function(results, status) {
      $(".barNamesContainer").empty();
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          globals.App.addMarker(results[i]);
          // console.log(results[i]);
        }
      }
    };

    // Places Setup
    globals.App.placesSetup = function(mapLocation) {

      var request = {
        location: mapLocation,
        radius: '1',
        query: 'bar',
      };
      this.service = new google.maps.places.PlacesService(this.map);
      this.service.textSearch(request, globals.App.callback);
    };

    globals.App.searchBox = function() {
      // Create the search box and link it to the UI element.
      let mapLocation = "";
      var input = document.getElementById('searchBox');
      globals.App.removeMarkers();

      var searchBox = new google.maps.places.SearchBox(input);
      // ***************************** HUH? */
      // globals.App.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      globals.App.map.addListener('bounds_changed', function() {
        searchBox.setBounds(globals.App.map.getBounds());
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
            map: globals.App.map,
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
        globals.App.map.fitBounds(bounds);
        globals.App.placesSetup(mapLocation);
      });
    };

    // geoLocator
    globals.App.geoLocator = function() {
      const infoWindow = new google.maps.InfoWindow({
        map: globals.App.map
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent('You');
          infoWindow.map.setCenter(pos);
          globals.App.placesSetup(pos);
        }, function() {
          handleLocationError(true, infoWindow, infoWindow.map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, infoWindow.map.getCenter());
      }
    };

    // Setup the map with the intial starting options
    globals.App.mapSetup = function() {
      $("main").html(`<div class="row">
      <div class="col-md-8">
      <div id="map-canvas"></div>
      </div>
      <div class="col-md-4">
      <h2>Search for restaurants</h2>
      <form class="form-horizontal">
      <div class="form-group">
      <input type="text" id="searchBox" class="form-control" placeholder="Search">
      </div>
      </form>
      <ul class="list-group barNamesContainer"></ul>
      </div>
      </div>`);
      let canvas = document.getElementById('map-canvas');
      globals.App.markers = [];
      let lat = 51.506178;
      let lng = -0.088369;
      let mapLocation = new google.maps.LatLng(lat,lng);
      let mapOptions = {
        zoom: 15,
        center: mapLocation,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles:
        [{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"administrative.neighborhood","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#e9e5dc"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54},{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"transit.station.airport","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.airport","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":43},{"lightness":-11},{"color":"#89cada"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"}]}]
      };
      this.map = new google.maps.Map(canvas, mapOptions);
    };

    globals.App.reRunPlaces = function() {
      globals.App.removeMarkers();
      let location = globals.App.map.getCenter();
      globals.App.placesSetup(location);
    };

    globals.App.initMap = function(){
      globals.App.mapSetup();
      globals.App.geoLocator();
      globals.App.searchBox();
      $(".home").on("click", globals.App.mapSetup.bind(globals.App));
      globals.App.map.addListener("dragend", globals.App.reRunPlaces);
    };

  })(window);
