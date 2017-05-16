"use strict";

var FieldGroup = ReactBootstrap.FieldGroup;
var FormGroup = ReactBootstrap.FormGroup;
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl = ReactBootstrap.FormControl;
var Panel = ReactBootstrap.Panel;
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;

var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#errorMessage").hide();

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#errorMessage").hide();

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

// to log in
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

var createLoginWindow = function createLoginWindow(csrf) {
  var LoginWindow = React.createClass({
    displayName: "LoginWindow",

    handleSubmit: handleLogin,
    render: renderLogin
  });

  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#contentLogin"));
};

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

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#errorMessage").toggle('fast');
};

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
