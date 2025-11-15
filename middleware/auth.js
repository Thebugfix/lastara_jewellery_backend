const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token" });
    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Malformed token" });
    const payload = jwt.verify(token, JWT_SECRET);
    const admin = await AdminUser.findById(payload.id).select("-passwordHash");
    if (!admin) return res.status(401).json({ message: "Invalid token" });
    req.admin = admin;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = authMiddleware;
