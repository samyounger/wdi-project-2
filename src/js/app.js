$(init);

const api_url = "http://localhost:3000/api";

function init() {
  $(".home").on("click", barsHome);
  $(".index").on("click", barsIndex);

  // showContent("home");
}

function barsHome(e) {
  event.preventDefault();
  showContent("home");
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
  $('#index-container').empty();
  $.each(data.bars, (i, bar) => {
    $("#index-container").append(`
      <li>${bar.name}</li>
    `);
  });
  return showContent("index");
}

function showContent(id) {
  //Hide all of the sections
  $("section").hide();
  // Show the section that you want to display
  $(`#${id}-content`).show();
}
