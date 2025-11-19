const express = require("express");
const router = express.Router();
const HeroSlide = require("../models/HeroSlide");
const cloudinary = require("../utils/cloudinary");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const slides = await HeroSlide.find().sort({ createdAt: -1 });
  res.json(slides);
});

router.post("/", auth, async (req, res) => {
  const { title, subtitle, buttonText, buttonLink, image } = req.body;
  const slide = new HeroSlide({ title, subtitle, buttonText, buttonLink, image });
  await slide.save();
  res.json(slide);
});

router.put("/:id", auth, async (req, res) => {
  const { title, subtitle, buttonText, buttonLink, image } = req.body;
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) return res.status(404).json({ message: "Not found" });
  if (slide.image?.public_id && image?.public_id !== slide.image.public_id) {
    await cloudinary.uploader.destroy(slide.image.public_id);
  }
  slide.title = title;
  slide.subtitle = subtitle;
  slide.buttonText = buttonText;
  slide.buttonLink = buttonLink;
  slide.image = image;
  await slide.save();
  res.json(slide);
});

router.delete("/:id", auth, async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) return res.status(404).json({ message: "Not found" });
  if (slide.image?.public_id) await cloudinary.uploader.destroy(slide.image.public_id);
  await HeroSlide.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
