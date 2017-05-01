 // Node's built-in cryptography module.
 const crypto = require('crypto');
 const querystring = require('querystring');
 const http = require('http');

 const credentials = {
   id: '19a24bb5',
   key: '490c1135987b38fb49ad3de5c9b74e09',
 };

 let recipe = '';
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

 const getJSON = (options, request, res) => {
   let path = options.path;
   if (options.query) {
     path += `?${querystring.stringify(options.query)}`;
   }

   http.get({
     host: 'api.yummly.com',
     path: `/v1/api/${path}`,
     headers: options.headers || {
       'Content-Type': 'application/json',
       'X-Yummly-App-ID': options.credentials.id,
       'X-Yummly-App-Key': options.credentials.key,
     },
   }, (response) => {
     let json = '';
     response.on('error', (error) => {
       console.dir(error);
     }).on('data', (data) => {
       json += data;
     }).on('end', (error) => {
       if (error) {
         console.dir(error);
       }
       recipe = JSON.parse(json);
       respondJSON(request, res, 200, recipe);
     });
   });
 };

 // returns all recipes
 const searchYummly = (req, res) => {
   if (req.headers['if-none-match'] === digest) {
     console.log(req.headers['if-none-match']);
     return respondJSONMeta(req, res, 304);
   }
   getJSON({
     credentials,
     query: {
       q: req.body.searchRec,
     },
     path: 'recipes',
   }, req, res);

   return false;
 };

 module.exports = {
   searchYummly,
 };
