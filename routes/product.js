const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");

router.get("/", productController.getProducts);
// Get single product by id
router.get("/:id", productController.getProduct);
router.get("/slug/:slug", productController.getProductBySlug);
router.post("/", auth, productController.createProduct);
router.put("/:id", auth, productController.updateProduct);
router.delete("/:id", auth, productController.deleteProduct);

module.exports = router;
