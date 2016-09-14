(function(globals){
  if (!('App' in globals)) { globals.App = {}; }

  globals.App.navigation = function() {
    $(".home").on("click", this.barsHome);
    $(".bars").on("click", this.barsIndex);
  };

  globals.App.barsHome = function(e) {
    event.preventDefault();
    $(".barNamesContainer").empty();
  };

  globals.App.barsIndex = function(e) {
    event.preventDefault();
    // Grab url
    let url = $(this).attr("href");
    // Make the ajax request for all the restaurants
    return globals.App.getBarsForIndex(url);
  };

  globals.App.getBarsForIndex = function(url) {
    return $.ajax({
      method: "GET",
      url: `${this.api_url}${url}`,
      beforeSend: this.setRequestHeader.bind(this)
    })
    .done(this.listBars);
  };

  globals.App.listBars = function(data) {
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
