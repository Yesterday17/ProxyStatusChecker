const http = require("http");
const ping = require("./index.js");

let result = undefined;
let time = undefined;

const ip = process.env.SERVER_IP;
const tcports = process.env.TCP_RANGE;

const server = http.createServer(function(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (result && Date.now() - time < 60000) {
    res.end(result);
  } else {
    ping(ip, tcports, function(r) {
      result = JSON.stringify(r);
      time = Date.now();
      res.end(result);
    });
  }
});

server.listen(8080);
