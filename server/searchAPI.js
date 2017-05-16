 // Node's built-in cryptography module.
// const crypto = require('crypto');
// const querystring = require('querystring');
// const http = require('http');
const Yummly = require('ws-yummly');
// const _ = require('underscore');


Yummly.config({
  app_id: '19a24bb5',
  app_key: '490c1135987b38fb49ad3de5c9b74e09',
});

 // sha1 is a bit of a quicker hash algorithm for insecure things
 // const etag = crypto.createHash('sha1').update(JSON.stringify(credentials));
 // // grab the hash as a hex string
 // const digest = etag.digest('hex');


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
   // if (req.headers['if-none-match'] === digest) {
   //   console.log(req.headers['if-none-match']);
   //   return respondJSONMeta(req, res, 304);
   // }

  const id = [];
  let recipes = {};
  const recipestwo = [];

  if (req.body.searchRec === '') {
    console.log('empty');
    // search = '';
  }

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
