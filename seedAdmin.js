require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AdminUser = require("./models/AdminUser");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const name = "Lastara Admin";
    const email = "sahil0022h@gmail.com";
    const password = "Lastara@8956admin";

    const exists = await AdminUser.findOne({ email });
    if (exists) {
      console.log("✅ Admin already exists:", email);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = new AdminUser({ name, email, passwordHash });
    await admin.save();

    console.log("✅ Admin seeded successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
})();
