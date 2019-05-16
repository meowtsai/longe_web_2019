const path = require("path");

const isImage = file => {
  //console.log("isImage", file);
  const extension = path.extname(file.name).toLowerCase();
  const mimeTypeSimple = /^(image)\/[a-zA-Z0-9\.\-\+]{1,100}$/i; // eslint-disable-line max-len

  return (
    mimeTypeSimple.test(file.mimetype) &&
    (extension == ".jpg" ||
      extension == ".jpeg" ||
      extension == ".jpe" ||
      extension == ".gif" ||
      extension == ".png" ||
      extension == ".bmp")
  );
};

module.exports = isImage;
