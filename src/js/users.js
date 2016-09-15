(function(globals){
  if (!('App' in globals)) { globals.App = {}; }

  globals.App.initAuth = function(){
    $(".logout").on("click", this.logout.bind(this));
    $("#editProfile").on("click", this.edit.bind(this));
    $("#editModal form").on("submit", this.editUser.bind(this));
    // $(".usersShow").on("click", this.usersShow.bind(this));

    this.$modal  = $(".modal");
    this.$modal.on("submit", "form", this.handleForm);

    if (this.getToken()) {
      this.loggedInState();
    } else {
      this.loggedOutState();
    }
  };

  globals.App.edit = function() {
    // Ajax request to get username & email
    let url = `${this.api_url}/users/${this.getId()}`;
    return this.ajaxRequest(url, "get", null, (data) => {
      this.$modal = $("#editModal");
      this.$modal.find("#editUserName").val(data.user.username);
      this.$modal.find("#editUserEmail").val(data.user.email);
    });
  };

  globals.App.editUser = function(){
    let data = $(event.target).serialize();
    let url = `${this.api_url}/users/${this.getId()}`;
    return this.ajaxRequest(url, "put", data, (data) => {
      console.log(data);
    });
  };

  globals.App.loggedInState = function(){
    console.log("LOGGED IN")
    $(".loggedOut").hide();
    $(".loggedIn").show();
    // this.usersIndex();
  };

  globals.App.loggedOutState = function(){
    console.log("LOGGED OUT")
    $(".loggedOut").show();
    $(".loggedIn").hide();
  };

  globals.App.logout = function() {
    event.preventDefault();
    this.removeToken();
    this.loggedOutState();
  };

  globals.App.handleForm = function(){
    event.preventDefault();
    $($(this).parents(".modal")).modal('hide');

    let url    = `${globals.App.api_url}${$(this).attr("action")}`;
    let method = $(this).attr("method");
    let data   = $(this).serialize();

    return globals.App.ajaxRequest(url, method, data, (data) => {
      if (data.token) {
        globals.App.setToken(data.token);
        globals.App.setId(data.user._id);
      }
      globals.App.loggedInState();
    });
  };

  globals.App.ajaxRequest = function(url, method, data, callback){
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

  globals.App.setRequestHeader = function(xhr, settings) {
    return xhr.setRequestHeader("Authorization", `Bearer ${this.getToken()}`);
  };

  globals.App.setToken = function(token){
    return window.localStorage.setItem("token", token);
  };

  globals.App.setId = function(id) {
    return window.localStorage.setItem("_id", id);
  };

  globals.App.getToken = function(){
    return window.localStorage.getItem("token");
  };

  globals.App.getId = function() {
    return window.localStorage.getItem("_id");
  };

  globals.App.removeToken = function(){
    return window.localStorage.clear();
  };

  // Accessing user data
  // globals.App.usersShow = function() {
  //   $.ajax({
  //     method: "GET",
  //     url: `${this.apiUrl}/users/${App.getId()}`,
  //     beforeSend: this.setRequestHeader.bind(this)
  //   }).done(data => {
  //     let user = data.user;
  //     console.log(user.username);
  //     return user.username;
  //   });
  // };

})(window);
