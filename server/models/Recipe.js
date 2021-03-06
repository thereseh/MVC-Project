const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let RecipeModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setIngr = (ingredients) => _.escape(ingredients).trim();
const setNotes = (notes) => _.escape(notes).trim();
const setCat = (category) => _.escape(category).trim();
const setImg = (image) => _.escape(image).trim();
const setWeb = (website) => _.escape(website).trim();


const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  ingredients: {
    type: String,
    trim: true,
    required: false,
    set: setIngr,
  },

  notes: {
    type: String,
    required: false,
    trim: true,
    set: setNotes,
  },
  category: {
    type: String,
    required: false,
    trim: true,
    set: setCat,
  },
  image: {
    type: String,
    required: false,
    trim: true,
    set: setImg,
  },
  website: {
    type: String,
    required: false,
    trim: true,
    set: setWeb,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createData: {
    type: Date,
    default: Date.now,
  },
});

RecipeSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  ingredients: doc.ingredients,
  notes: doc.notes,
  category: doc.category,
  website: doc.website,
  image: doc.image,
});

RecipeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return RecipeModel.find(search)
    .select('name ingredients notes category website image')
    .exec(callback);
};

// by owner, check all recipes and send back the categories
RecipeSchema.statics.findCategoriesByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  // distinct allows to return unique values
  return RecipeModel.distinct('category', search, callback);
};

// by owner, returns recipies by category
RecipeSchema.statics.findRecipiesByCategories = (data, ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
    category: data.category,
  };

  return RecipeModel.find(search)
    .select('name ingredients notes category website image')
    .exec(callback);
};

// finds a specific domo and removes it
RecipeSchema.statics.findAndRemove = (data, ownerId, callback) => {
  // using recipe id and name of owner
  // from session with account info from log in
  const search = {
    owner: ownerId,
    _id: data.id,
  };

  return RecipeModel.find(search).remove().exec(callback);
};

// finds a recipe and updates it
RecipeSchema.statics.findAndUpdate = (data, ownerId, callback) => {
  // using recipe id and name of owner
  // from session with account info from log in
  const search = {
    owner: ownerId,
    _id: data.id,
  };

  const update = {
    name: data.name,
    ingredients: data.ingredients,
    notes: data.notes,
    category: data.category,
  };

  return RecipeModel.find(search).update(update).exec(callback);
};


RecipeModel = mongoose.model('Recipe', RecipeSchema);

module.exports.RecipeModel = RecipeModel;
module.exports.RecipeSchema = RecipeSchema;
