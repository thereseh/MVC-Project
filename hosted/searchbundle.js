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
var Row = ReactBootstrap.Row;
var Collapse = ReactBootstrap.Collapse;
var Col = ReactBootstrap.Col;
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

  console.log(info);
  // create the class using the key
  createSearchList(key);

  // then do a search request using the info
  searchListRenderer.loadRecipesFromAPIfunction(info);
  return false;
};

var secondsToTime = function secondsToTime(secs) {
  var hours = Math.floor(secs / (60 * 60));

  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);

  var divisor_for_seconds = divisor_for_minutes % 60;
  var seconds = Math.ceil(divisor_for_seconds);

  var obj = {
    "h": hours,
    "m": minutes,
    "s": seconds
  };
  return obj;
};

// makes a copy of the recipe and store in the database
var copyRecipe = function copyRecipe(name, img, ingredients, rating, time, url) {
  // get key value, not safe
  var key = $("#cs")[0].attributes.value.value;
  // data to send

  var U = encodeURIComponent(url);
  var I = encodeURIComponent(img);
  var data = key + "&name=" + name + "&ingredients=" + ingredients + "&site=" + url + "&img=" + img + "&notes=" + rating + "+" + time;
  data = data.replace(/ /g, '+');

  console.log(data);
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
      { key: recipe.id, className: "recipe" },
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
      Panel,
      null,
      React.createElement(
        "h3",
        { className: "textName" },
        this.props.name,
        " "
      ),
      React.createElement("img", { src: this.props.img, id: "searchImg" }),
      React.createElement(
        Button,
        { id: "showSearchBtn", onClick: function onClick() {
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
          Button,
          { onClick: function onClick() {
              copyRecipe(_this.props.name, _this.props.img, _this.props.ingredients, _this.props.rating, _this.props.time, _this.props.url);
            } },
          React.createElement(Glyphicon, { glyph: "copy" }),
          " "
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
        React.createElement(FormControl, { id: "searchRec", componentClass: "input", name: "searchRec", value: this.state.value, placeholder: this.state.placeholder, onChange: this.handleChange }),
        React.createElement(
          DropdownButton,
          { bsStyle: "default", name: "diet", title: "Diets", id: "dietsDropDown" },
          React.createElement(
            "div",
            { id: "dietHolder" },
            React.createElement(
              Checkbox,
              { value: "Pescetarian", name: "diet" },
              "Pescetarian"
            ),
            React.createElement(
              Checkbox,
              { value: "Vegan", name: "diet" },
              "Vegan"
            ),
            React.createElement(
              Checkbox,
              { value: "Vegetarian", name: "diet" },
              "Vegetarian"
            ),
            React.createElement(
              Checkbox,
              { value: "Lacto Vegetarian", name: "diet" },
              "Lacto vegetarian"
            ),
            React.createElement(
              Checkbox,
              { value: "Ovo Vegetarian", name: "diet" },
              "Ovo vegetarian"
            )
          )
        ),
        React.createElement(
          DropdownButton,
          { bsStyle: "default", name: "allergy", title: "Allergies", id: "allergiesDropDown" },
          React.createElement(
            "div",
            { id: "allergyHolder" },
            React.createElement(
              Checkbox,
              { value: "dairy", name: "allergy" },
              "Dairy"
            ),
            React.createElement(
              Checkbox,
              { value: "egg", name: "allergy" },
              "Egg"
            ),
            React.createElement(
              Checkbox,
              { value: "gluten", name: "allergy" },
              "Gluten"
            ),
            React.createElement(
              Checkbox,
              { value: "peanut", name: "allergy" },
              "Peanut"
            ),
            React.createElement(
              Checkbox,
              { value: "seafood", name: "allergy" },
              "Seafood"
            ),
            React.createElement(
              Checkbox,
              { value: "sesame", name: "allergy" },
              "Sesame"
            ),
            React.createElement(
              Checkbox,
              { value: "soy", name: "allergy" },
              "Soy"
            ),
            React.createElement(
              Checkbox,
              { value: "sulfite", name: "allergy" },
              "Sulfite"
            ),
            React.createElement(
              Checkbox,
              { value: "tree nut", name: "allergy" },
              "Tree Nut"
            ),
            React.createElement(
              Checkbox,
              { value: "wheat", name: "allergy" },
              "Wheat"
            )
          )
        ),
        React.createElement(
          DropdownButton,
          { bsStyle: "default", name: "cuisine", title: "Cuisine", id: "cuisineDropDown" },
          React.createElement(
            "div",
            { id: "cuisineHolder" },
            React.createElement(
              Checkbox,
              { value: "American", name: "cuisine" },
              "American"
            ),
            React.createElement(
              Checkbox,
              { value: "Italian", name: "cuisine" },
              "Italian"
            ),
            React.createElement(
              Checkbox,
              { value: "Asian", name: "cuisine" },
              "Asian"
            ),
            React.createElement(
              Checkbox,
              { value: "Mexican", name: "cuisine" },
              "Mexican"
            ),
            React.createElement(
              Checkbox,
              { value: "Southern & Soul Food", name: "cuisine" },
              "Southern & Soul Food"
            ),
            React.createElement(
              Checkbox,
              { value: "French", name: "cuisine" },
              "French"
            ),
            React.createElement(
              Checkbox,
              { value: "Southwestern", name: "cuisine" },
              "Southwestern"
            ),
            React.createElement(
              Checkbox,
              { value: "Barbecue", name: "cuisine" },
              "Barbecue"
            ),
            React.createElement(
              Checkbox,
              { value: "Indian", name: "cuisine" },
              "Indian"
            ),
            React.createElement(
              Checkbox,
              { value: "Chinese", name: "cuisine" },
              "Chinese"
            ),
            React.createElement(
              Checkbox,
              { value: "Cajun & Creole", name: "cuisine" },
              "Cajun & Creole"
            ),
            React.createElement(
              Checkbox,
              { value: "English", name: "cuisine" },
              "English"
            ),
            React.createElement(
              Checkbox,
              { value: "Mediterranean", name: "cuisine" },
              "Mediterranean"
            ),
            React.createElement(
              Checkbox,
              { value: "Greek", name: "cuisine" },
              "Greek"
            ),
            React.createElement(
              Checkbox,
              { value: "Spanish", name: "cuisine" },
              "Spanish"
            ),
            React.createElement(
              Checkbox,
              { value: "German", name: "cuisine" },
              "German"
            ),
            React.createElement(
              Checkbox,
              { value: "Thai", name: "cuisine" },
              "Thai"
            ),
            React.createElement(
              Checkbox,
              { value: "Irish", name: "cuisine" },
              "Irish"
            ),
            React.createElement(
              Checkbox,
              { value: "Japanese", name: "cuisine" },
              "Japanese"
            ),
            React.createElement(
              Checkbox,
              { value: "Cuban", name: "cuisine" },
              "Cuban"
            ),
            React.createElement(
              Checkbox,
              { value: "Hawaiin", name: "cuisine" },
              "Hawaiin"
            ),
            React.createElement(
              Checkbox,
              { value: "Swedish", name: "cuisine" },
              "Swedish"
            ),
            React.createElement(
              Checkbox,
              { value: "Hungarian", name: "cuisine" },
              "Hungarian"
            ),
            React.createElement(
              Checkbox,
              { value: "Portugese", name: "cuisine" },
              "Portugese"
            )
          )
        )
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
        console.dir(data);
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
