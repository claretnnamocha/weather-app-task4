const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const port = process.env.PORT || 5000;
const content_types = {
  html: "text/html",
  png: "image/png",
  js: "text/javascript",
  css: "text/css",
};

const server = http.createServer((req, res) => {
  try {
    let exists;
    const { query, pathname: uri } = url.parse(req.url, true);
    switch (uri) {
      case "/":
        let html = fs.readFileSync("index.html");
        html = html
          .toString()
          .replace(/{{MAPS_API_KEY}}/g, process.env.GOOGLE_API_KEY)
          .replace(/{{WEATHER_API_KEY}}/g, process.env.OPEN_WEATHER_API_KEY)
          .replace(/{{GEO_CODING_API_KEY}}/g, process.env.GEO_CODING_API_KEY);
        res.end(html);
        break;
      default:
        let filename = path.join(__dirname, uri);
        exists = fs.existsSync(filename);

        if (!exists) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
          return;
        }

        let type = content_types[path.extname(filename).split(".")[1]];
        res.writeHead(200, type);

        res.end(fs.readFileSync(filename));
        break;
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 Internal server Error '" + error.message + "'");
  }
});

deleteFolderRecursive = (path) => {
  fs.readdirSync(path).forEach(function (file) {
    var curPath = path + "/" + file;
    if (fs.lstatSync(curPath).isDirectory()) {
      deleteFolderRecursive(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  });
  fs.rmdirSync(path);
};

server.listen(port);

console.log(`App is running on http://localhost:${port}`);
