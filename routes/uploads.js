const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const auth = require("../middleware/auth");

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });

    // 👇 Automatically detect file type
    const isVideo = req.file.mimetype.startsWith("video");
    const folderName = isVideo ? "lastara_videos" : "lastara_products";

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName,
      resource_type: isVideo ? "video" : "image",
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      type: isVideo ? "video" : "image",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
