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


// loads recipes and categories from database
const handleRecipe = (e) => {
  sendAjax('POST', $("#modalRenderer").attr("action"), $("#modalRenderer").serialize(), function () {    
    recipeRenderer.loadRecipesFromServer();
    modalRenderer.loadCategoriesFromServer();
  });

  return false;
};

/* Removes a recipe from the database */
const removeRecipe = (name, ingr, notes, cat) => {
  // get key value, not safe
  let key = $("#cs")[0].attributes.value.value;
  // data to send
  let data = `name=${name}&ingr=${ingr}&notes=${notes}&category=${cat}&_csrf=${key}`;
  data = data.replace(/ /g, '+');
  sendAjax('DELETE', '/removeRecipe', data, function () {
    recipeRenderer.loadRecipesFromServer();
  });

  return false;
};

// renders modal for adding a recipe
const renderModal = function () {
   const recipeList = this;
  // first populate the category dropdown with categries from array in states
   const cateNodes = this.state.data.map(function (category) {
    return (
      <MenuItem key={category._id} eventKey={category._id} value={category.category} onClick={ ()=> {recipeList.toggleChildMenu(category.category)}}>{category.category}</MenuItem>
    );
  });
  
// render modal with form for submit
  return (
    <div>
        <Modal show={this.state.showModal} onHide={this.close}>
        <form id="modalRenderer"
        onSubmit={this.handleSubmit}
        name="modalRenderer"
        action="/maker"
        method="POST"
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
            <FormControl id="recipeName" componentClass="input" name="name" value={this.state.value} placeholder={this.state.placeholder} onChange={this.handleChange}/>
            <FormControl.Feedback />
            </FormGroup>
            
            <FormGroup controlId="formControlsCategory">
            <ControlLabel>Category</ControlLabel>
            <FormControl id="categoryName" componentClass="input" name="category"
            value={this.state.cat}
            onChange={this.handleCatChange}
            placeholder="Category..."/>
            </FormGroup>
            
            <FormGroup controlId="formControlsIngredients">
            <ControlLabel>Ingredients</ControlLabel>
            <FormControl id="ingred" componentClass="textarea" id="recipeIngr" name="ingr" placeholder="Ingredients..." />
            </FormGroup>
            
            <FormGroup controlId="formControlsNotes">
            <ControlLabel>Notes</ControlLabel>
            <FormControl id="notes" componentClass="textarea" id="recipeNotes" name="notes"  placeholder="Notes/Instructions..." />
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
    const recipeList = this;
  return (
      <Col sm={6}md={4}>
      <Well>
        <h3 className="textName" >{this.props.name} </h3>
        <Button id="showBtn"onClick={ ()=> {recipeList.toggleChildMenu()}}><Glyphicon glyph="chevron-down"/> </Button>
        <Collapse in={recipeList.state.open}>
        <div id="recipeCont">
        <h3 className="textIngr">Ingredients:
          <br /></h3><p className="output">{this.props.ingredients}</p> 
        <h3 className="textNotes" >Notes: 
          <br /></h3><p className="output">{this.props.notes}</p>
        <Modal.Footer id="listFooter">
        <Button onClick = {
          () => { 
            removeRecipe(this.props.name, this.props.ingredients, this.props.notes, this.props.category)
          }}><Glyphicon glyph = "trash"/> </Button>
              </Modal.Footer>
          </div>
       </Collapse>
      </Well> 
      </Col> 
  )
};

// renders instances of recipes
const renderRecipeList = function () {
  if (this.state.data.length === 0) {
    return ( 
      <div className="recipeList">
        <h3 className="emptyRecipe"> No recipes yet</h3> 
      </div>
    );
  }

  const recipeList = this;
  const recipeNodes = this.state.data.map(function (recipe) {
    return (
      <div key={recipe._id} className="recipe" >
      <Recipe name={recipe.name} category={recipe.category} ingredients={recipe.ingredients} notes={recipe.notes}/>
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
      <Row className="show-grid" > {recipeNodes} </Row> 
      </div>
  );
};

const createModal = function(csrf) {
  AddNewRecipeClass = React.createClass({
    getInitialState() {
    return { 
      showModal: true,
      value: '',
      validation: '',
      placeholder: 'Name of recipe...',
      data: [],
      cat: '',
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
      const length = this.state.value.length;
      if (length === 0) {
        this.setState({ validation: 'error' });
        this.setState({ placeholder: 'Please, give me a name!' });
      }
      else {
         this.setState({ showModal: false });
        handleRecipe(e);
      }
    },
    // when typing into the name field
     handleChange(e) {
    this.setState({ value: e.target.value });
  },
    // when typing into the category field
    handleCatChange(e) {
    this.setState({ cat: e.target.value });
  },
    close() {
    this.setState({ showModal: false });
  },
    // if choosing category from the dropdown
    toggleChildMenu(value) {
      this.setState({cat: value});
    },
    componentDidMount: function () {
      this.loadCategoriesFromServer();
    },
    render: renderModal
  });
  modalRenderer = ReactDOM.render(
    <AddNewRecipeClass csrf = {csrf}/>, document.querySelector("#content")
  );
};

const defaultRecipeProps = () => {
  return {
    open: false,
    name: '',
    category: '',
    ingredients: '',
    notes: '',
  }
};


const Recipe = React.createClass({
  getDefaultProps: defaultRecipeProps,
  render: renderRecipe,
  propTypes: {
    name: React.PropTypes.string.isRequired,
    category: React.PropTypes.string.isRequired,
    ingredients: React.PropTypes.string.isRequired,
    notes: React.PropTypes.string.isRequired,
  },
  getInitialState: function () {
      return {
        open: false,
      };
    },
  // toggling to show/hide recipe info
   toggleChildMenu() {
      this.setState({open: !this.state.open});
    },
});

// set up basics
const setup = function (csrf) {
   const addRecipeButton = document.querySelector("#addRecipe");
  
   addRecipeButton.addEventListener("click", (e) => {
      e.preventDefault(); 
      createModal(csrf);
      return false;
   });

  RecipeListClass = React.createClass({
    loadRecipesFromServer: function () {
      sendAjax('GET', '/getRecipes', null, function (data) {
        this.setState({
          data: data.recipes,
        });
      }.bind(this));
    },
    getInitialState: function () {
      return {
        data: [],
        open: false,
      };
    },
    componentDidMount: function () {
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