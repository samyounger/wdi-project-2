// detect button clicked.
// get information from the marker/place.
// save data to database of the user.

(function(globals){
  if (!('App' in globals)) { globals.App = {}; }

  globals.App.favourite = function() {
    $("main").on("submit", "form", this.saveBar);
    // $("#favourite").on("click", this.saveBar);
  };

  globals.App.saveBar = function() {
    event.preventDefault();
    console.log("clicked");
    let method = "POST";
    let url = `${globals.App.api_url}/bars/${globals.App.getId()}`;
    let data = globals.App.barSelected;

    return $.ajax({
      method: method,
      url: url,
      data: data,
      beforeSend: globals.App.setRequestHeader.bind(this)
    }).done(data => {
      return getBarsIndex("/bars");
    }).fail(data => {
          console.log(data);
    });
  };


  function getBarsIndex(url) {
    return $.ajax({
      method: "GET",
      url: `${globals.App.api_url}${url}`,
    })
    .done(listBars);
  }

  // To be updated
  function listBars(data) {
  $(".barNamesContainer").empty();
  console.log(data);
  // $.each(data.pies, (i, pie) => {
  //   $("#index-container").append(`
  //     <li>
  //       <ul class="pieContainer">
  //       <h3 class="pieTitle">${pie.name}</h3>
  //         <li>
  //             <h3>View:
  //               <a class="show" href="/pies/${pie._id}">${pie.name}</a>
  //             </h3>
  //           <p>Colour: ${pie.colour}</p>
  //           <p>Weight: ${pie.weight}</p>
  //           <img src="${pie.image}">
  //         </li>
  //       </ul>
  //     </li>
  //   `);
  // });
  // return showContent("index");
}

})(window);
