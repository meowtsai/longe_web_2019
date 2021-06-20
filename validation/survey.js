const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSurveyInput(data) {
  let errors = {};
  data.roleId = !isEmpty(data.roleId) ? data.roleId : "";
  data.accountId = !isEmpty(data.accountId) ? data.accountId : "";

  if (isEmpty(data.roleId)) {
    errors.roleId = "角色id 為必填。";
  } else if (!Validator.isLength(data.roleId, { min: 6, max: 8 })) {
    errors.roleId = "角色id 長度錯誤。";
  }

  if (isEmpty(data.accountId)) {
    errors.accountId = "帳號ID 為必填。";
  } else if (!Validator.isLength(data.accountId, { min: 9, max: 9 })) {
    errors.accountId = "帳號ID 長度錯誤。";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
