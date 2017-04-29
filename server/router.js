const controllers = require('./controllers');
const mid = require('./middleware');


const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getRecipes', mid.requiresLogin, controllers.Recipe.getRecipes);
  app.get('/getCategories', mid.requiresLogin, controllers.Recipe.getCategories);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Recipe.makerPage);
  app.get('/yummly', mid.requiresLogin, controllers.Recipe.searchPage);
  app.post('/maker', mid.requiresLogin, controllers.Recipe.make);
  app.delete('/removeRecipe', mid.requiresLogin, controllers.Recipe.removeRecipe);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
