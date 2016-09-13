const App = App || {};

$(App.init);

App.init = function(){
  this.apiUrl = "http://localhost:3000/api";
  this.$modal  = $(".modalForm");

  $(".register").on("click", this.register.bind(this));
  $(".login").on("click", this.login.bind(this));
  $(".logout").on("click", this.logout.bind(this));
  $(".usersShow").on("click", this.usersShow.bind(this));
  this.$modal.on("submit", "form", this.handleForm);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

App.loggedInState = function(){
  $(".loggedOut").hide();
  $(".loggedIn").show();
  // this.usersIndex();
};

App.loggedOutState = function(){
  $(".loggedOut").show();
  $(".loggedIn").hide();
  this.register();
};

App.register = function() {
  if (event) event.preventDefault();
  this.$modal.html(`
    <h2>Register</h2>
    <form method="post" action="/register">
      <div class="form-group">
        <input class="form-control" type="text" name="user[username]" placeholder="Username">
      </div>
      <div class="form-group">
        <input class="form-control" type="email" name="user[email]" placeholder="Email">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="user[password]" placeholder="Password">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
      </div>
      <input type="submit" id="userRegister" value="Register">
    </form>
  `);
};

App.login = function() {
  event.preventDefault();
  this.$modal.html(`
    <h2>Login</h2>
    <form method="post" action="/login">
      <div class="form-group">
        <input class="form-control" type="email" name="email" placeholder="Email">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <input type="submit" id="userLogin" value="Login">
    </form>
  `);
};

App.logout = function() {
  event.preventDefault();
  this.removeToken();
  this.loggedOutState();
};

App.handleForm = function(){
  event.preventDefault();

  let url    = `${App.apiUrl}${$(this).attr("action")}`;
  let method = $(this).attr("method");
  let data   = $(this).serialize();

  return App.ajaxRequest(url, method, data, (data) => {
    if (data.token) {
      App.setToken(data.token);
      App.setId(data.user._id);
    }
    App.loggedInState();
  });
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

App.setToken = function(token){
  return window.localStorage.setItem("token", token);
};

App.setId = function(id) {
  return window.localStorage.setItem("_id", id);
};

App.getToken = function(){
  return window.localStorage.getItem("token");
};

App.getId = function() {
  return window.localStorage.getItem("_id");
};

App.removeToken = function(){
  return window.localStorage.clear();
};

$(App.init.bind(App));

// Accessing user data
App.usersShow = function() {
  $.ajax({
    method: "GET",
    url: `${this.apiUrl}/users/${App.getId()}`,
    beforeSend: this.setRequestHeader.bind(this)
  }).done(data => {
    let user = data.user;
    console.log(user.username);
    return user.username;
  });
};
