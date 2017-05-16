let YummlyListClass;
let SearchYummlyClass;
let searchRenderer;
let searchListRenderer;
let FieldGroup = ReactBootstrap.FieldGroup;
let Panel = ReactBootstrap.Panel;
let Button = ReactBootstrap.Button;
let DropdownButton = ReactBootstrap.DropdownButton;
let Checkbox = ReactBootstrap.Checkbox;
let FormGroup = ReactBootstrap.FormGroup;
let ControlLabel = ReactBootstrap.ControlLabel;
let FormControl = ReactBootstrap.FormControl;
let Collapse = ReactBootstrap.Collapse;
let Popover = ReactBootstrap.Popover;
let OverlayTrigger = ReactBootstrap.OverlayTrigger;
let ButtonToolbar = ReactBootstrap.ButtonToolbar;
let Thumbnail = ReactBootstrap.Thumbnail;
let Modal = ReactBootstrap.Modal;
let Glyphicon = ReactBootstrap.Glyphicon;
let Clearfix = ReactBootstrap.Clearfix;

// sets up info needed to do a API call from server
const handleSearch = (e) => {
  e.preventDefault();
  let info = $("#searchForm").serialize();
  // find this word in the string
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
const copyRecipe = (name, img, ingredients, rating, time, url) => {
  // get key value, not safe
  let key = $("#cs")[0].attributes.value.value;
  // data to send
  let R = `Rating: ${rating}`;
  let T = `Time: ${time}`;
  let U = encodeURIComponent(url);
  let I = encodeURIComponent(img);
  let data = `${key}&name=${name}&ingredients=${ingredients}&site=${url}&img=${img}&notes=${R}+${T}`;
  data = data.replace(/ /g, '+');

  sendAjax('POST', '/maker', data, function () {
  });

  return false;
};

// Holder to render popup when client copies a recipe
const popoverTop = (
  <Popover id="popover-trigger-click-root-close" title="Popover top">
    <strong>Success!</strong> Recipe can be found in your recipe book.
  </Popover>
);

// begin to render 
const renderList = function() {
   if (this.state.data.length === 0) {
    return ( 
      <div className="searchList" >
        <h3 className="emptySearch"></h3> 
      </div>
    );
  }

  // map out the recipes from the array
  const recipeList = this;
  const recipeNodes = this.state.data.map(function (recipe, i) {
    return (
      <div key={i} className="recipe" >
      <Recipe name={recipe.name} ingredients={recipe.ingredientLines} rating={recipe.rating} img={recipe.images[0].imageUrlsBySize[360]} url={recipe.attribution.url} time={recipe.totalTime}/>
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
      {recipeNodes} 
    </div>
    </div> 
  );
};

// renders info from the recipe
// ingredients are given as an array, so must map them out
// button makes a copy of recipe and stores on server
const renderRecipeSearch = function() {
 return (
    <div className="grid-item">
    <Thumbnail src={this.props.img} alt="" id="searchImg">
      <h3 className="textName" >{this.props.name} </h3>
        <Button id="showBtn"onClick={ ()=> {this.toggleChildMenu()}}><Glyphicon glyph="chevron-down"/> </Button>
      <Collapse in={this.state.open}>
      <div id="recipeCont">
        <br />
        
        <h3 className="textIngr">Ingredients:
        <br /></h3>
        <div className="output">
          {
            this.props.ingredients.map(function(name, i) {
              return <p key={i}>- {name}</p>;
            })
          }
        </div> 
        <h3 className="textNotes" >Notes: 
        <br /></h3><p className="output">Rating: {this.props.rating}</p><p className="output">Total Time: {this.props.time}</p><p className="output">More info: <a href={this.props.url} target="_blank">
    {this.props.url}
  </a></p>
        <input type="hidden" name="_csrf" value={this.props.csrf}/>
      </div>
    </Collapse>
       <Modal.Footer id="listFooter">
      <ButtonToolbar>
         <OverlayTrigger container={this} trigger="click" rootClose placement="top" overlay={popoverTop}>
       <Button id="copyBtn" onClick = {
          () => { 
            copyRecipe(this.props.name, this.props.img, this.props.ingredients, this.props.rating,this.props.time,this.props.url)
          }} ><Glyphicon glyph="copy" /> </Button>
                </OverlayTrigger>
              </ButtonToolbar>
        </Modal.Footer>
        </Thumbnail>
     </div>
  );
};

// render the search field
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
    rating: '',
    key: '',
    url: '',
    img: '',
    time: '',
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
    rating: React.PropTypes.number,
    key: React.PropTypes.string,
    url: React.PropTypes.string,
    img: React.PropTypes.string,
    time: React.PropTypes.string,
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

// parent of search list
const createSearchList = function(csrf) {
  const SearchList = React.createClass({
     loadRecipesFromAPIfunction(info) {
        sendAjax('POST', '/search', info, function (data) {
        this.setState({
          data: data,
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

// class to render the search window
const createSearchWindow = function(csrf) {
  const SearchWindow = React.createClass({
     getInitialState() {
    return { 
      value: '',
      validation: '',
      placeholder: 'Chicken...',
    };
     },
     handleSubmit(e) {
      e.preventDefault();
      handleSearch(e);
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
