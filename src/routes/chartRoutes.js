const express = require("express");

const {
  getMonthlySales,
  getCategorySales,
  getRegionSales,
  getTopProducts
} = require("../controllers/chartController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/monthly-sales", protect, getMonthlySales);
router.get("/category-sales", protect, getCategorySales);
router.get("/region-sales", protect, getRegionSales);
router.get("/top-products", protect, getTopProducts);

module.exports = router;