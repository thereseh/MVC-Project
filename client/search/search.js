let YummlyListClass;
let SearchYummlyClass;
let searchRenderer;
let searchListRenderer;
let FieldGroup = ReactBootstrap.FieldGroup;
let yum = {};

  // to break up the different responses
  const handleResponse = (xhr) => {
     switch(xhr.status) {
      case 200: //success
         console.log(JSON.parse(xhr.response));
        yum = JSON.parse(xhr.response).matches;
        break;
        default: //default other errors we are not handling in this example
        break;
     }
};

const handleSearch = (e) => {
  console.log('post');
  const xhr = new XMLHttpRequest();
    const url = '/search';
    xhr.open('post', url);
    
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      //set our requested response type in hopes of a JSON response
    xhr.setRequestHeader('Accept', 'application/json');
      
    xhr.onload = () => handleResponse(xhr);

    const formData = $("#searchForm").serialize();
      //send our request with the data
    xhr.send(formData);
          
    e.preventDefault();
    return false;
};

const renderList = function() {
   if (this.state.data.length === 0) {
    return ( 
      <div className="searchList" >
        <h3 className="emptySearch" > Try again!</h3> 
      </div>
    );
  }

  const recipeList = this;
  const recipeNodes = this.yum.map(function (recipe) {
    return (
      <div key={recipe._id} className="recipe" >
      <Recipe name={recipe.recipeName} id={recipe.id} ingredients={recipe.ingredients} notes={recipe.rating}/>
      </div>
    );
  });

  return ( 
    <div className="searchList" >
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

const renderRecipeSearch = function() {
 return (
   <div>
     <Panel>
      <h3 className="textName" >{this.props.name} </h3>
        <div id="recipeCont">
        <h3 className="textIngr">Ingredients:
          <br /></h3>
          <p className="output">{this.props.ingredients}</p> 
        <h3 className="textNotes" >Notes: 
          <br /></h3><p className="output">{this.props.notes}</p>
     <input type="hidden" name="_csrf" value={this.props.csrf}/>
          </div>
          </Panel>
     </div>
  );
};

const renderSearch = function() {
 return (
   <div>
     <Panel>
     <form id="searchForm"
        onSubmit={this.handleSubmit}
        name="searchForm"
        action="/search"
        method="GET"
        className="searchForm"
      >
   <FormGroup controlId="formControlsSearch" validationState={this.state.validation} id="formS">
      <ControlLabel>Name</ControlLabel>
        <FormControl id="searchRec" componentClass="input" name="searchRec" value={this.state.value} placeholder={this.state.placeholder} onChange={this.handleChange}/>
    </FormGroup>
     <input type="hidden" name="_csrf" value={this.props.csrf}/>
      <Button id="sBtn" type="submit">
              Submit
            </Button>
     </form>
       </Panel>
     </div>
 );
};

const RecipeS = React.createClass({
  getDefaultProps: defaultRecipeProps,
  render: renderRecipeSearch,
  propTypes: {
    name: React.PropTypes.string.isRequired,
    ingredients: React.PropTypes.string.isRequired,
    notes: React.PropTypes.string.isRequired,
  },
});

const createSearchList = function(csrf) {
  const SearchList = React.createClass({
    getInitialState() {
    return { 
      id: '',
      ingredients: '',
      recipeName: '',
      rating: '',
      data: {},
    };
     },
     loadRecipesFromAPIfunction: function() {
        this.setState({
          data: yum.matches,
        });
    },
      handleChange(e) {
    this.setState({ value: e.target.value });
    },
    render: renderList
  });
  
  searchListRenderer = ReactDOM.render(
    <SearchWindow csrf={csrf}/>,
    document.querySelector("#searchResults")
  );
};


const createSearchWindow = function(csrf) {
  const SearchWindow = React.createClass({
     getInitialState() {
    return { 
      value: '',
      validation: '',
      placeholder: 'Chicken...'
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
        handleSearch(e);
      }
    },
        handleChange(e) {
    this.setState({ value: e.target.value });
    },
    render: renderSearch
  });
  
  searchRenderer = ReactDOM.render(
    <SearchWindow csrf={csrf}/>,
    document.querySelector("#searchPanel")
  );
};


const setupSearch = function (csrf) {
  console.log('setup');
  createSearchWindow(csrf);
};


const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setupSearch(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
