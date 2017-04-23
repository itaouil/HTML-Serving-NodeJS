// Modules

const http = require("http");
const url  = require("url");
const path = require("path");
const fs   = require("fs");

// Object (types served)
var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg" : "image/jpg",
  "png" : "image/png",
  "js"  : "text/javascript",
  "css" : "text/css"
};

// Listening to me bro
const hostname = '127.0.0.1';
const port = 3000;

// Server

const server = http.createServer((req, res) => {

  // Get uri of the req
  var uri = url.parse(req.url).pathname;

  // Get file requested path
  var fileName = path.join(process.cwd(), decodeURIComponent(uri));

  try {
    var stats = fs.lstatSync(fileName);

    // Check file object
    if (stats.isFile()) {

      // Get last portion of path
      var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];

      // Send response
      res.statusCode = 200;
      res.setHeader("Content-Type", mimeType);

      // Get file stream
      var fileStream = fs.createReadStream(fileName);
      fileStream.pipe(res);

    }

    else if (stats.isDirectory()) {

      res.statusCode = 302;
      res.setHeader("Location", "index.html");
      res.end();

    }

    else {

      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("500 Internal Error");

    }
  }

  catch (e) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("404 Not Found\n");
  }

});

// Run server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
