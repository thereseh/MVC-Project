"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var recipeRenderer = void 0;
var modalRenderer = void 0;

var recipeForm = void 0;
var RecipeFormClass = void 0;
var RecipeListClass = void 0;
var AddNewRecipeClass = void 0;
var Collapse = ReactBootstrap.Collapse;
var Button = ReactBootstrap.Button;
var Well = ReactBootstrap.Well;
var Col = ReactBootstrap.Col;
var Row = ReactBootstrap.Row;
var Glyphicon = ReactBootstrap.Glyphicon;
var FormGroup = ReactBootstrap.FormGroup;
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl = ReactBootstrap.FormControl;
var Panel = ReactBootstrap.Panel;

var Modal = ReactBootstrap.Modal;

var handleRecipe = function handleRecipe(e) {
  console.log($("#modalRenderer").serialize());
  sendAjax('POST', $("#modalRenderer").attr("action"), $("#modalRenderer").serialize(), function () {
    console.log('render');
    recipeRenderer.loadRecipesFromServer();
  });

  return false;
};

/* Surely not a safe/good way to do this,
   but was what I could come up with */
var removeRecipe = function removeRecipe(name, ingr, notes, cat) {
  // get key value, not safe
  var key = $("#cs")[0].attributes.value.value;
  // data to send
  var data = "name=" + name + "&ingr=" + ingr + "&notes=" + notes + "&category=" + cat + "&_csrf=" + key;
  data = data.replace(/ /g, '+');
  sendAjax('DELETE', '/removeRecipe', data, function () {
    recipeRenderer.loadRecipesFromServer();
  });

  return false;
};

var renderModal = function renderModal() {
  var _React$createElement, _React$createElement2;

  return React.createElement(
    "div",
    null,
    React.createElement(
      Modal,
      { show: this.state.showModal, onHide: this.close },
      React.createElement(
        "form",
        { id: "modalRenderer",
          onSubmit: this.handleSubmit,
          name: "modalRenderer",
          action: "/maker",
          method: "POST",
          className: "modalRenderer"
        },
        React.createElement(
          Modal.Header,
          { closeButton: true },
          React.createElement(
            Modal.Title,
            null,
            "Add Recipe"
          )
        ),
        React.createElement(
          Modal.Body,
          null,
          React.createElement(
            FormGroup,
            { controlId: "formControlsName", id: "formName", validationState: this.state.validation },
            React.createElement(
              ControlLabel,
              null,
              "Name"
            ),
            React.createElement(FormControl, { id: "recipeName", componentClass: "input", name: "name", value: this.state.value, placeholder: this.state.placeholder, onChange: this.handleChange }),
            React.createElement(FormControl.Feedback, null)
          ),
          React.createElement(
            FormGroup,
            { controlId: "formControlsCategory" },
            React.createElement(
              ControlLabel,
              null,
              "Category"
            ),
            React.createElement(FormControl, { id: "categoryName", componentClass: "input", name: "category", placeholder: "Category..." })
          ),
          React.createElement(
            FormGroup,
            { controlId: "formControlsIngredients" },
            React.createElement(
              ControlLabel,
              null,
              "Ingredients"
            ),
            React.createElement(FormControl, (_React$createElement = { id: "ingred", componentClass: "textarea" }, _defineProperty(_React$createElement, "id", "recipeIngr"), _defineProperty(_React$createElement, "name", "ingr"), _defineProperty(_React$createElement, "placeholder", "Ingredients..."), _React$createElement))
          ),
          React.createElement(
            FormGroup,
            { controlId: "formControlsNotes" },
            React.createElement(
              ControlLabel,
              null,
              "Notes"
            ),
            React.createElement(FormControl, (_React$createElement2 = { id: "notes", componentClass: "textarea" }, _defineProperty(_React$createElement2, "id", "recipeNotes"), _defineProperty(_React$createElement2, "name", "notes"), _defineProperty(_React$createElement2, "placeholder", "Notes/Instructions..."), _React$createElement2))
          ),
          React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf })
        ),
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

var renderRecipeList = function renderRecipeList() {
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "recipeList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        " No recipes yet "
      )
    );
  }

  var recipeList = this;
  var recipeNodes = this.state.data.map(function (recipe) {
    recipeList.state.childS[recipe._id] = { id: recipe._id, open: false };
    return React.createElement(
      "div",
      { key: recipe._id, className: "recipe" },
      React.createElement(
        "div",
        null,
        React.createElement(
          Col,
          { sm: 6, md: 4 },
          React.createElement(
            Well,
            null,
            React.createElement(
              "h3",
              { className: "textName" },
              recipe.name,
              " "
            ),
            React.createElement(
              Button,
              { id: "showBtn", onClick: function onClick() {
                  recipeList.toggleChildMenu(recipe._id);
                } },
              React.createElement(Glyphicon, { glyph: "chevron-down" }),
              " "
            ),
            React.createElement(
              Collapse,
              { "in": recipeList.state.childS[recipe._id].open },
              React.createElement(
                "div",
                { id: "recipeCont" },
                React.createElement(
                  "h3",
                  { className: "textIngr" },
                  "Ingredients:",
                  React.createElement("br", null)
                ),
                React.createElement(
                  "p",
                  { className: "output" },
                  recipe.ingredients
                ),
                React.createElement(
                  "h3",
                  { className: "textNotes" },
                  "Notes:",
                  React.createElement("br", null)
                ),
                React.createElement(
                  "p",
                  { className: "output" },
                  recipe.notes
                ),
                React.createElement(
                  Modal.Footer,
                  { id: "listFooter" },
                  React.createElement(
                    Button,
                    { onClick: function onClick() {
                        removeRecipe(recipe.name, recipe.ingredients, recipe.notes, recipe.category);
                      } },
                    React.createElement(Glyphicon, { glyph: "trash" }),
                    " "
                  )
                )
              )
            )
          )
        )
      )
    );
  });

  return React.createElement(
    "div",
    { className: "recipeList" },
    React.createElement("input", {
      type: "hidden",
      id: "cs",
      name: "_csrf",
      value: this.props.csrf
    }),
    React.createElement(
      Row,
      { className: "show-grid" },
      " ",
      recipeNodes,
      " "
    )
  );
};

var createModal = function createModal(csrf) {
  AddNewRecipeClass = React.createClass({
    displayName: "AddNewRecipeClass",
    getInitialState: function getInitialState() {
      return {
        showModal: true,
        value: '',
        validation: '',
        placeholder: 'Name of recipe...'
      };
    },
    handleSubmit: function handleSubmit(e) {
      e.preventDefault();
      var length = this.state.value.length;
      if (length === 0) {
        this.setState({ validation: 'error' });
        this.setState({ placeholder: 'Please, give me a name!' });
      } else {
        this.setState({ showModal: false });
        handleRecipe(e);
      }
    },
    handleChange: function handleChange(e) {
      this.setState({ value: e.target.value });
    },
    close: function close() {
      this.setState({ showModal: false });
    },

    render: renderModal
  });
  modalRenderer = ReactDOM.render(React.createElement(AddNewRecipeClass, { csrf: csrf }), document.querySelector("#content"));
};
var setup = function setup(csrf) {
  var addRecipeButton = document.querySelector("#addRecipe");
  addRecipeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createModal(csrf);
    return false;
  });

  RecipeListClass = React.createClass({
    displayName: "RecipeListClass",

    loadRecipesFromServer: function loadRecipesFromServer() {
      sendAjax('GET', '/getRecipes', null, function (data) {
        this.setState({
          data: data.recipes
        });
      }.bind(this));
    },
    getInitialState: function getInitialState() {
      return {
        data: [],
        childS: {},
        open: false
      };
    },
    handleToggle: function handleToggle(data) {
      this.setState({
        open: data
      });
    },
    changeTheState: function changeTheState(key) {
      consle.log('log');
    },
    toggleChildMenu: function toggleChildMenu(key) {
      console.dir(this.state.childS);
      this.state.childS = !this.state.childS;
      console.dir(this.state.childS);
    },

    componentDidMount: function componentDidMount() {
      this.loadRecipesFromServer();
    },
    render: renderRecipeList
  });

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
