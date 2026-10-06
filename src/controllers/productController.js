const Product = require("../models/Product");

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i"
      };
    }

    if (category) {
      filter.category = category;
    }

    // Validate pagination
    const currentPage = Math.max(parseInt(page) || 1, 1);
    const itemsPerPage = Math.min(
      Math.max(parseInt(limit) || 10, 1),
      100
    );

    const skip = (currentPage - 1) * itemsPerPage;

    // Validate sorting
    const allowedSortFields = [
      "name",
      "category",
      "price",
      "stock",
      "createdAt"
    ];

    const selectedSortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    const sort = {
      [selectedSortField]: sortOrder
    };

    // Get total count
    const total = await Product.countDocuments(filter);

    // Get products
const products = await Product.find(filter)
  .select("name category price stock createdAt updatedAt")
  .sort(sort)
  .skip(skip)
  .limit(itemsPerPage)
  .lean();

    const totalPages = Math.ceil(total / itemsPerPage);

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error("Get products error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      data: null
    });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product
    });
  } catch (error) {
    console.error("Get product error:", error.message);

    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
      data: null
    });
  }
};

module.exports = {
  getProducts,
  getProductById
};