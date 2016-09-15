(function(globals){
  if (!('App' in globals)) { globals.App = {}; }

  globals.App.navigation = function() {
    $(".home").on("click", this.barsHome);
    $(".favouriteBars").on("click", this.getUser.bind(this));
    $(".bars").on("click", this.barsIndex.bind(this));
  };

  globals.App.barsHome = function(e) {
    event.preventDefault();
    $(".barNamesContainer").empty();
  };

  globals.App.barsIndex = function(e) {
    event.preventDefault();
    // Grab url
    let url = $(event.target).attr("href");
    return globals.App.getBarsForIndex(url);
  };

  globals.App.getUser = function() {
    if (event) event.preventDefault();
    let url = `${this.api_url}/users/${this.getId()}`;
    return this.ajaxRequest(url, "get", null, this.listBarsForUser);
  };

  globals.App.getBarsForIndex = function(url) {
    let fullUrl = `${this.api_url}${url}`;
    return this.ajaxRequest(fullUrl, "get", null, this.listBars);
  };

  globals.App.listBars = function(data) {
    console.log(data);

    $(".barNamesContainer").empty();
    $(".barNamesContainer").prepend(
      `<div class="bars">
        <h2>Favourite Bars</h2>
      </div>
    `);
    $(".barNamesContainer").prepend(
      $.each(data.bars, (i, bar) => {
        $(".barNamesContainer").append(`
          <h3>${bar.name}</h3>
        `);
      }));
  };

  globals.App.listBarsForUser = function(data) {
    $(".barNamesContainer").empty();
    $(".barNamesContainer").prepend(
      `<div class="bars">
        <h2>Favourite Bars</h2>
      </div>
    `);
    $(".barNamesContainer").prepend(
      $.each(data.user.bars, (i, bar) => {
        $(".barNamesContainer").append(`
          <h3>${bar.name}</h3>
        `);
      }));
  };

  // globals.App.ajaxRequest = function(url, method, data, callback){
  //   return $.ajax({
  //     url,
  //     method,
  //     data,
  //     beforeSend: this.setRequestHeader.bind(this)
  //   })
  //   .done(callback)
  //   .fail(data => {
  //     console.log(data);
  //   });
  // };

  // globals.App.setRequestHeader = function(xhr, settings) {
  //   return xhr.setRequestHeader("Authorization", `Bearer ${this.getToken()}`);
  // };
  //
  // globals.App.getToken = function(){
  //   return window.localStorage.getItem("token");
  // };


  // $(globals.App.init.bind(globals.App));

})(window);
