// Node's built-in cryptography module.
const crypto = require('crypto');

// Note this object is purely in memory
const recipe = {};

let credentials = {
  id: '19a24bb5',
  key: '490c1135987b38fb49ad3de5c9b74e09',
};

// sha1 is a bit of a quicker hash algorithm for insecure things
const etag = crypto.createHash('sha1').update(JSON.stringify(recipe));
// grab the hash as a hex string
const digest = etag.digest('hex');

// returns all recipes
const searchYummly = (endpoint, method, data, success) => {
  const dataString = JSON.stringify(data);
  let headers = {};

  if (method == 'GET') {
    endpoint += `?${querystring.stringify(data)}`;
  } else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length,
    };
  }
  const options = {
    host,
    path: endpoint,
    method,
    headers,
  };

  const req = https.request(options, (res) => {
    res.setEncoding('utf-8');

    let responseString = '';

    res.on('data', (data) => {
      responseString += data;
    });

    res.on('end', () => {
      console.log(responseString);
      const responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
};

module.exports = {
  searchYummly,
};
