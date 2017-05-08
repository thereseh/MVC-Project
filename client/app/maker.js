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
const handleRecipe = () => {
  
  sendAjax('POST', $("#modalRenderer").attr("action"), $("#modalRenderer").serialize(), function () {    
    recipeRenderer.loadRecipesFromServer();
    modalRenderer.loadCategoriesFromServer();
    recipeRenderer.loadCategoriesFromServer();
  });

  return false;
};


/* Removes a recipe from the database */
const removeRecipe = (id) => {
  // get key value, not safe
  let key = $("#cs")[0].attributes.value.value;
  // data to send
  let data = `id=${id}&_csrf=${key}`;
  data = data.replace(/ /g, '+');
  sendAjax('DELETE', '/removeRecipe', data, function () {
    recipeRenderer.loadRecipesFromServer();
  });

  return false;
};


const returnKey = () => {
  return $("#cs")[0].attributes.value.value;
};
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

const getSorted = (category) =>  {
  if (category === "all") {
    recipeRenderer.loadRecipesFromServer();
  } else {
    let key = $("#cs")[0].attributes.value.value;
    let data = `category=${category}&_csrf=${key}`;
  
    recipeRenderer.sortedCategoriesFromServer(data);
    recipeRenderer.loadCategoriesFromServer();
  }
};

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
   const cateNodes = this.state.data.map(function (category) {
    return (
      <MenuItem key={category._id} eventKey={category._id} value={category} onClick={ ()=> {recipeList.toggleChildMenu(category)}}>{category}</MenuItem>
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
  const recipeList = this;
  return (
    <div className="grid-item">
     <Panel>
        <h3 className="textName" >{this.props.name} </h3>
        
        <Button id="showBtn"onClick={ ()=> {recipeList.toggleChildMenu()}}><Glyphicon glyph="chevron-down"/> </Button>
        { this.hasImage() }
        <Collapse in={recipeList.state.open}>
        <div id="recipeCont">
          <h3 className="textIngr">Category:
          <br /></h3><p className="output">{this.props.category}</p> 
        <h3 className="textIngr">Ingredients:
          <br /></h3><p className="output">{this.props.ingredients}</p> 
        <h3 className="textNotes" >Notes: 
          <br /></h3><p className="output">{this.props.notes}</p>
          { this.hasURL() }
        <Modal.Footer id="listFooter">
           <Button id="editbtn" onClick = {
          () => { 
            createModal(returnKey(), '/editRecipe', 'PUT', returnData(this.props.name, this.props.ingredients, this.props.notes, this.props.category, this.props.id))}}> Edit
            </Button>
        <Button onClick = {
          () => { 
            removeRecipe(this.props.id)
          }}><Glyphicon glyph = "trash"/> </Button>
        </Modal.Footer>
          </div>
       </Collapse>
       </Panel>
     </div>
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
   const cate2Nodes = this.state.cate.map(function (category) {
    return (
      <MenuItem key={category._id} eventKey={category._id} value={category} onClick={ ()=> {getSorted(category)}}>{category}</MenuItem>
    );
  });
  const recipeNodes = this.state.data.map(function (recipe) {
    return (
      <div key={recipe._id} className="recipe">
      <Recipe name={recipe.name} category={recipe.category} ingredients={recipe.ingredients} notes={recipe.notes} id={recipe._id} img={recipe.image} site={recipe.website} />
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
       <DropdownButton bsStyle="default" title="Categories" id="sortDropDown">
        <MenuItem eventKey={0} value='all' onClick={ ()=> {getSorted('all')}}>All</MenuItem>
          {cate2Nodes}
      </DropdownButton>
         <div className="searchList" >
          {recipeNodes}
      </div>
      </div> 
  );
};

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
        console.log('modal:')
        console.dir(data);
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
     handleChangeNotes(e) {
        this.setState({ notes: e.target.value });
     },
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
    componentDidMount: function () {
      this.loadCategoriesFromServer();
    },
    render: renderModal
  });
  modalRenderer = ReactDOM.render(
    <AddNewRecipeClass csrf = {csrf}/>, document.querySelector("#content")
  );
};

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
    ingredients: React.PropTypes.string,
    notes: React.PropTypes.string,
    id: React.PropTypes.string,
    site: React.PropTypes.string,
    img: React.PropTypes.string,
  },
  getInitialState: function () {
      return {
        open: false,
      };
    },
  hasImage(){
    if (this.props.img != "") {
      return (
        <img src={this.props.img} id="searchImg"/>
      );
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

  RecipeListClass = React.createClass({
    loadRecipesFromServer: function () {
      sendAjax('GET', '/getRecipes', null, function (data) {
        console.dir(data);
        this.setState({
          data: data.recipes,
        });
      }.bind(this));
    },
    loadCategoriesFromServer: function () {
      sendAjax('GET', '/getCategories', null, function (data) {
        console.log('list:')
        console.dir(data);
        this.setState({
          cate: data.categories,
        });
      }.bind(this));
    },
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