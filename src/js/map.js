(function(globals){
  if (!('App' in globals)) { globals.App = {}; }

  // Remove Markers
  globals.App.removeMarkers = function() {
    for (var i = 0; i < globals.App.markers.length; i++) {
      globals.App.markers[i].setMap(null);
    }
  };

  globals.App.reviewsLoop = function(reviews) {
    for (var i = 0; i < reviews.length; i++) {
      $(".infoWindowForm").append(`
        <p class="review reviewAuthor"><strong>${reviews[i].author_name}</strong> | bar rating : ${reviews[i].rating}</p>
        <p class="review">${reviews[i].text}</p>
        `);
      }
    };

    globals.App.addInfoWindowForBar = function(data, marker) {
      let bar = data.json.result;
      globals.App.barSelected = {
        name: bar.name,
        googlePlaceId: bar.place_id,
        url:  bar.website,
        lat:  bar.geometry.location.lat,
        lng:  bar.geometry.location.lng
      };

      if (typeof this.infoWindow != "undefined") this.infoWindow.close();
      this.infoWindow = new google.maps.InfoWindow({
        map: this.map,
        content: `
        <form class="infoWindowForm">
          <h3>${bar.name}</h3>
          <div class="imageContainer"></div>
          <p><strong>Phone:</strong> ${bar.formatted_phone_number}</p>
          <p class="webAddress"><strong>WebSite:</strong> <a href="${bar.website}">${bar.website}</a></p>
          <input type="submit" id="favouriteButton" value="Favourite">
        </form>`
      });

      if(bar.reviews) {
        globals.App.reviewsLoop(bar.reviews);
      }

      if(bar.photos) {
        $(".imageContainer").append(
          `<img class="barImage" src="https://maps.googleapis.com/maps/api/place/photo?maxheight=150&photoreference=${bar.photos[0].photo_reference}&key=AIzaSyByvlUTw9rHtlxIbic2gCVdhpj-8dK7sTQ">`
        );
      }

      google.maps.event.addListener(globals.App.map, "click", function(event) {
        globals.App.infoWindow.close();
      });

      globals.App.infoWindow.open(this.map, marker);
      window.setTimeout(function(){
        globals.App.map.setCenter(marker.getPosition());
        globals.App.map.panBy(0,-180);
      }, 100);
    };


    globals.App.markerListen = function(marker, place) {
      google.maps.event.addListener(marker, 'click', function() {
        let url = `http://localhost:3000/api/bar/${place.place_id}`;
        globals.App.ajaxRequest(url, "get", null, (data) => {
          globals.App.addInfoWindowForBar(data, marker);
        });
      });
      $(".barNamesContainer").append(`<li class="list-group-item" id="${place.place_id}"><a href="#">${place.name}</a></li>`);
      $(`#${place.place_id}`).on("click", marker, function() {
        let url = `http://localhost:3000/api/bar/${place.place_id}`;
        globals.App.ajaxRequest(url, "get", null, (data) => {
          globals.App.addInfoWindowForBar(data, marker);
        });
      });
    };

    globals.App.addMarker = function(place, timeOut) {
      var markerImage = "/images/barMarker.png";

      var image = {
        url: markerImage,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      };

      var marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
        icon: image,
        animation: google.maps.Animation.DROP
      });
      globals.App.markers.push(marker);
      globals.App.markerListen(marker, place);
    };

    globals.App.markerTimeout = function(place, delay) {
      window.setTimeout(function(){
        globals.App.addMarker(place);
      }, delay);
    };

    globals.App.callback = function(results, status) {
      $(".barNamesContainer").empty();
      var timeoutId;
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        $.each(results, (index, bar) => {
          globals.App.markerTimeout(bar, index * 200);
        });
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

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          var marker = new google.maps.Marker({
            map: globals.App.map,
            position: pos,
            // icon: icon
          });
          globals.App.map.setCenter(pos);
          globals.App.placesSetup(pos);
        });
      }
    };

    // Setup the map with the intial starting options
    globals.App.mapSetup = function() {
      $("main").html(
        `
        <div class="row mapSearchContainer">
          <div id="map-canvas"></div>
          <div class="btn-group col-md-3 searchContainer">
            <input type="text" id="searchBox" class="form-control" placeholder="Search">
            <button type="button" class="btn btn-default col-md-3 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            List of Bars <span class="caret"></span>
            </button>
            <ul class="dropdown-menu barNamesContainer"></ul>
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
          [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#34495e"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#566777"},{"lightness":5}]},{"featureType":"poi.school","elementType":"labels.icon","stylers":[{"color":"#98acbf"}]},{"featureType":"poi.sports_complex","elementType":"labels.icon","stylers":[{"color":"#7ca2c7"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#4d5a67"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#3d5165"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#2e3944"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#52606f"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#445d75"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"color":"#5a748d"}]},{"featureType":"transit","elementType":"labels.icon","stylers":[{"color":"#5a748d"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}]
        };
        this.map = new google.maps.Map(canvas, mapOptions);
      };

      globals.App.reRunPlaces = function() {
        // globals.App.removeMarkers();
        let location = globals.App.map.getCenter();
        globals.App.placesSetup(location);
      };

      globals.App.mapStart = function(){
        $(".home").on("click", globals.App.initMap);
      };

      globals.App.initMap = function() {
        globals.App.mapSetup();
        globals.App.geoLocator();
        globals.App.searchBox();
        globals.App.map.addListener("dragend", globals.App.reRunPlaces);
        globals.App.mapStart();
      };
    })(window);
