// Get bar details from ajax request by element ID.

$(start);

function start() {
  $('#map-canvas').on("submit", ".favourites", saveDetails);
}

function saveDetails() {
  event.preventDefault();
  let data   = $(this).serialize();
  console.log(this);
}
