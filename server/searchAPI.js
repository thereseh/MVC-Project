// Node's built-in cryptography module.
const crypto = require('crypto');

// Note this object is purely in memory
const recipe = {};

const credentials = {
  id: '19a24bb5',
  key: '490c1135987b38fb49ad3de5c9b74e09'
}

// sha1 is a bit of a quicker hash algorithm for insecure things
let etag = crypto.createHash('sha1').update(JSON.stringify(recipe));
// grab the hash as a hex string
let digest = etag.digest('hex');

// returns all recipes
const searchYummly = (endpoint, method, data, success) => {
  const dataString = JSON.stringify(data);
  let headers = {};
  
  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  const options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  let req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    let responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}

module.exports = {
  searchYummly,
};