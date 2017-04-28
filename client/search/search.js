let YummlyListClass;
let SearchYummlyClass;
let searchRenderer;
let FieldGroup = ReactBootstrap.FieldGroup;

const handleSearch = (e) => {
  sendAjax('POST', $("#modalRenderer").attr("action"), $("#modalRenderer").serialize(), function () {
  });

  return false;
};


const renderSearch = function() {
  console.log('hej');
 return (
   <div>
   <FormGroup controlId="formControlsSearcg">
      <ControlLabel>Name</ControlLabel>
        <FormControl id="searchRec" componentClass="input" name="searchRec" placeholder="chicken.."/>
    </FormGroup>
     <input type="hidden" name="_csrf" value={this.props.csrf}/>
     </div>
 );
};

const createSearchWindow = function(csrf) {
  const SearchWindow = React.createClass({
    handleSubmit: handleSearch,
    render: renderSearch
  });
  
  searchRenderer = ReactDOM.render(
    <SearchWindow csrf={csrf}/>,
    document.querySelector("#stuff")
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
