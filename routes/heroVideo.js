// routes/heroVideo.js
const express = require("express");
const router = express.Router();
const HeroVideo = require("../models/HeroVideo");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const auth = require("../middleware/auth");

// Upload new hero video
router.post("/", auth, upload.single("video"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "lastara_hero_videos",
      resource_type: "video",
    });
    fs.unlinkSync(req.file.path);
    const heroVideo = new HeroVideo({
      title: req.body.title,
      video: { public_id: result.public_id, url: result.secure_url },
      isActive: req.body.isActive !== "false",
    });
    await heroVideo.save();
    res.json(heroVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Video upload failed" });
  }
});

// Get active hero video
router.get("/active", async (req, res) => {
  const video = await HeroVideo.getActiveVideo();
  res.json(video || null);
});

module.exports = router;
