const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateVipOrderInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.userPhone = !isEmpty(data.userPhone) ? data.userPhone : "";
  data.wireCode = !isEmpty(data.wireCode) ? data.wireCode : "";
  data.wireTime = !isEmpty(data.wireTime) ? data.wireTime : "";
  data.wireAmount = !isEmpty(data.wireAmount) ? data.wireAmount : "";
  data.wireName = !isEmpty(data.wireName) ? data.wireName : "";
  data.bankName = !isEmpty(data.bankName) ? data.bankName : "";
  data.charName = !isEmpty(data.charName) ? data.charName : "";
  data.roleId = !isEmpty(data.roleId) ? data.roleId : "";
  data.serverId = !isEmpty(data.serverId) ? data.serverId : "";

  if (isEmpty(data.userPhone)) {
    errors.userPhone = "手機為必填。";
  }
  if (isEmpty(data.email)) {
    errors.email = "Email 為填寫。";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email 格式不正確。";
  }
  if (isEmpty(data.wireCode)) {
    errors.wireCode = "匯款帳號後五碼為必填。";
  }

  if (isEmpty(data.wireTime)) {
    errors.wireTime = "匯款時間為必填。";
  }
  if (isEmpty(data.wireAmount)) {
    errors.wireAmount = "匯款金額為必填。";
  }

  if (isEmpty(data.wireName)) {
    errors.wireName = "匯款戶名為必填。";
  }

  if (isEmpty(data.bankName)) {
    errors.bankName = "銀行名稱為必填。";
  }

  if (isEmpty(data.charName)) {
    errors.charName = "角色名稱為必填。";
  }

  if (isEmpty(data.roleId)) {
    errors.roleId = "人物帳號ID為必填。";
  }

  if (isEmpty(data.serverId)) {
    errors.serverId = "請選擇伺服器。";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
