// Node's built-in cryptography module.
const crypto = require('crypto');
const querystring = require('querystring');

// Note this object is purely in memory
// const recipe = {};

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
  response.send(JSON.stringify(object));
};

const respondJSONMeta = (request, response, status) => {
  console.log(`respondJSONMeta ${status}`);
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };
  response.send();
};

const getJSON = (options, request) => {
options.path = 'recipes';
console.log(options.query);
  if (options.query) {
    options.path += '?' + querystring.stringify(options.query);
  }
console.log(options.query);
  app.get({
    host: 'api.yummly.com',
    path: '/v1/api/' + options.path,
    headers: options.headers || {
      'Content-Type': 'application/json',
      'X-Yummly-App-ID': options.credentials.id,
      'X-Yummly-App-Key': options.credentials.key
    }
  }, (response) => {
    console.dir(response);
    let json = '';

    response.on('error', (error) => {
     console.dir(error);
    }).on('data', function (data) {
      json += data;
    }).on('end', function (error) {
      console.dir(json);
      const responseJSON = {
        json,
      };
     return respondJSON(request, response, 200, responseJSON);
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
      credentials: credentials,
      query: {
        q: 'pasta'
      },
    }, req);
};

module.exports = {
  searchYummly,
};
