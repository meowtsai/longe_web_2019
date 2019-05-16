const SERVICE_CONFIG = require("../config/service");
const jwt = require("jsonwebtoken");

function auth_for_create(req, res, next) {
  const token = req.header("x-auth-token");
  //console.log("auth token", token);
  if (!token) next();

  try {
    const decoded = jwt.verify(token, SERVICE_CONFIG.jwt_encryption);
    req.user = decoded;
    next();
  } catch (e) {
    next();
  }
}

module.exports = auth_for_create;
