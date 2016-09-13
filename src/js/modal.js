$(overlay);

// module.exports = {
// 	overlay: moduleOverlay
// };

function overlay() {
	el = document.getElementById("overlay");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}
