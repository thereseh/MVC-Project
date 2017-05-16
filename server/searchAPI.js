
const Yummly = require('ws-yummly');

Yummly.config({
  app_id: '19a24bb5',
  app_key: '490c1135987b38fb49ad3de5c9b74e09',
});

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};


 // returns all recipes
const searchYummly = (req, res) => {
  const id = [];
  let recipes = {};
  const recipestwo = [];


  /* I took out the other options because the API is funky.
    I was receiving recipes that were not part of the diet/allergy requested,
    but even when I did my own GET request directly in brower,
    I'll would the same result.
    Although, removing the query parameter made it more correct in browser,
    which this node library don't allow.
    I'll attempt to set up my own double-URL call another time*/
  Yummly.query(req.body.searchRec)
  .maxResults(40)
  .paginate(40)
  .requirePictures(true)
  .get()
  .then((resp) => {
    resp.matches.forEach((recipe) => {
      recipes = recipe;
    });
    for (let i = 0; i < recipes.length; i++) {
      id.push(recipes[i].id);
    }
    Yummly.getDetails(id).then((resps) => {
      resps.forEach((recipe) => {
        recipestwo.push(recipe);
      });
      respondJSON(req, res, 200, recipestwo);
    });
  });
  return false;
};

module.exports = {
  searchYummly,
};
