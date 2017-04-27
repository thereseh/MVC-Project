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


const handleRecipe = (e) => {
  console.log($("#modalRenderer").serialize());
  sendAjax('POST', $("#modalRenderer").attr("action"), $("#modalRenderer").serialize(), function () {
    console.log('render');
    recipeRenderer.loadRecipesFromServer();
  });

  return false;
};

/* Surely not a safe/good way to do this,
   but was what I could come up with */
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


const renderModal = function () {
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
           <FormGroup controlId="formControlsName" id="formName"  validationState={this.state.validation}>
            <ControlLabel>Name</ControlLabel>
            <FormControl id="recipeName" componentClass="input" name="name" value={this.state.value} placeholder={this.state.placeholder} onChange={this.handleChange}/>
            <FormControl.Feedback />
            </FormGroup>
            
            <FormGroup controlId="formControlsCategory">
            <ControlLabel>Category</ControlLabel>
            <FormControl id="categoryName" componentClass="input" name="category" placeholder="Category..."/>
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

const renderRecipeList = function () {
  if (this.state.data.length === 0) {
    return ( 
      <div className="recipeList" >
        <h3 className="emptyDomo" > No recipes yet </h3> 
      </div>
    );
  }

  const recipeList = this;
  const recipeNodes = this.state.data.map(function (recipe) {
    recipeList.state.childS[recipe._id] = {id: recipe._id, open: false};
    return (
      <div key={recipe._id} className = "recipe" ><div>
      <Col sm={6}md={4}>
      <Well>
        <h3 className="textName" >{recipe.name} </h3>
        <Button id="showBtn"onClick={ ()=> {recipeList.toggleChildMenu(recipe._id)}}><Glyphicon glyph="chevron-down"/> </Button>
        <Collapse in={recipeList.state.childS[recipe._id].open}>
        <div id="recipeCont">
        <h3 className="textIngr">Ingredients:
          <br /></h3><p className="output">{recipe.ingredients}</p> 
        <h3 className="textNotes" >Notes: 
          <br /></h3><p className="output">{recipe.notes}</p>
        <Modal.Footer id="listFooter">
        <Button onClick = {
          () => { 
            removeRecipe(recipe.name, recipe.ingredients, recipe.notes, recipe.category)
          }}><Glyphicon glyph = "trash"/> </Button>
              </Modal.Footer>

          </div>
       </Collapse>
      </Well> 
      </Col> 
      </div> 
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
      placeholder: 'Name of recipe...'
    };
  },
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
     handleChange(e) {
    this.setState({ value: e.target.value });
  },
    close() {
    this.setState({ showModal: false });
  },
    render: renderModal
  });
  modalRenderer = ReactDOM.render(
    <AddNewRecipeClass csrf = {csrf}/>, document.querySelector("#content")
  );
};
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
        childS: {},
        open: false,
      };
    },
    handleToggle: function (data) {
      this.setState({
        open: data
      });
    },
    changeTheState(key) {
      consle.log('log')
    },
     toggleChildMenu(key) {
       console.dir(this.state.childS);
       this.state.childS = !this.state.childS;
        console.dir(this.state.childS);

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
