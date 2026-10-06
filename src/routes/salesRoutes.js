const express = require("express");

const {
  getSales,
  getSaleById,
  getSalesSummary
} = require("../controllers/salesController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", protect, getSalesSummary);
router.get("/", protect, getSales);
router.get("/:id", protect, getSaleById);

module.exports = router;