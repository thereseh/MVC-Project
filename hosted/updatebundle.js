"use strict";

var FieldGroup = ReactBootstrap.FieldGroup;
var FormGroup = ReactBootstrap.FormGroup;
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl = ReactBootstrap.FormControl;
var Panel = ReactBootstrap.Panel;
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;

var handleChange = function handleChange(e) {
  e.preventDefault();
  $("#errorMessage").animate({ width: 'hide' }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('PUT', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);

  return false;
};

// to sign in
var renderChange = function renderChange() {
  return React.createElement(
    Panel,
    { id: "loginPanel" },
    React.createElement(
      "form",
      { id: "changeForm",
        name: "changeForm",
        onSubmit: this.handleSubmit,
        action: "/update",
        method: "PUT",
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
          "Current Password: "
        ),
        React.createElement(FormControl, { id: "pass", componentClass: "input", type: "password", name: "pass", placeholder: "current password" }),
        React.createElement(
          ControlLabel,
          null,
          React.createElement("br", null),
          "New Password: "
        ),
        React.createElement(FormControl, { id: "pass2", componentClass: "input", type: "password", name: "pass2", placeholder: "new password" }),
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

var createChangeWindow = function createChangeWindow(csrf) {
  var ChangeWindow = React.createClass({
    displayName: "ChangeWindow",

    handleSubmit: handleChange,
    render: renderChange
  });

  ReactDOM.render(React.createElement(ChangeWindow, { csrf: csrf }), document.querySelector("#contentLogin"));
};

var setup = function setup(csrf) {
  createChangeWindow(csrf);
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
