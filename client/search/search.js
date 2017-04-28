let YummlyListClass;
let SearchYummlyClass;
let searchRenderer;
let FieldGroup = ReactBootstrap.FieldGroup;

  // to break up the different responses
  const handleResponse = (xhr) => {
     switch(xhr.status) {
      case 200: //success
         let search;
         console.log(JSON.parse(xhr.response));
        break;
        default: //default other errors we are not handling in this example
           break;
     }
};


const handleSearch = (e) => {
  console.log('post');

   sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function () {
    console.log('render');
  });

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
