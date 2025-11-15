require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/product");
const heroRoutes = require("./routes/heroSlides");
const heroVideoRoutes = require("./routes/heroVideo");
const testimonialRoutes = require("./routes/testimonials");
const newsletterRoutes = require("./routes/newsletter");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/uploads");

const app = express();
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

connectDB(process.env.MONGO_URI);

app.use("/api/products", productRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/heroVideo", heroVideoRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);

app.get("/", (req, res) => res.send("Lastara Backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

// export for vecel deployment
module.exports = app;