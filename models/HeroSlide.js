const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  buttonText: String,
  buttonLink: String,
  image: { url: String, public_id: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("HeroSlide", heroSlideSchema);
