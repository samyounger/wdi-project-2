$(overlay);

function overlay() {
	el = document.getElementById("overlay");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
	$("#overlay").append(`
		<div class="modalBox">
			<h2 class="modalTitle">Welcome to BarPleeze</h2>
			<p>The webApp that finds you a nearby bar</p>
			<ul>
				<li><a class="register loggedOut" href="#">Register</a></li>
				<li><a class="login loggedOut" href="#">Login</a></li>
				<li><a class="logout loggedIn" href="#">Logout</a></li>
			</ul>
			<div class="modalForm"></div>
			<a class="begin" href="#" onclick="overlay()">Begin</a>
		</div>
	`);
}
