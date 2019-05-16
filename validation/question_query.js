const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateQuestionQueryInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.mobile = !isEmpty(data.mobile) ? data.mobile : "";
  data.check_id = !isEmpty(data.check_id) ? data.check_id : "";

  if (isEmpty(data.email) && isEmpty(data.mobile)) {
    errors.email = "Email 或手機必須擇一填寫。";
  }
  if (isEmpty(data.check_id)) {
    errors.check_id = "客服代碼欄位為必填。";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
