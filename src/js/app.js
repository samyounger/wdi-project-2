const App = App || {};

App.init = function() {
  this.api_url = "http://localhost:3000/api";
  $(".home").on("click", this.barsHome);
  $(".index").on("click", this.barsIndex);
};


App.barsHome = function(e) {
  event.preventDefault();
  $(".barNamesContainer").empty();
};

App.barsIndex = function(e) {
  event.preventDefault();
  // Grab url
  let url = $(this).attr("href");
  // Make the ajax request for all the restaurants
  return App.getBarsForIndex(url);
};

App.getBarsForIndex = function(url) {
  return $.ajax({
    method: "GET",
    url: `${this.api_url}${url}`,
    beforeSend: this.setRequestHeader.bind(this)
  })
  .done(this.listBars);
};

App.listBars = function(data) {
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

App.ajaxRequest = function(url, method, data, callback){
  return $.ajax({
    url,
    method,
    data,
    beforeSend: this.setRequestHeader.bind(this)
  })
  .done(callback)
  .fail(data => {
    console.log(data);
  });
};

App.setRequestHeader = function(xhr, settings) {
  return xhr.setRequestHeader("Authorization", `Bearer ${this.getToken()}`);
};

App.getToken = function(){
  return window.localStorage.getItem("token");
};


$(App.init.bind(App));
