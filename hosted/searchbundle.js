"use strict";

var YummlyListClass = void 0;
var SearchYummlyClass = void 0;
var searchRenderer = void 0;
var searchListRenderer = void 0;
var FieldGroup = ReactBootstrap.FieldGroup;
var Panel = ReactBootstrap.Panel;
var Button = ReactBootstrap.Button;
var FormGroup = ReactBootstrap.FormGroup;
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl = ReactBootstrap.FormControl;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Modal = ReactBootstrap.Modal;
var Glyphicon = ReactBootstrap.Glyphicon;
var yum = [];

// sets up info needed to do a AJAX request
var handleSearch = function handleSearch(e) {
  e.preventDefault();
  var info = $("#searchForm").serialize();
  var n = info.search("_csrf");
  // slice out the key
  var key = info.slice(n, info.length);

  // create the class using the key
  createSearchList(key);

  // then do a search request using the info
  searchListRenderer.loadRecipesFromAPIfunction(info);
  return false;
};

// makes a copy of the recipe and store in the database
var copyRecipe = function copyRecipe(name, ingredients, notes) {
  // get key value, not safe
  var key = $("#cs")[0].attributes.value.value;
  // data to send
  var data = "name=" + name + "&ingredients=" + ingredients + "&notes=" + notes + "&" + key;
  data = data.replace(/ /g, '+');

  sendAjax('POST', '/maker', data, function () {});

  return false;
};

// begin to render 
var renderList = function renderList() {
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "searchList" },
      React.createElement("h3", { className: "emptySearch" })
    );
  }

  // map out the recipes from the array, currently only about 10
  // need to add functionality to get more 
  var recipeList = this;
  var recipeNodes = this.state.data.map(function (recipe) {
    return React.createElement(
      "div",
      { key: recipe._id, className: "recipe" },
      React.createElement(Recipe, { name: recipe.recipeName, id: recipe.id, ingredients: recipe.ingredients, notes: recipe.rating, url: recipe.imageUrlsBySize[90] })
    );
  });

  return React.createElement(
    "div",
    { className: "recipeSecret" },
    React.createElement("input", {
      type: "hidden",
      id: "cs",
      name: "_csrf",
      value: this.state.csrf
    }),
    React.createElement(
      "div",
      { className: "searchList" },
      React.createElement(
        Row,
        { className: "show-grid" },
        " ",
        recipeNodes,
        " "
      )
    )
  );
};

// renders info from the recipe
// ingredients are given as an array, so must map them out
// button makes a copy of recipe and stores on server
var renderRecipeSearch = function renderRecipeSearch() {
  var _this = this;

  return React.createElement(
    "div",
    null,
    React.createElement(
      Col,
      { sm: 6, md: 4 },
      React.createElement(
        Panel,
        null,
        React.createElement(
          "h3",
          { className: "textName" },
          this.props.name,
          " "
        ),
        React.createElement(
          "div",
          { id: "recipeCont" },
          React.createElement("br", null),
          React.createElement("img", { src: this.props.url, id: "searchImg" }),
          React.createElement(
            "h3",
            { className: "textIngr" },
            "Ingredients:",
            React.createElement("br", null)
          ),
          React.createElement(
            "div",
            { className: "output" },
            this.props.ingredients.map(function (name) {
              return React.createElement(
                "p",
                { key: name._id },
                "- ",
                name
              );
            })
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
            "Rating: ",
            this.props.notes
          ),
          React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf })
        ),
        React.createElement(
          Modal.Footer,
          { id: "listFooter" },
          React.createElement(
            Button,
            { onClick: function onClick() {
                copyRecipe(_this.props.name, _this.props.ingredients, _this.props.notes, _this.props.csrf);
              } },
            React.createElement(Glyphicon, { glyph: "copy" }),
            " "
          )
        )
      )
    )
  );
};

// render the search field, need to add more functionality
// such as specific requirements for allergens and such
var renderSearch = function renderSearch() {
  return React.createElement(
    Panel,
    null,
    React.createElement(
      "form",
      { id: "searchForm",
        onSubmit: this.handleSubmit,
        name: "searchForm",
        action: "/search",
        method: "GET",
        className: "searchForm"
      },
      React.createElement(
        FormGroup,
        { controlId: "formControlsSearch", validationState: this.state.validation, id: "formS" },
        React.createElement(
          ControlLabel,
          null,
          "Search"
        ),
        React.createElement(FormControl, { id: "searchRec", componentClass: "input", name: "searchRec", value: this.state.value, placeholder: this.state.placeholder, onChange: this.handleChange })
      ),
      React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
      React.createElement(
        Button,
        { id: "sBtn", type: "submit" },
        "Submit"
      )
    )
  );
};

// set default props
var defaultRecipeProps = function defaultRecipeProps() {
  return {
    name: '',
    ingredients: '',
    notes: '',
    key: '',
    url: ''
  };
};

// Recipe child of the createSearchList
// and the props we need to render it
var Recipe = React.createClass({
  displayName: "Recipe",

  getDefaultProps: defaultRecipeProps,
  render: renderRecipeSearch,
  propTypes: {
    name: React.PropTypes.string,
    ingredients: React.PropTypes.array,
    notes: React.PropTypes.number,
    key: React.PropTypes.string,
    url: React.PropTypes.string
  }
});

// parent of search list
var createSearchList = function createSearchList(csrf) {
  var SearchList = React.createClass({
    displayName: "SearchList",
    loadRecipesFromAPIfunction: function loadRecipesFromAPIfunction(info) {
      sendAjax('POST', '/search', info, function (data) {
        this.setState({
          data: data.matches
        });
      }.bind(this));
    },
    getInitialState: function getInitialState() {
      return {
        id: '',
        ingredients: '',
        recipeName: '',
        rating: '',
        data: [],
        csrf: csrf
      };
    },
    handleChange: function handleChange(e) {
      this.setState({ value: e.target.value });
    },

    render: renderList
  });

  searchListRenderer = ReactDOM.render(React.createElement(SearchList, { csrf: csrf }), document.querySelector("#searchResults"));
};

var createSearchWindow = function createSearchWindow(csrf) {
  var SearchWindow = React.createClass({
    displayName: "SearchWindow",
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
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#errorMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#errorMessage").animate({ width: 'hide' }, 350);
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
