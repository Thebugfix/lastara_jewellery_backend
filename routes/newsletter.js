const express = require("express");
const router = express.Router();
const Newsletter = require("../models/Newsletter");
const auth = require("../middleware/auth");
const verifyRecaptcha = require("../utils/verifyRecapcha");

// Subscribe to newsletter (Public)
router.post("/", async (req, res) => {
  const { phone, recaptchaToken } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone is required" });
  }

  try {
    // Verify reCAPTCHA
    if (recaptchaToken) {
      const recaptchaResult = await verifyRecaptcha(recaptchaToken);

      if (!recaptchaResult.success) {
        return res.status(400).json({ 
          message: "reCAPTCHA verification failed. Please try again.",
          error: recaptchaResult.error 
        });
      }

      // Check reCAPTCHA score (v3 returns score from 0.0 to 1.0)
      // 0.5 is recommended threshold - adjust based on your needs
      if (recaptchaResult.score < 0.5) {
        console.warn(`Low reCAPTCHA score: ${recaptchaResult.score} for phone: ${phone}`);
        return res.status(400).json({ 
          message: "Suspicious activity detected. Please try again later." 
        });
      }

      // Verify action name matches
      if (recaptchaResult.action !== 'newsletter_subscribe') {
        return res.status(400).json({ 
          message: "Invalid reCAPTCHA action" 
        });
      }

      console.log(`reCAPTCHA verified - Score: ${recaptchaResult.score}`);
    }

    // Create newsletter subscription
    const newsletter = new Newsletter({ phone });
    await newsletter.save();

    res.json({ message: "Subscribed successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already subscribed" });
    }
    console.error('Newsletter subscription error:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all newsletter subscribers (Admin only)
router.get("/", auth, async (req, res) => {
  try {
    const list = await Newsletter.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete newsletter subscriber (Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    await subscriber.remove();
    res.json({ message: "Subscriber deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;