const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const { verifyToken, verifyAdmin } = require("../middleware/auth.middleware");

// ✅ ADMIN: Add product
router.post("/", verifyToken, verifyAdmin, productController.createProduct);
// ✅ PUBLIC: Get all products
router.get("/", productController.getProducts);

// ✅ PUBLIC: Category products
router.get("/category/:category", productController.getCategoryProducts);

// ✅ HEALTH (must come before /:id)
router.get("/health", (req,res)=>res.send("OK"));

// ✅ PUBLIC: Single product
router.get("/:id", productController.getProductById);

module.exports = router;
