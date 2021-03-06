const express = require("express");
const path = require("path");
var logger = require("morgan");
var rfs = require("rotating-file-stream");
const fileUpload = require("express-fileupload");
const games = require("./routes/api/games");
const service = require("./routes/api/service");
const questions = require("./routes/api/questions");
const upload = require("./routes/api/upload");
const events = require("./routes/api/events");
const vip = require("./routes/api/vip");
const vipv2 = require("./routes/api/vipv2");

const CONFIG = require("./config/config")[process.env.NODE_ENV];
const requestIp = require("request-ip");
const helmet = require("helmet");
// default options
// create a rotating write stream
var accessLogStream = rfs("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});
const app = express();
app.set("trust proxy", true);
app.use(logger("combined", { stream: accessLogStream }));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "檔案太大",
    limitHandler: function (req, res, next) {
      //console.log("hi");
      return res.status(413).send({ file01: "檔案太大" });
    },
  })
);

app.use(express.json());
app.use(requestIp.mw());

app.use(helmet());
// Add headers
app.use(function (req, res, next) {
  
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://www.identity-v.com');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
//check if ip is in whitelist
app.use(function (req, res, next) {
  const white_list = require("./config/config").white_list;
  const found = white_list.find((item) => item.ip === req.clientIp);
  //console.log("req.clientIp", req.clientIp);
  if (found) {
    req.whitelisted = true;
  } else {
    req.whitelisted = false;
  }
  //console.log("req.whitelisted", req.whitelisted);
  next();
});

app.use("/api/games", games);
app.use("/api/service", service);
app.use("/api/events", events);
app.use("/api/questions", questions);
app.use("/api/upload", upload);
app.use("/api/vip", vip);
app.use("/api/vipv2", vipv2);
app.use("/uploads", express.static("client/public/uploads"));

//serve static build (client)
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "stage") {
  //set static folder
  app.use(express.static("client/live"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "live", "index.html"));
  });
}

const port = CONFIG.port || 5000;

let server;
if (app.get("env") !== "production") {
  var http = require("http");

  server = http.createServer(app);
} else {
  var fs = require("fs");
  const https = require("https");
  var options = {
    key: fs.readFileSync(CONFIG.ssl_options.keyfile),
    cert: fs.readFileSync(CONFIG.ssl_options.certfile),
    ca: [fs.readFileSync(CONFIG.ssl_options.cafile)],
  };

  server = https.createServer(options, app);
}

// server.listen(port, "0.0.0.0", function() {
//   console.log("server env :" + app.get("env"));
//   console.log("server is listening on:" + port);
// });

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});