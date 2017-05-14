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
var SplitButton = ReactBootstrap.SplitButton;
var MenuItem = ReactBootstrap.MenuItem;
var DropdownButton = ReactBootstrap.DropdownButton;

// loads recipes and categories from database
var handleRecipe = function handleRecipe() {
  sendAjax('POST', $("#modalRenderer").attr("action"), $("#modalRenderer").serialize(), function () {
    recipeRenderer.loadRecipesFromServer();
    recipeRenderer.loadCategoriesFromServer();
    modalRenderer.loadCategoriesFromServer();
  });

  return false;
};

/* Removes a recipe from the database */
var removeRecipe = function removeRecipe(id) {
  // get key value, not safe
  var key = $("#cs")[0].attributes.value.value;
  // data to send
  var data = "id=" + id + "&_csrf=" + key;
  data = data.replace(/ /g, '+');
  sendAjax('DELETE', '/removeRecipe', data, function () {
    recipeRenderer.loadRecipesFromServer();
  });

  return false;
};

var returnKey = function returnKey() {
  return $("#cs")[0].attributes.value.value;
};

var returnData = function returnData(name, ingredients, notes, category, id) {
  var data = {
    name: name,
    category: category,
    ingredients: ingredients,
    notes: notes,
    id: id
  };
  return data;
};

// puts together data needed to do a request for recipes
// of a certain category
var getSorted = function getSorted(category) {
  if (category === "all") {
    recipeRenderer.loadRecipesFromServer();
  } else {
    var key = $("#cs")[0].attributes.value.value;
    var data = "category=" + category + "&_csrf=" + key;
    recipeRenderer.sortedCategoriesFromServer(data);
    recipeRenderer.loadCategoriesFromServer();
  }
};

// puts together data needed to do a put request to update recipe
var editRecipe = function editRecipe(id) {
  var data = "id=" + id + "&" + $("#modalRenderer").serialize();
  sendAjax('PUT', $("#modalRenderer").attr("action"), data, function () {
    recipeRenderer.loadRecipesFromServer();
    recipeRenderer.loadCategoriesFromServer();
    modalRenderer.loadCategoriesFromServer();
  });
  return false;
};

// renders modal for adding a recipe
var renderModal = function renderModal() {
  var _React$createElement, _React$createElement2;

  var recipeList = this;
  // first populate the category dropdown with categries from array in states
  var cateNodes = this.state.data.map(function (category, i) {
    return React.createElement(
      MenuItem,
      { key: i, eventKey: category._id, value: category, onClick: function onClick() {
          recipeList.toggleChildMenu(category);
        } },
      category
    );
  });

  // render modal with form for submit
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
          action: this.state.action,
          method: this.state.method,
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
            DropdownButton,
            { bsStyle: "default", title: "Categories", id: "catDropDown" },
            cateNodes
          ),
          React.createElement(
            FormGroup,
            { controlId: "formControlsName", id: "formName", validationState: this.state.validation },
            React.createElement(
              ControlLabel,
              null,
              "Name"
            ),
            React.createElement(FormControl, { id: "recipeName", componentClass: "input", name: "name", value: this.state.name, placeholder: this.state.placeholder, onChange: this.handleChangeName }),
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
            React.createElement(FormControl, { id: "categoryName", componentClass: "input", name: "category",
              value: this.state.category,
              onChange: this.handleChangeCat,
              placeholder: "Category..." })
          ),
          React.createElement(
            FormGroup,
            { controlId: "formControlsIngredients" },
            React.createElement(
              ControlLabel,
              null,
              "Ingredients"
            ),
            React.createElement(FormControl, (_React$createElement = { id: "ingred", componentClass: "textarea" }, _defineProperty(_React$createElement, "id", "recipeIngr"), _defineProperty(_React$createElement, "value", this.state.ingredients), _defineProperty(_React$createElement, "onChange", this.handleChangeIngr), _defineProperty(_React$createElement, "name", "ingredients"), _defineProperty(_React$createElement, "placeholder", "Ingredients..."), _React$createElement))
          ),
          React.createElement(
            FormGroup,
            { controlId: "formControlsNotes" },
            React.createElement(
              ControlLabel,
              null,
              "Notes"
            ),
            React.createElement(FormControl, (_React$createElement2 = { id: "notes", componentClass: "textarea" }, _defineProperty(_React$createElement2, "id", "recipeNotes"), _defineProperty(_React$createElement2, "value", this.state.notes), _defineProperty(_React$createElement2, "onChange", this.handleChangeNotes), _defineProperty(_React$createElement2, "name", "notes"), _defineProperty(_React$createElement2, "placeholder", "Notes/Instructions..."), _React$createElement2))
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

// renders the child list of recipes retrieved from database using props from parent
var renderRecipe = function renderRecipe() {
  var _this = this;

  var recipeList = this;
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
      React.createElement(
        Button,
        { id: "showBtn", onClick: function onClick() {
            recipeList.toggleChildMenu();
          } },
        React.createElement(Glyphicon, { glyph: "chevron-down" }),
        " "
      ),
      this.hasImage(),
      React.createElement(
        Collapse,
        { "in": recipeList.state.open },
        React.createElement(
          "div",
          { id: "recipeCont" },
          React.createElement(
            "h3",
            { className: "textIngr" },
            "Category:",
            React.createElement("br", null)
          ),
          React.createElement(
            "p",
            { className: "output" },
            this.props.category
          ),
          React.createElement(
            "h3",
            { className: "textIngr" },
            "Ingredients:",
            React.createElement("br", null)
          ),
          this.state.noteLines.map(function (name, i) {
            return React.createElement(
              "p",
              { key: i },
              "- ",
              name
            );
          }),
          React.createElement(
            "h3",
            { className: "textNotes" },
            "Notes:",
            React.createElement("br", null)
          ),
          React.createElement(
            "p",
            { className: "output" },
            this.hasURL()
          ),
          React.createElement(
            Modal.Footer,
            { id: "listFooter" },
            React.createElement(
              Button,
              { id: "editbtn", onClick: function onClick() {
                  createModal(returnKey(), '/editRecipe', 'PUT', returnData(_this.props.name, _this.props.ingredients, _this.props.notes, _this.props.category, _this.props.id));
                } },
              " Edit"
            ),
            React.createElement(
              Button,
              { onClick: function onClick() {
                  removeRecipe(_this.props.id);
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

/* ====== RENDERS THE LIST OF CHILD RECIPES ======= */
// renders instances of recipes
var renderRecipeList = function renderRecipeList() {
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "recipeList" },
      React.createElement(
        "h3",
        { className: "emptyRecipe" },
        "No recipes yet"
      )
    );
  }

  var recipeList = this;
  var cate2Nodes = this.state.cate.map(function (category, i) {
    return React.createElement(
      MenuItem,
      { key: i, eventKey: category._id, value: category, onClick: function onClick() {
          getSorted(category);
        } },
      category
    );
  });
  var recipeNodes = this.state.data.map(function (recipe, i) {
    return React.createElement(
      "div",
      { key: i, className: "recipe" },
      React.createElement(Recipe, { name: recipe.name, category: recipe.category, ingredients: recipe.ingredients, notes: recipe.notes, id: recipe._id, img: recipe.image, site: recipe.website, key: i })
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
      DropdownButton,
      { bsStyle: "default", title: "Sort by Categories", id: "sortDropDown" },
      React.createElement(
        MenuItem,
        { eventKey: 0, value: "all", onClick: function onClick() {
            getSorted('all');
          } },
        "All"
      ),
      cate2Nodes
    ),
    React.createElement(
      "div",
      { className: "searchList" },
      recipeNodes
    )
  );
};

/* ====== CREATES THE MODAL ======= */
var createModal = function createModal(csrf, action, method, data) {
  AddNewRecipeClass = React.createClass({
    displayName: "AddNewRecipeClass",
    getInitialState: function getInitialState() {
      return {
        showModal: true,
        validation: '',
        placeholder: 'Name of recipe...',
        data: [],
        category: data.category,
        name: data.name,
        ingredients: data.ingredients,
        notes: data.notes,
        action: action,
        method: method,
        id: data.id
      };
    },

    // calls the database to retrieve categories
    loadCategoriesFromServer: function loadCategoriesFromServer() {
      sendAjax('GET', '/getCategories', null, function (data) {
        console.log('modal:');
        console.dir(data);
        this.setState({
          data: data.categories
        });
      }.bind(this));
    },
    // if you are trying to submit and there is no name, change state of input to error
    handleSubmit: function handleSubmit(e) {
      e.preventDefault();
      var length = this.state.name.length;
      if (length === 0) {
        this.setState({ validation: 'error' });
        this.setState({ placeholder: 'Please, give me a name!' });
      } else {
        this.setState({ showModal: false });
        if (this.state.method === 'POST') {
          handleRecipe();
        } else {
          editRecipe(this.state.id);
        }
      }
    },

    // when typing into the name field
    handleChangeName: function handleChangeName(e) {
      this.setState({ name: e.target.value });
    },
    handleChangeNotes: function handleChangeNotes(e) {
      this.setState({ notes: e.target.value });
    },
    handleChangeIngr: function handleChangeIngr(e) {
      this.setState({ ingredients: e.target.value });
    },

    // when typing into the category field
    handleChangeCat: function handleChangeCat(e) {
      this.setState({ category: e.target.value });
    },
    close: function close() {
      this.setState({ showModal: false });
    },

    // if choosing category from the dropdown
    toggleChildMenu: function toggleChildMenu(value) {
      this.setState({ category: value });
    },

    componentDidMount: function componentDidMount() {
      this.loadCategoriesFromServer();
    },
    render: renderModal
  });
  modalRenderer = ReactDOM.render(React.createElement(AddNewRecipeClass, { csrf: csrf }), document.querySelector("#content"));
};

/* ====== CHILD RECIPE CLASS ======= */
var defaultRecipeProps = function defaultRecipeProps() {
  return {
    open: false,
    name: '',
    category: '',
    ingredients: '',
    notes: '',
    id: '',
    img: 'no img',
    site: ''
  };
};

var Recipe = React.createClass({
  displayName: "Recipe",

  getDefaultProps: defaultRecipeProps,
  render: renderRecipe,
  propTypes: {
    name: React.PropTypes.string,
    category: React.PropTypes.string,
    ingredients: React.PropTypes.string,
    notes: React.PropTypes.string,
    id: React.PropTypes.string,
    site: React.PropTypes.string,
    img: React.PropTypes.string
  },
  getInitialState: function getInitialState() {
    return {
      open: false,
      noteLines: []
    };
  },
  hasImage: function hasImage() {
    if (this.props.img != "") {
      return React.createElement("img", { src: this.props.img, id: "searchImg" });
    }
  },
  hasURL: function hasURL() {
    if (this.props.site != "") {
      return React.createElement(
        "p",
        { className: "output" },
        "More info: ",
        React.createElement(
          "a",
          { href: this.props.site, target: "_blank" },
          this.props.site
        )
      );
    }
  },
  parseText: function parseText() {
    var lines = [];
    console.dir(this.props.ingredients);
    var split = this.props.ingredients.split(/[\n,]/);
    for (var i = 0; i < split.length; i++) {
      if (split[i]) lines.push(split[i].trim());
    }
    console.log(lines);
    this.setState({ noteLines: lines });
  },

  // toggling to show/hide recipe info
  toggleChildMenu: function toggleChildMenu() {
    this.setState({ open: !this.state.open });
  },

  componentDidMount: function componentDidMount() {
    this.parseText();
  }
});

// set up basics
var setup = function setup(csrf) {
  var addRecipeButton = document.querySelector("#addRecipe");

  var data = {
    name: '',
    category: '',
    notes: '',
    ingredients: '',
    id: ''
  };
  addRecipeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createModal(csrf, '/maker', 'POST', data);
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
    // loads all (unique) categories from the server
    loadCategoriesFromServer: function loadCategoriesFromServer() {
      sendAjax('GET', '/getCategories', null, function (data) {
        this.setState({
          cate: data.categories
        });
      }.bind(this));
    },
    // get recipes of specific category
    sortedCategoriesFromServer: function sortedCategoriesFromServer(info) {
      sendAjax('PUT', '/getSorted', info, function (data) {
        this.setState({
          data: data.recipes
        });
      }.bind(this));
    },
    getInitialState: function getInitialState() {
      return {
        data: [],
        cate: [],
        open: false
      };
    },
    componentDidMount: function componentDidMount() {
      this.loadCategoriesFromServer();
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
