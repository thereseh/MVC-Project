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
let Row = ReactBootstrap.Row;
let Collapse = ReactBootstrap.Collapse;
let Col = ReactBootstrap.Col;
let Modal = ReactBootstrap.Modal;

let Glyphicon = ReactBootstrap.Glyphicon;
let Clearfix = ReactBootstrap.Clearfix;

// sets up info needed to do a AJAX request
const handleSearch = (e) => {
  e.preventDefault();
  let info = $("#searchForm").serialize();
  let n = info.search("_csrf");
  // slice out the key
  let key = info.slice(n, info.length);

  console.log(info);
  // create the class using the key
  createSearchList(key);

  // then do a search request using the info
  searchListRenderer.loadRecipesFromAPIfunction(info);
  return false;
};

const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60));
   
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
 
    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);
   
    let obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}

// makes a copy of the recipe and store in the database
const copyRecipe = (name, img, ingredients, rating, time, url) => {
  // get key value, not safe
  let key = $("#cs")[0].attributes.value.value;
  // data to send

  let U = encodeURIComponent(url);
  let I = encodeURIComponent(img);
  let data = `${key}&name=${name}&ingredients=${ingredients}&site=${url}&img=${img}&notes=${rating}+${time}`;
  data = data.replace(/ /g, '+');

  console.log(data);
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
     <Panel>
      <h3 className="textName" >{this.props.name} </h3>
       <img src={this.props.img} id="searchImg"/>
        <Button id="showSearchBtn"onClick={ ()=> {this.toggleChildMenu()}}><Glyphicon glyph="chevron-down"/> </Button>
      <Collapse in={this.state.open}>
      <div id="recipeCont">
        <br />
        
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
        <br /></h3><p className="output">Rating: {this.props.rating}</p><p className="output">Total Time: {this.props.time}</p><p className="output">More info: <a href={this.props.url} target="_blank">
    {this.props.url}
  </a></p>
        <input type="hidden" name="_csrf" value={this.props.csrf}/>
      </div>
    </Collapse>
       <Modal.Footer id="listFooter">
       <Button onClick = {
          () => { 
            copyRecipe(this.props.name, this.props.img, this.props.ingredients, this.props.rating,this.props.time,this.props.url)
          }}><Glyphicon glyph = "copy"/> </Button>
        </Modal.Footer>
          </Panel>
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
       <DropdownButton bsStyle="default" name="diet" title="Diets" id="dietsDropDown">
         <div id="dietHolder">
        <Checkbox value="Pescetarian" name="diet">
          Pescetarian
        </Checkbox>
         <Checkbox value="Vegan" name="diet">
          Vegan
        </Checkbox>
         <Checkbox value="Vegetarian" name="diet">
          Vegetarian
        </Checkbox>
         <Checkbox value="Lacto Vegetarian" name="diet">
          Lacto vegetarian
        </Checkbox>
         <Checkbox value="Ovo Vegetarian" name="diet">
          Ovo vegetarian
        </Checkbox>
           </div>
      </DropdownButton>
     
       <DropdownButton bsStyle="default" name="allergy" title="Allergies" id="allergiesDropDown">
         <div id="allergyHolder">
        <Checkbox value="dairy" name="allergy">
          Dairy
        </Checkbox>
         <Checkbox value="egg" name="allergy">
          Egg
        </Checkbox>
         <Checkbox value="gluten" name="allergy">
          Gluten
        </Checkbox>
         <Checkbox value="peanut" name="allergy">
          Peanut
        </Checkbox>
         <Checkbox value="seafood" name="allergy">
          Seafood
        </Checkbox>
        <Checkbox value="sesame" name="allergy">
          Sesame
        </Checkbox>
         <Checkbox value="soy" name="allergy">
          Soy
        </Checkbox>
         <Checkbox value="sulfite" name="allergy">
         Sulfite
        </Checkbox>
        <Checkbox value="tree nut" name="allergy">
          Tree Nut
        </Checkbox>
         <Checkbox value="wheat" name="allergy">
         Wheat
        </Checkbox>
           </div>
      </DropdownButton>
     <DropdownButton bsStyle="default" name="cuisine" title="Cuisine" id="cuisineDropDown">
         <div id="cuisineHolder">
        <Checkbox value="American" name="cuisine">
          American
        </Checkbox>
         <Checkbox value="Italian" name="cuisine">
          Italian
        </Checkbox>
         <Checkbox value="Asian" name="cuisine">
         Asian
        </Checkbox>
         <Checkbox value="Mexican" name="cuisine">
         Mexican
        </Checkbox>
         <Checkbox value="Southern & Soul Food" name="cuisine">
         Southern & Soul Food
        </Checkbox>
        <Checkbox value="French" name="cuisine">
         French
        </Checkbox>
         <Checkbox value="Southwestern" name="cuisine">
          Southwestern
        </Checkbox>
         <Checkbox value="Barbecue" name="cuisine">
         Barbecue
        </Checkbox>
        <Checkbox value="Indian" name="cuisine">
         Indian
        </Checkbox>
         <Checkbox value="Chinese" name="cuisine">
        Chinese
        </Checkbox>
          <Checkbox value="Cajun & Creole" name="cuisine">
        Cajun & Creole
        </Checkbox>
         <Checkbox value="English" name="cuisine">
         English
        </Checkbox>
         <Checkbox value="Mediterranean" name="cuisine">
         Mediterranean
        </Checkbox>
        <Checkbox value="Greek" name="cuisine">
         Greek
        </Checkbox>
         <Checkbox value="Spanish" name="cuisine">
          Spanish
        </Checkbox>
         <Checkbox value="German" name="cuisine">
         German
        </Checkbox>
        <Checkbox value="Thai" name="cuisine">
         Thai
        </Checkbox>
         <Checkbox value="Irish" name="cuisine">
        Irish
        </Checkbox>
            <Checkbox value="Japanese" name="cuisine">
          Japanese
        </Checkbox>
         <Checkbox value="Cuban" name="cuisine">
        Cuban
        </Checkbox>
        <Checkbox value="Hawaiin" name="cuisine">
        Hawaiin
        </Checkbox>
         <Checkbox value="Swedish" name="cuisine">
        Swedish
        </Checkbox>
           <Checkbox value="Hungarian" name="cuisine">
       Hungarian
        </Checkbox>
           <Checkbox value="Portugese" name="cuisine">
       Portugese
        </Checkbox>
           </div>
      </DropdownButton>
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
          console.dir(data);
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
      this.setState({ showModal: false });
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
