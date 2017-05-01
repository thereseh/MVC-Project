let YummlyListClass;
let SearchYummlyClass;
let searchRenderer;
let searchListRenderer;
let FieldGroup = ReactBootstrap.FieldGroup;
let Panel = ReactBootstrap.Panel;
let Button = ReactBootstrap.Button;
let FormGroup = ReactBootstrap.FormGroup;
let ControlLabel = ReactBootstrap.ControlLabel;
let FormControl = ReactBootstrap.FormControl;
let Row = ReactBootstrap.Row;
let Col = ReactBootstrap.Col;
let Modal = ReactBootstrap.Modal;
let Glyphicon = ReactBootstrap.Glyphicon;
let yum = [];

// sets up info needed to do a AJAX request
const handleSearch = (e) => {
  e.preventDefault();
  let info = $("#searchForm").serialize();
  let n = info.search("_csrf");
  // slice out the key
  let key = info.slice(n, info.length);

  // create the class using the key
  createSearchList(key);

  // then do a search request using the info
  searchListRenderer.loadRecipesFromAPIfunction(info);
  return false;
};

// makes a copy of the recipe and store in the database
const copyRecipe = (name, ingredients, notes) => {
  // get key value, not safe
  let key = $("#cs")[0].attributes.value.value;
  // data to send
  let data = `name=${name}&ingredients=${ingredients}&notes=${notes}&${key}`;
  data = data.replace(/ /g, '+');

  sendAjax('POST', '/maker', data, function () {
  });

  return false;
};

// begin to render 
const renderList = function() {
   if (this.state.data.length === 0) {
    return ( 
      <div className="searchList" >
        <h3 className="emptySearch"></h3> 
      </div>
    );
  }

  // map out the recipes from the array, currently only about 10
  // need to add functionality to get more 
  const recipeList = this;
  const recipeNodes = this.state.data.map(function (recipe) {
    return (
      <div key={recipe._id} className="recipe" >
      <Recipe name={recipe.recipeName} id={recipe.id} ingredients={recipe.ingredients} notes={recipe.rating} url={recipe.imageUrlsBySize[90]}/>
      </div>
    );
  });

  return (
      <div className="recipeSecret" >
    <input 
      type = "hidden"
      id = "cs"
      name = "_csrf"
      value = {this.state.csrf}
    /> 
    <div className="searchList" >
      <Row className="show-grid" > {recipeNodes} </Row> 
    </div>
    </div> 
  );
};

// renders info from the recipe
// ingredients are given as an array, so must map them out
// button makes a copy of recipe and stores on server
const renderRecipeSearch = function() {
 return (
   <div>
    <Col sm={6}md={4}>
     <Panel>
      <h3 className="textName" >{this.props.name} </h3>
      <div id="recipeCont">
        <br />
        <img src={this.props.url} id="searchImg"/>

        <h3 className="textIngr">Ingredients:
        <br /></h3>
        <div className="output">
          {
            this.props.ingredients.map(function(name) {
              return <p key={name._id}>- {name}</p>;
            })
          }
        </div> 
        <h3 className="textNotes" >Notes: 
        <br /></h3><p className="output">Rating: {this.props.notes}</p>
        <input type="hidden" name="_csrf" value={this.props.csrf}/>
      </div>
       <Modal.Footer id="listFooter">
       <Button onClick = {
          () => { 
            copyRecipe(this.props.name, this.props.ingredients, this.props.notes, this.props.csrf)
          }}><Glyphicon glyph = "copy"/> </Button>
        </Modal.Footer>
          </Panel>
     </Col>
   </div>
  );
};

// render the search field, need to add more functionality
// such as specific requirements for allergens and such
const renderSearch = function() {
 return (
     <Panel>
     <form id="searchForm"
        onSubmit={this.handleSubmit}
        name="searchForm"
        action="/search"
        method="GET"
        className="searchForm"
      >
   <FormGroup controlId="formControlsSearch" validationState={this.state.validation} id="formS">
      <ControlLabel>Search</ControlLabel>
        <FormControl id="searchRec" componentClass="input" name="searchRec" value={this.state.value} placeholder={this.state.placeholder} onChange={this.handleChange}/>
    </FormGroup>
     <input type="hidden" name="_csrf" value={this.props.csrf}/>
      <Button id="sBtn" type="submit">
              Submit
            </Button>
     </form>
    </Panel>
 );
};

// set default props
const defaultRecipeProps = function () {
  return {
    name: '',
    ingredients: '',
    notes: '',
    key: '',
    url: ''
  }
};

// Recipe child of the createSearchList
// and the props we need to render it
const Recipe = React.createClass({
  getDefaultProps: defaultRecipeProps,
  render: renderRecipeSearch,
  propTypes: {
    name: React.PropTypes.string,
    ingredients: React.PropTypes.array,
    notes: React.PropTypes.number,
    key: React.PropTypes.string,
    url: React.PropTypes.string
  },
});

// parent of search list
const createSearchList = function(csrf) {
  const SearchList = React.createClass({
     loadRecipesFromAPIfunction(info) {
        sendAjax('POST', '/search', info, function (data) {
        this.setState({
          data: data.matches,
        });
      }.bind(this));
    },
    getInitialState() {
    return { 
      id: '',
      ingredients: '',
      recipeName: '',
      rating: '',
      data: [],
      csrf: csrf
    };
     },
      handleChange(e) {
    this.setState({ value: e.target.value });
    },
    render: renderList
  });
  
  searchListRenderer = ReactDOM.render(
    <SearchList csrf={csrf}/>,
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
