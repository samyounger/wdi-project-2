// Get bar details from ajax request by element ID.

$(init);

function init() {
  $('.favourites').on("submit", "#favourite", saveDetails);
}

function saveDetails() {
  event.preventDefault();
  console.log("Clicked");
}
