const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateDeliverooInput(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : '';
  data.char_id = !isEmpty(data.char_id) ? data.char_id : '';
  data.server_name = !isEmpty(data.server_name) ? data.server_name : '';
  data.character_name = !isEmpty(data.character_name)
    ? data.character_name
    : '';
  data.serial_no = !isEmpty(data.serial_no) ? data.serial_no : '';

  if (isEmpty(data.email)) {
    errors.email = 'Email 為必填。';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email 格式不正確。';
  }

  if (isEmpty(data.character_name)) {
    errors.character_name = '角色名稱為必填。';
  }

  if (isEmpty(data.char_id)) {
    errors.char_id = '人物帳號ID為必填。';
  }

  if (isEmpty(data.server_name)) {
    errors.server_name = '請選擇伺服器。';
  }

  if (isEmpty(data.serial_no)) {
    errors.serial_no = '序號 為必填。';
  } else if (!Validator.isLength(data.serial_no, { min: 8, max: 12 })) {
    errors.serial_no = '序號錯誤。';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
