// toggle show/hide error message
const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#errorMessage").toggle('fast');
};

// new action, hide error messag
const redirect = (response) => {
  $("#errorMessage").hide();
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    catche: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};