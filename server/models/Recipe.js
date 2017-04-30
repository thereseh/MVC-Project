const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let RecipeModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setIngr = (ingredients) => _.escape(ingredients).trim();
const setNotes = (notes) => _.escape(notes).trim();
const setCat = (category) => _.escape(category).trim();

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
  ingredients: doc.ingr,
  notes: doc.notes,
  category: doc.category,
});

RecipeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return RecipeModel.find(search).select('name ingredients notes category').exec(callback);
};

// by owner, check all recipes and send back the categories
RecipeSchema.statics.findCategoriesByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return RecipeModel.find(search).select('category').exec(callback);
};

// finds a specific domo and removes it
RecipeSchema.statics.findAndRemove = (data, ownerId, callback) => {
  const search = {
    owner: ownerId,
    name: data.name,
    ingredients: data.ingredients,
    notes: data.notes,
    category: data.category,
  };

  return RecipeModel.find(search).remove().exec(callback);
};


RecipeModel = mongoose.model('Recipe', RecipeSchema);

module.exports.RecipeModel = RecipeModel;
module.exports.RecipeSchema = RecipeSchema;
