const express = require("express");
const fileUpload = require("express-fileupload");
const games = require("./routes/api/games");
const service = require("./routes/api/service");
const questions = require("./routes/api/questions");
const upload = require("./routes/api/upload");
const CONFIG = require("../config/config")[process.env.NODE_ENV];
const requestIp = require("request-ip");
// default options

const app = express();

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "檔案太大",
    limitHandler: function(req, res, next) {
      //console.log("hi");
      return res.status(413).send({ file01: "檔案太大" });
    }
  })
);

app.use(express.json());
app.use(requestIp.mw());

app.use("/api/games", games);
app.use("/api/service", service);
app.use("/api/questions", questions);
app.use("/api/upload", upload);

const port = CONFIG.port || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
