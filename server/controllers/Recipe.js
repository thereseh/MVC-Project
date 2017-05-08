const models = require('../models');

const Recipe = models.Recipe;

// renders the recipe book page
const makerPage = (req, res) => {
  Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), recipes: docs });
  });
};

// renders the yummly search page
const searchPage = (req, res) => {
  res.render('yummly', { csrfToken: req.csrfToken() });
};

// edits the recipe
const editRecipe = (request, response) => {
  const req = request;
  const res = response;

  const data = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    notes: req.body.notes,
    id: req.body.id,
    category: req.body.category,
  };

  return Recipe.RecipeModel.findAndUpdate(data, req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ recipes: docs });
  });
};

// creates a recip
const makeRecipe = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Need to fill out fields!' });
  }

  const recipeData = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    category: req.body.category,
    website: req.body.site,
    image: req.body.img,
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

// for future, sort by category
const getSorted = (request, response) => {
  const req = request;
  const res = response;

  const data = {
    category: req.body.category,
  };

  return Recipe.RecipeModel.findRecipiesByCategories(data, req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ recipes: docs });
  });
};


// gets all recipes from database
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

// get all categories from database
const getCategories = (request, response) => {
  const req = request;
  const res = response;

  return Recipe.RecipeModel.findCategoriesByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    const empty = docs.indexOf(' ');
    const docs2 = docs.splice(empty, 1);
    console.dir(docs2);
    return res.json({ categories: docs2 });
  });
};

// removes a recipe from the database
const removeRecipe = (request, response) => {
  const req = request;
  const res = response;
  const data = {
    id: req.body.id,
    name: req.body.name,
    ingredients: req.body.ingr,
    category: req.body.category,
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

module.exports.getSorted = getSorted;
module.exports.searchPage = searchPage;
module.exports.editRecipe = editRecipe;
module.exports.makerPage = makerPage;
module.exports.getRecipes = getRecipes;
module.exports.make = makeRecipe;
module.exports.removeRecipe = removeRecipe;
module.exports.getCategories = getCategories;

