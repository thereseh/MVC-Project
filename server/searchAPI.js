// Node's built-in cryptography module.
// const crypto = require('crypto');
// const request = require('request');
// const querystring = require('querystring');
// const http = require('http');
//
//
// // Note this object is purely in memory
// let recipe = '';
// const idRecipe = '';
// const credentials = {
//   id: '19a24bb5',
//   key: '490c1135987b38fb49ad3de5c9b74e09',
// };
//
// // sha1 is a bit of a quicker hash algorithm for insecure things
// const etag = crypto.createHash('sha1').update(JSON.stringify(credentials));
// // grab the hash as a hex string
// const digest = etag.digest('hex');
//
//
// const respondJSON = (request, response, status, object) => {
//   const headers = {
//     'Content-Type': 'application/json',
//     etag: digest,
//   };
//   console.log(`respondJSON ${request}`);
//   response.writeHead(status, headers);
//   response.write(JSON.stringify(object));
//   response.end();
// };
//
// const respondJSONMeta = (request, response, status) => {
//   console.log(`respondJSONMeta ${status}`);
//   const headers = {
//     'Content-Type': 'application/json',
//     etag: digest,
//   };
//   response.writeHead(status, headers);
//   response.end();
// };
//
// const getJSON = (options, request, res) => {
//   if (options.query) {
//     options.path += `?${querystring.stringify(options.query)}`;
//   }
//
//   http.get({
//     host: 'api.yummly.com',
//     path: `/v1/api/${options.path}`,
//     headers: options.headers || {
//       'Content-Type': 'application/json',
//       'X-Yummly-App-ID': options.credentials.id,
//       'X-Yummly-App-Key': options.credentials.key,
//     },
//   }, (response) => {
//     let json = '';
//     response.on('error', (error) => {}).on('data', (data) => {
//       json += data;
//     }).on('end', (error) => {
//       recipe = JSON.parse(json);
//       respondJSON(request, res, 200, recipe);
//     });
//   });
// };
//
// // returns all recipes
// const searchYummly = (req, res) => {
//   if (req.headers['if-none-match'] === digest) {
//     console.log(req.headers['if-none-match']);
//     return respondJSONMeta(req, res, 304);
//   }
//   getJSON({
//     credentials,
//     query: {
//       q: 'chicken',
//     },
//     path: 'recipes',
//   }, req, res);
// };
//
// module.exports = {
//   searchYummly,
// };
//
