 Node's built-in cryptography module.
 const crypto = require('crypto');
 const request = require('request');
 const querystring = require('querystring');
 const http = require('http');
 const yummly = require('yummly');


 // Note this object is purely in memory
 let recipe = '';
 const credentials = {
   id: '19a24bb5',
   key: '490c1135987b38fb49ad3de5c9b74e09',
 };

 // sha1 is a bit of a quicker hash algorithm for insecure things
 const etag = crypto.createHash('sha1').update(JSON.stringify(credentials));
 // grab the hash as a hex string
 const digest = etag.digest('hex');


 const respondJSON = (request, response, status, object) => {
   const headers = {
     'Content-Type': 'application/json',
     etag: digest,
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
     etag: digest,
   };
   response.writeHead(status, headers);
   response.end();
 };


 // returns all recipes
 const searchYummly = (req, res) => {
   if (req.headers['if-none-match'] === digest) {
     console.log(req.headers['if-none-match']);
     return respondJSONMeta(req, res, 304);
   }
  yummly.search({ // calling search first to get a recipe id
  credentials: credentials,
  query: {
    q: 'pasta'
  }
}, function (error, response, json) {
  if (error) {
    console.error(error);
  } else if (response.statusCode === 200) {

    yummly.recipe({
      credentials: credentials,
      id: json.matches[0].id // id of the first recipe returned by search
    }, function (error, response, json) {
      if (error) {
        console.error(error);
      } else {
        console.log(json);
      }
    });
  }
});
};

 module.exports = {
   searchYummly,
 };
