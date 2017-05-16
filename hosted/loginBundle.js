"use strict";

var FieldGroup = ReactBootstrap.FieldGroup;
var FormGroup = ReactBootstrap.FormGroup;
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl = ReactBootstrap.FormControl;
var Panel = ReactBootstrap.Panel;
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;

// log in handler
var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#errorMessage").hide();

  // makes sure username or password is not empty
  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  }
  // post request to get user key and session id  
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

// creates a user and store in database
var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#errorMessage").hide();

  // make sure no field is empty
  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  // checks to see if user wrote correct password twice
  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  // post to create a user
  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

// render log in form
var renderLogin = function renderLogin() {
  return React.createElement(
    Panel,
    { id: "loginPanel" },
    React.createElement(
      "form",
      { id: "loginForm", name: "loginForm",
        onSubmit: this.handleSubmit,
        action: "/login",
        method: "POST",
        className: "mainForm"
      },
      React.createElement(
        FormGroup,
        { controlId: "loginFormControl", id: "formC" },
        React.createElement(
          ControlLabel,
          null,
          "Username:"
        ),
        React.createElement(FormControl, { id: "user", componentClass: "input", name: "username", placeholder: "username" }),
        React.createElement(
          ControlLabel,
          null,
          React.createElement("br", null),
          "Password: "
        ),
        React.createElement(FormControl, { id: "pass", componentClass: "input", type: "password", name: "pass", placeholder: "password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { type: "submit" },
            "Submit"
          )
        )
      )
    )
  );
};

// to sign in
var renderSignup = function renderSignup() {
  return React.createElement(
    Panel,
    { id: "loginPanel" },
    React.createElement(
      "form",
      { id: "signupForm",
        name: "signupForm",
        onSubmit: this.handleSubmit,
        action: "/signup",
        method: "POST",
        className: "mainForm"
      },
      React.createElement(
        FormGroup,
        { controlId: "signUpFormControl", id: "formC" },
        React.createElement(
          ControlLabel,
          null,
          "Username:"
        ),
        React.createElement(FormControl, { id: "user", componentClass: "input", name: "username", placeholder: "username" }),
        React.createElement(
          ControlLabel,
          null,
          React.createElement("br", null),
          "Password: "
        ),
        React.createElement(FormControl, { id: "pass", componentClass: "input", type: "password", name: "pass", placeholder: "password" }),
        React.createElement(
          ControlLabel,
          null,
          React.createElement("br", null),
          "Password: "
        ),
        React.createElement(FormControl, { id: "pass2", componentClass: "input", type: "password", name: "pass2", placeholder: "retype password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { type: "submit" },
            "Submit"
          )
        )
      )
    )
  );
};

// class for log in
var createLoginWindow = function createLoginWindow(csrf) {
  var LoginWindow = React.createClass({
    displayName: "LoginWindow",

    handleSubmit: handleLogin,
    render: renderLogin
  });

  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#contentLogin"));
};

// class for sign up
var createSignupWindow = function createSignupWindow(csrf) {
  var SignupWindow = React.createClass({
    displayName: "SignupWindow",

    handleSubmit: handleSignup,
    render: renderSignup
  });

  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#contentLogin"));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

// toggle show/hide error message
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#errorMessage").toggle('fast');
};

// new action, hide error messag
var redirect = function redirect(response) {
  $("#errorMessage").hide();
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    catche: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
