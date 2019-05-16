const express = require("express");
const router = express.Router();

router.post("/test", (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file;
  //res.json({ files: req.files });

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(
    `${__dirname}/../../client/public/uploads/${sampleFile.name}`,
    err => {
      if (err) return res.status(500).send(err);
      res.json({
        filename: sampleFile.name,
        filepath: `/uploads/${sampleFile.name}`
      });
    }
  );
});

module.exports = router;
