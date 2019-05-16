const SERVICE_CONFIG = require("../config/service");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  //console.log("auth", req.header("x-auth-token"));
  let errors = {};
  //check for token
  if (!token) res.status(401).json({ errors: "Authorization denied" });

  try {
    const decoded = jwt.verify(token, SERVICE_CONFIG.jwt_encryption);
    //console.log(decoded);
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    errors.jwt = e.message;
    res.status(400).json({ errors });
  }
}

module.exports = auth;
