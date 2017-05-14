let FieldGroup = ReactBootstrap.FieldGroup;
let FormGroup = ReactBootstrap.FormGroup;
let ControlLabel = ReactBootstrap.ControlLabel;
let FormControl = ReactBootstrap.FormControl;
let Panel = ReactBootstrap.Panel;
let Modal = ReactBootstrap.Modal;
let Button = ReactBootstrap.Button;


const handleChange = (e) => {
  e.preventDefault();
  $("#errorMessage").animate({width:'hide'},350);

  if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }
  
  sendAjax('PUT', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);
  
  return false;
};


// to sign in
const renderChange = function() {
 return (
<Panel id="loginPanel">
 <form id="changeForm"
   name="changeForm"
   onSubmit={this.handleSubmit}
   action="/update"
   method="PUT"
   className="mainForm"
   >
    <FormGroup controlId="signUpFormControl"  id="formC">
      <ControlLabel>Username:</ControlLabel>
      <FormControl id="user" componentClass="input" name="username"  placeholder="username"/>
      
      <ControlLabel><br/>Current Password: </ControlLabel>
      <FormControl id="pass" componentClass="input" type="password" name="pass" placeholder="current password" />
      
     <ControlLabel><br/>New Password: </ControlLabel>
      <FormControl id="pass2" componentClass="input" type="password" name="pass2" placeholder="new password" />
      <input type="hidden" name="_csrf" value={this.props.csrf}/>
     <Modal.Footer>
        <Button type="submit">
              Submit
            </Button>
      </Modal.Footer>
    </FormGroup>
    </form>
    </Panel>
 );
};

const createChangeWindow = function(csrf) {
  const ChangeWindow = React.createClass({
    handleSubmit: handleChange,
    render: renderChange
  });
  
  ReactDOM.render(
    <ChangeWindow csrf={csrf}/>,
    document.querySelector("#contentLogin")
  );
};

const setup = function(csrf) {
  createChangeWindow(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});