let recipeRenderer;
let modalRenderer;
let recipeForm;
let RecipeFormClass;
let RecipeListClass;
let AddNewRecipeClass;
let Collapse = ReactBootstrap.Collapse;
let Button = ReactBootstrap.Button;
let Well = ReactBootstrap.Well;
let Col = ReactBootstrap.Col;
let Row = ReactBootstrap.Row;
let Glyphicon = ReactBootstrap.Glyphicon;
let FormGroup = ReactBootstrap.FormGroup;
let ControlLabel = ReactBootstrap.ControlLabel;
let FormControl = ReactBootstrap.FormControl;
let Panel = ReactBootstrap.Panel;
let Modal = ReactBootstrap.Modal;
let SplitButton = ReactBootstrap.SplitButton;
let MenuItem = ReactBootstrap.MenuItem;
let DropdownButton = ReactBootstrap.DropdownButton;
let Thumbnail = ReactBootstrap.Thumbnail;


// adds a recipe to the database, one callback, updates the page by
// loading all recipes and categories.
const handleRecipe = () => {
  sendAjax('POST', $("#modalRenderer").attr("action"), $("#modalRenderer").serialize(), function () {    
    recipeRenderer.loadRecipesFromServer();
    recipeRenderer.loadCategoriesFromServer();
    modalRenderer.loadCategoriesFromServer();
  });

  return false;
};

const returnKey = () => {
  return $("#cs")[0].attributes.value.value;
};


// Removes a recipe from the database
const removeRecipe = (id) => {
  // get key value
  let key = returnKey();
  // data to send
  let data = `id=${id}&_csrf=${key}`;
  // clean it up
  data = data.replace(/ /g, '+');
  // deletes the recipe, reload recipes and categories from server
  sendAjax('DELETE', '/removeRecipe', data, function () {
    recipeRenderer.loadRecipesFromServer();
    recipeRenderer.loadCategoriesFromServer();
  });

  return false;
};

// parse info and return object
const returnData = (name, ingredients, notes, category, id) => {
  let data = {
    name: name,
    category: category,
    ingredients: ingredients,
    notes: notes,
    id: id
  };
  return data;
};

// puts together data needed to do a request for recipes of a certain category from dropdown
const getSorted = (category) =>  {
  if (category === "all") {
    recipeRenderer.loadRecipesFromServer();
  } else {
    let key = returnKey();
    let data = `category=${category}&_csrf=${key}`;
    recipeRenderer.sortedCategoriesFromServer(data);
    recipeRenderer.loadCategoriesFromServer();
  }
};

// puts together data needed to do a put request to update recipe
const editRecipe = (id) => {
  let data = `id=${id}&` + $("#modalRenderer").serialize();
  sendAjax('PUT', $("#modalRenderer").attr("action"), data, function () {    
    recipeRenderer.loadRecipesFromServer();
    recipeRenderer.loadCategoriesFromServer();
    modalRenderer.loadCategoriesFromServer();
  });
  return false;
};

// renders modal for adding a recipe
const renderModal = function () {
   const recipeList = this;
  // first populate the category dropdown with categries from array in states
   const cateNodes = this.state.data.map(function (category, i) {
    return (
      <MenuItem key={i} eventKey={category._id} value={category} onClick={ ()=> {recipeList.toggleChildMenu(category)}}>{category}</MenuItem>
    );
  });
  
// render modal with form for submit
  return (
    <div>
        <Modal show={this.state.showModal} onHide={this.close}>
        <form id="modalRenderer"
        onSubmit={this.handleSubmit}
        name="modalRenderer"
        action={this.state.action}
        method={this.state.method}
        className="modalRenderer"
      >
          <Modal.Header closeButton>
          <Modal.Title>Add Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DropdownButton bsStyle="default" title="Categories" id="catDropDown">
          {cateNodes}
          </DropdownButton>
           <FormGroup controlId="formControlsName" id="formName"  validationState={this.state.validation}>
    
            <ControlLabel>Name</ControlLabel>
            <FormControl id="recipeName" componentClass="input" name="name" value={this.state.name} placeholder={this.state.placeholder} onChange={this.handleChangeName}/>
            <FormControl.Feedback />
            </FormGroup>
            
            <FormGroup controlId="formControlsCategory">
            <ControlLabel>Category</ControlLabel>
            <FormControl id="categoryName" componentClass="input" name="category"
            value={this.state.category}
            onChange={this.handleChangeCat}
            placeholder="Category..."/>
            </FormGroup>
            
            <FormGroup controlId="formControlsIngredients">
            <ControlLabel>Ingredients</ControlLabel>
            <FormControl id="ingred" componentClass="textarea" id="recipeIngr" value={this.state.ingredients} onChange={this.handleChangeIngr} name="ingredients" placeholder="Ingredients..." />
            </FormGroup>
            
            <FormGroup controlId="formControlsNotes">
            <ControlLabel>Notes</ControlLabel>
            <FormControl id="notes" componentClass="textarea" id="recipeNotes" value={this.state.notes} onChange={this.handleChangeNotes} name="notes"  placeholder="Notes/Instructions..." />
            </FormGroup>
            <input type="hidden" name="_csrf" value={this.props.csrf} />
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">
              Submit
            </Button>
          </Modal.Footer>
          </form>
        </Modal>
      </div>
  );
};

// renders the child list of recipes retrieved from database using props from parent
const renderRecipe = function() {
  return (
    <div className="grid-item">
     <Thumbnail src={ this.hasImage() } alt="" id="searchImg">
       <h3 className="textName">{this.props.name} </h3>
        <Button id="showBtn"onClick={ ()=> {this.toggleChildMenu()}}><Glyphicon glyph="chevron-down"/> </Button>
        <Collapse in={this.state.open}>
        <div id="recipeCont">
          <h3 className="textIngr">Category:
          <br /></h3><p className="output">{this.props.category}</p> 
        <h3 className="textIngr">Ingredients:
          <br /></h3>
          {
            this.props.ingredients.map(function(name, i) {
              return <p key={i}>- {name}</p>;
            })
          }
        <h3 className="textNotes" >Notes: 
          <br /></h3><p className="output">
         {
            this.props.notes.map(function(name, i) {
              return <p key={i}>{name}</p>;
            })
          }
          { this.hasURL() }
           </p> 
        <Modal.Footer id="listFooter">
           <Button id="editbtn" onClick = {
          () => {
            if (this.state.open) {
            {this.toggleChildMenu()}
            }
            createModal(returnKey(), '/editRecipe', 'PUT', returnData(this.props.name, this.props.ingredients, this.props.notes, this.props.category, this.props.id))
            {this.parseText()}
          }}> Edit
            </Button>
        <Button onClick = {
          () => { 
            if (this.state.open) {
            {this.toggleChildMenu()}
            }
            removeRecipe(this.props.id)
          }}><Glyphicon glyph = "trash"/> </Button>
        </Modal.Footer>
          </div>
       </Collapse>
      </Thumbnail>
     </div>
  )
};

/* ====== RENDERS THE LIST OF CHILD RECIPES ======= */
// renders instances of recipes
const renderRecipeList = function () {
  if (this.state.data.length === 0) {
    return ( 
      <div className="recipeList">
        <h3 className="emptyRecipe">No recipes yet</h3> 
      </div>
    );
  }

  const recipeList = this;
  // get anther dropdown used for sorting recipes by category
   const cate2Nodes = this.state.cate.map(function (category, i) {
    return (
      <MenuItem key={i} eventKey={category._id} value={category} onClick={ ()=> {getSorted(category)}}>{category}</MenuItem>
    );
  });
  // create instances of recipe child class
  const recipeNodes = this.state.data.map(function (recipe, i) {
    return (
      <div key={i} className="recipe">
      <Recipe name={recipe.name} category={recipe.category} ingredients={recipe.ingredients} notes={recipe.notes} id={recipe._id} img={recipe.image} site={recipe.website} key={i}/>
      </div>
    );
  });

  return ( 
    <div className="recipeList" >
    <input 
      type = "hidden"
      id = "cs"
      name = "_csrf"
      value = {this.props.csrf}
    /> 
       <div className="sortD">
       <DropdownButton bsStyle="default" title="Sort by Categories" id="sortDropDown">
        <MenuItem eventKey={0} value='all' onClick={ ()=> {getSorted('all')}}>All</MenuItem>
          {cate2Nodes}
      </DropdownButton>
      </div>
         <div className="searchList" >
          {recipeNodes}
      </div>
      </div> 
  );
};


/* ====== CREATE THE MODAL CLASS ======= */
const createModal = function(csrf, action, method, data) {
  AddNewRecipeClass = React.createClass({
    getInitialState() {
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
    loadCategoriesFromServer: function () {
      sendAjax('GET', '/getCategories', null, function (data) {
        this.setState({
          data: data.categories,
        });
      }.bind(this));
    },
    // if you are trying to submit and there is no name, change state of input to error
    handleSubmit(e) {
      e.preventDefault();
      const length = this.state.name.length;
      if (length === 0) {
        this.setState({ validation: 'error' });
        this.setState({ placeholder: 'Please, give me a name!' });
      }
      else {
         this.setState({ showModal: false }); 
        if (this.state.method === 'POST') {
          handleRecipe();
        } else {
          editRecipe(this.state.id);
        }
      }
    },
    // when typing into the name field
     handleChangeName(e) {
        this.setState({ name: e.target.value });
     },
    // to set notes
     handleChangeNotes(e) {
        this.setState({ notes: e.target.value });
     },
    // to set ingredients
     handleChangeIngr(e) {
        this.setState({ ingredients: e.target.value });
     },
    // when typing into the category field
    handleChangeCat(e) {
    this.setState({ category: e.target.value });
  },
    close() {
    this.setState({ showModal: false });
  },
    // if choosing category from the dropdown
    toggleChildMenu(value) {
      this.setState({category: value});
    },
    // load categories to dropdown when created
    componentDidMount: function () {
      this.loadCategoriesFromServer();
    },
    render: renderModal
  });
  modalRenderer = ReactDOM.render(
    <AddNewRecipeClass csrf = {csrf}/>, document.querySelector("#content")
  );
};


/* ====== CHILD RECIPE CLASS ======= */
const defaultRecipeProps = function () {
  return {
    open: false,
    name: '',
    category: '',
    ingredients: '',
    notes: '',
    id: '',
    img: 'no img',
    site: ''
  }
};

const Recipe = React.createClass({
  getDefaultProps: defaultRecipeProps,
  render: renderRecipe,
  propTypes: {
    name: React.PropTypes.string,
    category: React.PropTypes.string,
    ingredients: React.PropTypes.array,
    notes: React.PropTypes.array,
    id: React.PropTypes.string,
    site: React.PropTypes.string,
    img: React.PropTypes.string,
  },
  getInitialState: function () {
      return {
        open: false,
        noteLines: [],
        ingrLines: [],
      };
    },
  // check if certain information exist
  // if so, either return it or render it!
  hasImage(){
    if (this.props.img != "") {
      return this.props.img;
    }
  },
  hasURL(){
    if (this.props.site != "") {
      return (
        <p className="output">More info: <a href={this.props.site} target="_blank">
          {this.props.site}</a></p>
      );
    }
  },
  // toggling to show/hide recipe info
   toggleChildMenu() {
      this.setState({open: !this.state.open});
    },
});

// set up basics
const setup = function (csrf) {
   const addRecipeButton = document.querySelector("#addRecipe");
  
  let data = {
    name: '',
    category: '',
    notes: '',
    ingredients: '',
    id: ''
  };
   addRecipeButton.addEventListener("click", (e) => {
      e.preventDefault(); 
      createModal(csrf, '/maker', 'POST', data);
      return false;
   });

  // parent class for recipes, will create them and display them
  RecipeListClass = React.createClass({
    // load recipes from database
    loadRecipesFromServer: function () {
      sendAjax('GET', '/getRecipes', null, function (data) {        
        // parse info into arrays for better display
        let lines1 = [];
        let lines2 = [];
        
        for(let i = 0; i < data.recipes.length; i++) {
           // for ingr
          let split = data.recipes[i].ingredients.split(/[\n,]/);
          for (let i = 0; i < split.length; i++) {
            if (split[i]) lines1.push(split[i].trim());
          }
          // for notes
          split = data.recipes[i].notes.split('\n');
          for (let i = 0; i < split.length; i++) {
            if (split[i]) lines2.push(split[i].trim());
          }
          
          data.recipes[i].ingredients = lines1;
          data.recipes[i].notes = lines2;
          lines1 = [];
          lines2 = [];
        }
        
        this.setState({
          data: data.recipes,
        });
      }.bind(this));
    },
    // loads all (unique) categories from the server
    loadCategoriesFromServer: function () {
      sendAjax('GET', '/getCategories', null, function (data) {
        this.setState({
          cate: data.categories,
        });
      }.bind(this));
    },
    // get recipes of specific category
    sortedCategoriesFromServer: function (info) {
      sendAjax('PUT', '/getSorted', info, function (data) {
        this.setState({
          data: data.recipes,
        });
      }.bind(this));
    },
    getInitialState: function () {
      return {
        data: [],
        cate: [],
        open: false,
      };
    },
    componentDidMount: function () {
      this.loadCategoriesFromServer();
      this.loadRecipesFromServer();
    },
    render: renderRecipeList
  });


  recipeRenderer = ReactDOM.render(
    <RecipeListClass csrf={csrf}/>, document.querySelector("#recipes")
  );
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});