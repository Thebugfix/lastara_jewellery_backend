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

// Delete hero video
router.delete("/:id", auth, async (req, res) => {
  try {
    const video = await HeroVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    
    // Delete video from Cloudinary
    if (video.public_id) {
      await cloudinary.uploader.destroy(video.public_id, {
        resource_type: "video",
      });
    }
    
    // Delete from database
    await HeroVideo.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({ message: "Failed to delete video" });
  }
});

module.exports = router;
