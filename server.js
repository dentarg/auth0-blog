var http = require('http');

var new_url = 'https://auth0.com/blog';

http.createServer(function (req, res) {

  res.writeHead(301, {
    'Location': new_url + req.url
  });

  res.end();

}).listen(process.env.PORT || 7000);