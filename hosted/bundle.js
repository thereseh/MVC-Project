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

var openEdit = function openEdit() {
  return $("#cs")[0].attributes.value.value;
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

var renderRecipe = function renderRecipe() {
  var _this = this;

  //use the inherited variables from Song Container parent element. This Song element will have a specific artist and songTitle passed in from the Song Container when it renders. 
  var recipeList = this;
  return React.createElement(
    Col,
    { sm: 6, md: 4 },
    React.createElement(
      Well,
      null,
      React.createElement(
        "h3",
        { className: "textName" },
        this.props.name,
        " "
      ),
      React.createElement(
        Button,
        { id: "showBtn", onClick: function onClick() {
            recipeList.toggleChildMenu();
          } },
        React.createElement(Glyphicon, { glyph: "chevron-down" }),
        " "
      ),
      React.createElement(
        Collapse,
        { "in": recipeList.state.open },
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
            this.props.ingredients
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
            this.props.notes
          ),
          React.createElement(
            Modal.Footer,
            { id: "listFooter" },
            React.createElement(
              Button,
              { onClick: function onClick() {
                  createModal(openEdit());
                } },
              "Edit"
            ),
            React.createElement(
              Button,
              { onClick: function onClick() {
                  removeRecipe(_this.props.name, _this.props.ingredients, _this.props.notes, _this.props.category);
                } },
              React.createElement(Glyphicon, { glyph: "trash" }),
              " "
            )
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
    return React.createElement(
      "div",
      { key: recipe._id, className: "recipe" },
      React.createElement(Recipe, { name: recipe.name, category: recipe.category, ingredients: recipe.ingredients, notes: recipe.notes, onClick: recipeList.toggleChildMenu })
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

var defaultRecipeProps = function defaultRecipeProps() {
  return {
    open: false,
    name: '',
    category: '',
    ingredients: '',
    notes: ''
  };
};

var Recipe = React.createClass({
  displayName: "Recipe",

  getDefaultProps: defaultRecipeProps,
  render: renderRecipe,
  propTypes: {
    name: React.PropTypes.string.isRequired,
    category: React.PropTypes.string.isRequired,
    ingredients: React.PropTypes.string.isRequired,
    notes: React.PropTypes.string.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      open: false
    };
  },
  toggleChildMenu: function toggleChildMenu() {
    this.setState({ open: !this.state.open });
  }
});

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
        open: false
      };
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
'use strict';

var YummlyListClass = void 0;
var SearchYummlyClass = void 0;
var searchRenderer = void 0;
var FieldGroup = ReactBootstrap.FieldGroup;

// to break up the different responses
var handleResponse = function handleResponse(xhr) {
  switch (xhr.status) {
    case 200:
      //success
      var search = void 0;
      console.log(JSON.parse(xhr.response));
      break;
    default:
      //default other errors we are not handling in this example
      break;
  }
};

var handleSearch = function handleSearch(e) {
  console.log('post');

  sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function () {
    console.log('render');
  });
};

var renderSearch = function renderSearch() {
  return React.createElement(
    'div',
    null,
    React.createElement(
      Panel,
      null,
      React.createElement(
        'form',
        { id: 'searchForm',
          onSubmit: this.handleSubmit,
          name: 'searchForm',
          action: '/search',
          method: 'GET',
          className: 'searchForm'
        },
        React.createElement(
          FormGroup,
          { controlId: 'formControlsSearch', validationState: this.state.validation, id: 'formS' },
          React.createElement(
            ControlLabel,
            null,
            'Name'
          ),
          React.createElement(FormControl, { id: 'searchRec', componentClass: 'input', name: 'searchRec', value: this.state.value, placeholder: this.state.placeholder, onChange: this.handleChange })
        ),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
        React.createElement(
          Button,
          { id: 'sBtn', type: 'submit' },
          'Submit'
        )
      )
    )
  );
};

var createSearchWindow = function createSearchWindow(csrf) {
  var SearchWindow = React.createClass({
    displayName: 'SearchWindow',
    getInitialState: function getInitialState() {
      return {
        value: '',
        validation: '',
        placeholder: 'Chicken...'
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
        handleSearch(e);
      }
    },
    handleChange: function handleChange(e) {
      this.setState({ value: e.target.value });
    },

    render: renderSearch
  });

  searchRenderer = ReactDOM.render(React.createElement(SearchWindow, { csrf: csrf }), document.querySelector("#searchPanel"));
};

var setupSearch = function setupSearch(csrf) {
  console.log('setup');
  createSearchWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setupSearch(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
