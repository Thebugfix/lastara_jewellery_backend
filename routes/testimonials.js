const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const cloudinary = require("../utils/cloudinary");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const list = await Testimonial.find().sort({ createdAt: -1 });
  res.json(list);
});

router.post("/", auth, async (req, res) => {
  const { name, message, image } = req.body;
  const t = new Testimonial({ name, message, image });
  await t.save();
  res.json(t);
});

router.delete("/:id", auth, async (req, res) => {
  const t = await Testimonial.findById(req.params.id);
  if (!t) return res.status(404).json({ message: "Not found" });
  if (t.image?.public_id) await cloudinary.uploader.destroy(t.image.public_id);
  await t.remove();
  res.json({ message: "Deleted" });
});

module.exports = router;
