const Validator = require("validator");
const isEmpty = require("./is-empty");
const isImage = require("./is-image");
module.exports = function validateReplyInput(data) {
  let errors = {};

  data.content = !isEmpty(data.content) ? data.content : "";
  data.files = !isEmpty(data.files) ? data.files : {};
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
