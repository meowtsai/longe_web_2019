const axios = require("axios");
const querystring = require("querystring");
const recaptcha_key = require("../config/service").recaptcha_key;
const ggl_recaptcha_validate =
  "https://www.google.com/recaptcha/api/siteverify";

module.exports = async function VerifyRecaptcha(token, ip) {
  const post_data = querystring.stringify({
    secret: recaptcha_key,
    response: token,
    remoteip: ip
  });
  const response = await axios.post(ggl_recaptcha_validate, post_data);
  //console.log("VerifyRecaptcha", response.data);
  if (!response.data.success) {
    //console.log("not validate");
    return false;
  } else {
    //console.log("validated");
    return true;
  }
};

// $server_output ='{"success": false, "error-codes":["invalid-input-response"]}';
// $server_output ='{ "success": true, "challenge_ts": "2019-05-24T07:56:36Z", "hostname": "test-payment.longeplay.com.tw" }';
