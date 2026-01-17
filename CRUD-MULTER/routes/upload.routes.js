const express = require("express");
const upload = require("../config/multer.config");

const router = express.Router();


router.post("/single", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    res.status(201).json({
      message: "Single image uploaded successfully",
      file: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/multiple", upload.array("images", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const filenames = req.files.map(file => file.filename);

    res.status(201).json({
      message: "Multiple images uploaded successfully",
      files: filenames
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
