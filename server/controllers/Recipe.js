const models = require('../models');

const Recipe = models.Recipe;

const makerPage = (req, res) => {
  Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), recipes: docs });
  });
};

const makeRecipe = (req, res) => {
  if (!req.body.name || !req.body.ingr || !req.body.notes) {
    return res.status(400).json({ error: 'Need to fill out fields!' });
  }

  const recipeData = {
    name: req.body.name,
    ingredients: req.body.ingr,
    notes: req.body.notes,
    owner: req.session.account._id,
  };

  const newRecipe = new Recipe.RecipeModel(recipeData);

  const recipePromise = newRecipe.save();

  recipePromise.then(() => res.json({ redirect: '/maker' }));

  recipePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Recipe already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return recipePromise;
};

const getRecipes = (request, response) => {
  const req = request;
  const res = response;

  return Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ recipes: docs });
  });
};

const removeRecipe = (request, response) => {
  const req = request;
  const res = response;
  const data = {
    name: req.body.name,
    ingredients: req.body.ingr,
    notes: req.body.notes,
  };

  return Recipe.RecipeModel.findAndRemove(data, req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ recipes: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getRecipes = getRecipes;
module.exports.make = makeRecipe;
module.exports.removeRecipe = removeRecipe;

