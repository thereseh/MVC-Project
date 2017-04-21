
let recipeRenderer;
let recipeForm;
let RecipeFormClass;
let RecipeListClass;
let Collapse = ReactBootstrap.Collapse;
let Button = ReactBootstrap.Button;
let Well = ReactBootstrap.Well;
let Col = ReactBootstrap.Col;
let Row = ReactBootstrap.Row;
let Glyphicon = ReactBootstrap.Glyphicon;


const handleRecipe = (e) => {
  e.preventDefault();

  if($("#recipeName").val() == '') {
    console.log($("#recipeName").val());
    handleError("Recipe needs a name!");
    return false;
  }
  
  sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function() {
    recipeRenderer.loadRecipesFromServer();
  });
  
  return false;
};

/* Surely not a safe/good way to do this,
   but was what I could come up with */
const removeRecipe = (name, ingr, notes) => {
  $("#domoMessage").animate({width:'hide'},350);
  // get key value, not safe
  let key = $("#cs")[0].attributes.value.value;
  // data to send
  let data = `name=${name}&ingr=${ingr}&notes=${notes}&_csrf=${key}`;
  sendAjax('DELETE', '/removeRecipe', data, function() {
    recipeRenderer.loadRecipesFromServer();
  });
  
  return false;
};

const renderRecipe = function() {
  return (
    <form id="recipeForm"
      onSubmit={this.handleSubmit}
      name="recipeForm"
      action="/maker"
      method="POST"
      className="recipeForm"
    >
    <label htmlFor="name">Name: </label>
    <input id="recipeName" type="text" name="name" placeholder="Name"/>
    <label htmlFor="ingr">Ingredients:</label>
    <input id="recipeIngr" type="text" name="ingr" placeholder="Ingredients"/>
    <label htmlFor="notes">Notes:</label>
    <input id="recipeNotes" type="text" name="notes" placeholder="Cooking time/temperature"/>
    <input type="hidden" name="_csrf" value={this.props.csrf} />
    <input className="makeRecipeSubmit" type="submit" value="Make Recipe"/>
    </form>
  );
};

const renderRecipeList = function() {
  if(this.state.data.length === 0) {
    return (
      <div className="recipeList">
      <h3 className="emptyDomo">No recipes yet</h3>
      </div>
    );
  }
  
  const recipeNodes = this.state.data.map(function(recipe) {
    return (
      <div key={recipe._id} className="recipe">
          <div>
            <Col sm={6} md={3}>
            <Well>
            <h3 className="textName">Name: {recipe.name}</h3>
            <Button><Glyphicon glyph="chevron-down" /></Button>
            <h3 className="text"> Ingredients: {recipe.ingredients}</h3>
            <h3 className="text">Notes: {recipe.notes}</h3>
              <Button onClick={() => { removeRecipe(recipe.name, recipe.ingredients, recipe.notes) }}> <Glyphicon glyph="trash" /></Button>
            </Well>
            </Col>
          </div>
      </div>
    );
  });
  
  return (
    <div className="recipeList">
     <input type="hidden" id="cs" name="_csrf" value={this.props.csrf} />
      <Row className="show-grid">
    {recipeNodes}
      </Row>
    </div>
  );
};

const setup = function(csrf) {
  RecipeFormClass = React.createClass({
    handleSubmit: handleRecipe,
    render: renderRecipe,
  });
  
  RecipeListClass = React.createClass({
    loadRecipesFromServer: function() {
      sendAjax('GET', '/getRecipes', null, function(data) {
        this.setState({data:data.recipes});
      }.bind(this));
    },
    getInitialState: function() {
        return {data:[]};
    },
    componentDidMount: function() {
      this.loadRecipesFromServer();
    },
    render: renderRecipeList
  });
    recipeForm = ReactDOM.render(
    <RecipeFormClass csrf={csrf} />, document.querySelector("#makeRecipe")
    );
  recipeRenderer = ReactDOM.render(
    <RecipeListClass csrf={csrf} />, document.querySelector("#recipes")
  );
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});