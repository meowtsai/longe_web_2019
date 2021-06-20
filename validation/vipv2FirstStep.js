const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateFirstStepInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.userPhone = !isEmpty(data.userPhone) ? data.userPhone : "";
  data.serverId = !isEmpty(data.serverId) ? data.serverId : "";
  data.roleId = !isEmpty(data.roleId) ? data.roleId : "";
  data.charName = !isEmpty(data.charName) ? data.charName : "";

  if (isEmpty(data.roleId)) {
    errors.roleId = "角色id 為必填。";
  }
  if (isEmpty(data.charName)) {
    errors.charName = "角色名稱 為必填。";
  }
  if (isEmpty(data.email)) {
    errors.email = "Email 為必填。";
  }
  if (isEmpty(data.userPhone)) {
    errors.userPhone = "手機為必填。";
  }
  if (!isEmpty(data.email)) {
    if (!Validator.isEmail(data.email)) {
      errors.email = "Email 格式不正確。";
    }
  }

  if (
    !Validator.isMobilePhone(data.userPhone, ["zh-TW"], {
      strictMode: false,
    })
  ) {
    //console.log(data.phone);
    errors.userPhone = "目前僅可輸入台灣手機。";
  }

  if (isEmpty(data.serverId)) {
    errors.serverId = "請選擇伺服器。";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
