(function(globals){
  if (!('App' in globals)) { globals.App = {}; }

  globals.App.init = function(){
    // this.api_url = "http://localhost:3000/api";
    this.api_url = "https://barpleeze.herokuapp.com/api";
    this.navigation();
    this.initMap();
    globals.App.initAuth.call(globals.App);
    globals.App.favourite();
  };

  $(globals.App.init.bind(globals.App));

})(window);
