let FieldGroup = ReactBootstrap.FieldGroup;
let FormGroup = ReactBootstrap.FormGroup;
let ControlLabel = ReactBootstrap.ControlLabel;
let FormControl = ReactBootstrap.FormControl;
let Panel = ReactBootstrap.Panel;
let Modal = ReactBootstrap.Modal;
let Button = ReactBootstrap.Button;

// log in handler
const handleLogin = (e) => {
  e.preventDefault();
  $("#errorMessage").hide();

  // makes sure username or password is not empty
  if($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  }
  // post request to get user key and session id  
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
}

// creates a user and store in database
const handleSignup = (e) => {
  e.preventDefault();
  $("#errorMessage").hide();

  // make sure no field is empty
  if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }
  
  // checks to see if user wrote correct password twice
  if($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }
  
  // post to create a user
  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  
  return false;
};

// render log in form
const renderLogin = function() {
  return (
    <Panel id="loginPanel">
    <form id="loginForm" name="loginForm"
    onSubmit={this.handleSubmit}
    action="/login"
    method="POST"
    className="mainForm"
    >
    <FormGroup controlId="loginFormControl"  id="formC">
      <ControlLabel>Username:</ControlLabel>
      <FormControl id="user" componentClass="input" name="username"  placeholder="username"/>
      <ControlLabel><br/>Password: </ControlLabel>
      <FormControl id="pass" componentClass="input" type="password" name="pass" placeholder="password" />
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

// to sign in
const renderSignup = function() {
 return (
  <Panel id="loginPanel">
 <form id="signupForm"
   name="signupForm"
   onSubmit={this.handleSubmit}
   action="/signup"
   method="POST"
   className="mainForm"
   >
    <FormGroup controlId="signUpFormControl"  id="formC">
      <ControlLabel>Username:</ControlLabel>
      <FormControl id="user" componentClass="input" name="username"  placeholder="username"/>
      
      <ControlLabel><br/>Password: </ControlLabel>
      <FormControl id="pass" componentClass="input" type="password" name="pass" placeholder="password" />
      
     <ControlLabel><br/>Password: </ControlLabel>
      <FormControl id="pass2" componentClass="input" type="password" name="pass2" placeholder="retype password" />
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

// class for log in
const createLoginWindow = function(csrf) {
  const LoginWindow = React.createClass({
    handleSubmit: handleLogin,
    render: renderLogin
  });
  
  ReactDOM.render(
    <LoginWindow csrf={csrf}/>,
    document.querySelector("#contentLogin")
  );
};

// class for sign up
const createSignupWindow = function(csrf) {
  const SignupWindow = React.createClass({
    handleSubmit: handleSignup,
    render: renderSignup
  });
  
  ReactDOM.render(
    <SignupWindow csrf={csrf}/>,
    document.querySelector("#contentLogin")
  );
};

const setup = function(csrf) {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");
  
  signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  
  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  
  createLoginWindow(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});