"use strict";

var recipeRenderer = void 0;
var recipeForm = void 0;
var RecipeFormClass = void 0;
var RecipeListClass = void 0;
var Collapse = ReactBootstrap.Collapse;
var Button = ReactBootstrap.Button;
var Well = ReactBootstrap.Well;
var Col = ReactBootstrap.Col;
var Row = ReactBootstrap.Row;
var Glyphicon = ReactBootstrap.Glyphicon;

var handleRecipe = function handleRecipe(e) {
  e.preventDefault();

  if ($("#recipeName").val() == '') {
    console.log($("#recipeName").val());
    handleError("Recipe needs a name!");
    return false;
  }

  sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function () {
    recipeRenderer.loadRecipesFromServer();
  });

  return false;
};

/* Surely not a safe/good way to do this,
   but was what I could come up with */
var removeRecipe = function removeRecipe(name, ingr, notes) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
  // get key value, not safe
  var key = $("#cs")[0].attributes.value.value;
  // data to send
  var data = "name=" + name + "&ingr=" + ingr + "&notes=" + notes + "&_csrf=" + key;
  sendAjax('DELETE', '/removeRecipe', data, function () {
    recipeRenderer.loadRecipesFromServer();
  });

  return false;
};

var renderRecipe = function renderRecipe() {
  return React.createElement(
    "form",
    { id: "recipeForm",
      onSubmit: this.handleSubmit,
      name: "recipeForm",
      action: "/maker",
      method: "POST",
      className: "recipeForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "recipeName", type: "text", name: "name", placeholder: "Name" }),
    React.createElement(
      "label",
      { htmlFor: "ingr" },
      "Ingredients:"
    ),
    React.createElement("input", { id: "recipeIngr", type: "text", name: "ingr", placeholder: "Ingredients" }),
    React.createElement(
      "label",
      { htmlFor: "notes" },
      "Notes:"
    ),
    React.createElement("input", { id: "recipeNotes", type: "text", name: "notes", placeholder: "Cooking time/temperature" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "makeRecipeSubmit", type: "submit", value: "Make Recipe" })
  );
};

var renderRecipeList = function renderRecipeList() {
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "recipeList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        "No recipes yet"
      )
    );
  }

  var recipeNodes = this.state.data.map(function (recipe) {
    return React.createElement(
      "div",
      { key: recipe._id, className: "recipe" },
      React.createElement(
        "div",
        null,
        React.createElement(
          Col,
          { sm: 6, md: 3 },
          React.createElement(
            Well,
            null,
            React.createElement(
              "h3",
              { className: "textName" },
              "Name: ",
              recipe.name
            ),
            React.createElement(
              Button,
              null,
              React.createElement(Glyphicon, { glyph: "chevron-down" })
            ),
            React.createElement(
              "h3",
              { className: "text" },
              " Ingredients: ",
              recipe.ingredients
            ),
            React.createElement(
              "h3",
              { className: "text" },
              "Notes: ",
              recipe.notes
            ),
            React.createElement(
              Button,
              { onClick: function onClick() {
                  removeRecipe(recipe.name, recipe.ingredients, recipe.notes);
                } },
              " ",
              React.createElement(Glyphicon, { glyph: "trash" })
            )
          )
        )
      )
    );
  });

  return React.createElement(
    "div",
    { className: "recipeList" },
    React.createElement("input", { type: "hidden", id: "cs", name: "_csrf", value: this.props.csrf }),
    React.createElement(
      Row,
      { className: "show-grid" },
      recipeNodes
    )
  );
};

var setup = function setup(csrf) {
  RecipeFormClass = React.createClass({
    displayName: "RecipeFormClass",

    handleSubmit: handleRecipe,
    render: renderRecipe
  });

  RecipeListClass = React.createClass({
    displayName: "RecipeListClass",

    loadRecipesFromServer: function loadRecipesFromServer() {
      sendAjax('GET', '/getRecipes', null, function (data) {
        this.setState({ data: data.recipes });
      }.bind(this));
    },
    getInitialState: function getInitialState() {
      return { data: [] };
    },
    componentDidMount: function componentDidMount() {
      this.loadRecipesFromServer();
    },
    render: renderRecipeList
  });
  recipeForm = ReactDOM.render(React.createElement(RecipeFormClass, { csrf: csrf }), document.querySelector("#makeRecipe"));
  recipeRenderer = ReactDOM.render(React.createElement(RecipeListClass, { csrf: csrf }), document.querySelector("#recipes"));
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
};

var redirect = function redirect(response) {
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
