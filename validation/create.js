const Validator = require("validator");
const isEmpty = require("./is-empty");
const isImage = require("./is-image");
const VerifyRecaptcha = require("./robot-check");

module.exports = function validateCreateWebInput(data) {
  let errors = {};

  data.captcha_token = !isEmpty(data.captcha_token) ? data.captcha_token : "";

  data.email = !isEmpty(data.email) ? data.email : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.content = !isEmpty(data.content) ? data.content : "";
  data.server_id = !isEmpty(data.server_id) ? data.server_id : "";
  data.question_type = !isEmpty(data.question_type) ? data.question_type : "";
  data.files = !isEmpty(data.files) ? data.files : {};

  data.partner_uid = !isEmpty(data.partner_uid) ? data.partner_uid : "";

  //console.log("data.useRecaptcha", data.useRecaptcha);

  //if (data.useRecaptcha !== "false") {
  if (isEmpty(data.captcha_token)) {
    errors.captcha_token = "你是機器人嗎?";
  } else {
    if (!VerifyRecaptcha(data.captcha_token, data.ip)) {
      //console.log("VerifyRecaptcha failed");
      errors.captcha_token = "你是機器人嗎?";
    }
  }
  //}

  if (isEmpty(data.email)) {
    errors.email = "Email 為必填。";
  }
  if (isEmpty(data.partner_uid)) {
    if (isEmpty(data.phone)) {
      errors.phone = "手機為必填。";
    }
    if (
      !Validator.isMobilePhone(
        data.phone,
        ["en-SG", "ms-MY", "zh-CN", "zh-HK", "zh-TW"],
        { strictMode: false }
      ) &&
      !isMacau(data.phone)
    ) {
      //console.log(data.phone);
      errors.phone = "僅可輸入新馬港澳台手機。";
    }
  }

  if (!isEmpty(data.email)) {
    if (!Validator.isEmail(data.email)) {
      errors.email = "Email 格式不正確。";
    }
  }

  if (isEmpty(data.server_id)) {
    errors.server_id = "請選擇伺服器。";
  }

  if (data.got_char !== "no" && isEmpty(data.character_name)) {
    errors.character_name = "請提供角色名稱方便作業。";
  }

  if (isEmpty(data.question_type)) {
    errors.question_type = "請選擇提問類型。";
  }
  if (isEmpty(data.content)) {
    errors.content = "問題描述 為必填。";
  }
  if (Object.keys(data.files).length > 6) {
    errors.file01 = "上傳檔案請勿超過6個。";
  }

  if (Object.keys(data.files).length > 0) {
    //console.log("validation", data.files);
    const errorFiles = Object.keys(data.files)
      .filter(fileKey => !isImage(data.files[fileKey]))
      .map(fileKey => data.files[fileKey].name);
    //console.log("efl", errorFiles);
    if (errorFiles.length > 0) {
      errors.file01 = `上傳檔案僅限圖檔(請移除:${errorFiles.join(",")})。`;
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

function isMacau(phone) {
  ///\bter\b/.test("interest")
  const re = new RegExp(/^(\+?853\-?)?[6][0-9]{7}/);
  if (re.test(phone)) {
    return true;
  }
  return false;
}
