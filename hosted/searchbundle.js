"use strict";

var YummlyListClass = void 0;
var SearchYummlyClass = void 0;
var searchRenderer = void 0;
var searchListRenderer = void 0;
var FieldGroup = ReactBootstrap.FieldGroup;
var Panel = ReactBootstrap.Panel;
var Button = ReactBootstrap.Button;
var DropdownButton = ReactBootstrap.DropdownButton;
var Checkbox = ReactBootstrap.Checkbox;
var FormGroup = ReactBootstrap.FormGroup;
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl = ReactBootstrap.FormControl;
var Collapse = ReactBootstrap.Collapse;
var Popover = ReactBootstrap.Popover;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Thumbnail = ReactBootstrap.Thumbnail;
var Modal = ReactBootstrap.Modal;
var Glyphicon = ReactBootstrap.Glyphicon;
var Clearfix = ReactBootstrap.Clearfix;

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
var copyRecipe = function copyRecipe(name, img, ingredients, rating, time, url) {
  // get key value, not safe
  var key = $("#cs")[0].attributes.value.value;
  // data to send
  var R = "Rating: " + rating;
  var T = "Time: " + time;
  var U = encodeURIComponent(url);
  var I = encodeURIComponent(img);
  var data = key + "&name=" + name + "&ingredients=" + ingredients + "&site=" + url + "&img=" + img + "&notes=" + R + "+" + T;
  data = data.replace(/ /g, '+');

  sendAjax('POST', '/maker', data, function () {});

  return false;
};

// Holder to render popup when client copies a recipe
var popoverTop = React.createElement(
  Popover,
  { id: "popover-trigger-click-root-close", title: "Popover top" },
  React.createElement(
    "strong",
    null,
    "Success!"
  ),
  " Recipe can be found in your recipe book."
);

// begin to render 
var renderList = function renderList() {
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "searchList" },
      React.createElement("h3", { className: "emptySearch" })
    );
  }

  // map out the recipes from the array
  var recipeList = this;
  var recipeNodes = this.state.data.map(function (recipe, i) {
    return React.createElement(
      "div",
      { key: i, className: "recipe" },
      React.createElement(Recipe, { name: recipe.name, ingredients: recipe.ingredientLines, rating: recipe.rating, img: recipe.images[0].imageUrlsBySize[360], url: recipe.attribution.url, time: recipe.totalTime })
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
      recipeNodes
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
    { className: "grid-item" },
    React.createElement(
      Thumbnail,
      { src: this.props.img, alt: "", id: "searchImg" },
      React.createElement(
        "h3",
        { className: "textName" },
        this.props.name,
        " "
      ),
      React.createElement(
        Button,
        { id: "showBtn", onClick: function onClick() {
            _this.toggleChildMenu();
          } },
        React.createElement(Glyphicon, { glyph: "chevron-down" }),
        " "
      ),
      React.createElement(
        Collapse,
        { "in": this.state.open },
        React.createElement(
          "div",
          { id: "recipeCont" },
          React.createElement("br", null),
          React.createElement(
            "h3",
            { className: "textIngr" },
            "Ingredients:",
            React.createElement("br", null)
          ),
          React.createElement(
            "div",
            { className: "output" },
            this.props.ingredients.map(function (name, i) {
              return React.createElement(
                "p",
                { key: i },
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
            this.props.rating
          ),
          React.createElement(
            "p",
            { className: "output" },
            "Total Time: ",
            this.props.time
          ),
          React.createElement(
            "p",
            { className: "output" },
            "More info: ",
            React.createElement(
              "a",
              { href: this.props.url, target: "_blank" },
              this.props.url
            )
          ),
          React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf })
        )
      ),
      React.createElement(
        Modal.Footer,
        { id: "listFooter" },
        React.createElement(
          ButtonToolbar,
          null,
          React.createElement(
            OverlayTrigger,
            { container: this, trigger: "click", rootClose: true, placement: "top", overlay: popoverTop },
            React.createElement(
              Button,
              { id: "copyBtn", onClick: function onClick() {
                  copyRecipe(_this.props.name, _this.props.img, _this.props.ingredients, _this.props.rating, _this.props.time, _this.props.url);
                  {
                    _this.toggleChildMenu();
                  }
                } },
              React.createElement(Glyphicon, { glyph: "copy" }),
              " "
            )
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
    rating: '',
    key: '',
    url: '',
    img: '',
    time: ''
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
    rating: React.PropTypes.number,
    key: React.PropTypes.string,
    url: React.PropTypes.string,
    img: React.PropTypes.string,
    time: React.PropTypes.string
  },
  getInitialState: function getInitialState() {
    return {
      open: false
    };
  },
  // toggling to show/hide recipe info
  toggleChildMenu: function toggleChildMenu() {
    this.setState({ open: !this.state.open });
  }
});

// parent of search list
var createSearchList = function createSearchList(csrf) {
  var SearchList = React.createClass({
    displayName: "SearchList",
    loadRecipesFromAPIfunction: function loadRecipesFromAPIfunction(info) {
      sendAjax('POST', '/search', info, function (data) {
        this.setState({
          data: data
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
      this.setState({ showModal: false });
      handleSearch(e);
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
