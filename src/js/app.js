$(init);

const api_url = "http://localhost:3000/api";

function init() {
  $(".home").on("click", barsHome);
  $(".index").on("click", barsIndex);
}

function barsHome(e) {
  event.preventDefault();
  $("main").empty();
}

function barsIndex(e) {
  event.preventDefault();
  // Grab url
  let url = $(this).attr("href");
  // Make the ajax request for all the restaurants
  return getBarsForIndex(url);
}

function getBarsForIndex(url) {
  return $.ajax({
    method: "GET",
    url: `${api_url}${url}`
  })
  .done(listBars);
}

function listBars(data) {
  $("main").empty();
  $("main").prepend(
    `<h2>Bars Listed</h2>`,
    $.each(data.bars, (i, bar) => {
      $("main").append(`
        <h3>${bar.name}</h3>
      `);
    }));
}
