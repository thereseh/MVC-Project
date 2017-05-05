 // Node's built-in cryptography module.
 const crypto = require('crypto');
 const querystring = require('querystring');
 const http = require('http');
 const Yummly = require('ws-yummly');
 const _ = require('underscore');


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
   console.log(`respondJSON ${request}`);
   response.writeHead(status, headers);
   response.write(JSON.stringify(object));
   response.end();
 };

 const respondJSONMeta = (request, response, status) => {
   console.log(`respondJSONMeta ${status}`);
   const headers = {
     'Content-Type': 'application/json',
   };
   response.writeHead(status, headers);
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
   let diets = '';
   let allergy = '';
   let cuisine = '';
   let search = '';
   if (req.body.searchRec === '') {
     console.log('empty');
     search = '';
   }
   if (req.body.diet) {
     diets = req.body.diet;
   }
   if (req.body.allergy) {
     allergy = req.body.allergy;
   }
   if (req.body.cuisine) {
     cuisine = req.body.cuisine;
   }

   console.log(cuisine);
   console.log(diets);
   console.log(allergy);
   Yummly.query(req.body.searchRec)
    .maxResults(20)
    .paginate(10)
    .allowedDiets(diets)
    .allowedAllergies(allergy)
    .allowedCuisines(cuisine)
    .requirePictures(true)
    .get()
    .then((resp) => {
      resp.matches.forEach((recipe) => {
        recipes = recipe;
      });
      for (let i = 0; i < recipes.length; i++) {
        id.push(recipes[i].id);
      }
      Yummly.getDetails(id).then((resp) => {
        resp.forEach((recipe) => {
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
