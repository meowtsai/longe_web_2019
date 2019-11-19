const Validator = require("validator");
const isEmpty = require("./is-empty");
const isImage = require("./is-image");
const VerifyRecaptcha = require("./robot-check");
module.exports = function validateReplyInput(data) {
  let errors = {};
  data.captcha_token = !isEmpty(data.captcha_token) ? data.captcha_token : "";

  data.captcha_token = !isEmpty(data.captcha_token) ? data.captcha_token : "";
  data.content = !isEmpty(data.content) ? data.content : "";
  data.files = !isEmpty(data.files) ? data.files : {};
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

  if (!Validator.isLength(data.content, { min: 5, max: 500 })) {
    errors.content = "提問內容必須在5~500字內.";
  }

  if (isEmpty(data.content)) {
    errors.content = "請填寫提問事項。";
  }
  if (Object.keys(data.files).length > 3) {
    errors.file01 = "上傳檔案請勿超過3個。";
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
