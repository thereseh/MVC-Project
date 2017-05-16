const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const updatePage = (req, res) => {
  res.render('change', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// method for when client tries to log in
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // check if either is empty
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // make authntication to check if the password is correct
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    // create a session with unique data
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// when the client creates a log in
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // all fields required
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // passwords are not the same
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'passwords do not match' });
  }

  // generate hash
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    // use username, salt and hash to create account
    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username is already in use.' });
      }

      return res.status(400).json({ error: 'an error occurred' });
    });
  });
};

// if the client changes their password
const updatePassword = (request, response) => {
  const req = request;
  const res = response;

  // all fields required
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;


  // current pass
  req.body.pass = `${req.body.pass}`;
  // new pass
  req.body.pass2 = `${req.body.pass2}`;

  // check if the current pass is correct
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    // are the passwords the same? doesn't make sense to change it then
    // so won't allow it
    if (req.body.pass === req.body.pass2) {
      return res.status(401).json({ error: 'New password cannot be same as current password!' });
    }

    // generate hash with the new password
    return Account.AccountModel.generateHash(req.body.pass2, (salt, hash) => {
      const accountData = {
        username: req.session.account.username,
        salt,
        password: hash,
      };

      // method call to find this user in the database and update the password
      return Account.AccountModel.findAndUpdate(accountData,
        req.session.account._id, (error) => {
          if (error) {
            console.log(error);
            return res.status(400).json({ error: 'An error occurred' });
          }

        // prompt user to log out so the session is killed and they are forced to log in
        // again with their new password
          return res.json({ redirect: '/logout' });
        });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

module.exports.updatePassword = updatePassword;
module.exports.loginPage = loginPage;
module.exports.updatePage = updatePage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
