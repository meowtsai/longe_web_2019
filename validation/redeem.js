const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRedeemInput(data) {
  let errors = {};

  data.serial_no = !isEmpty(data.serial_no) ? data.serial_no : "";

  if (isEmpty(data.serial_no)) {
    errors.serial_no = "序號 為必填。";
  } else if (!Validator.isLength(data.serial_no, { min: 8, max: 12 })) {
    errors.serial_no = "序號錯誤。";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
