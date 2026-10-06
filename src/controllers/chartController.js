const Sale = require("../models/Sale");

const { getCache, setCache } = require("../utils/cache");

// GET /api/charts/monthly-sales
const getMonthlySales = async (req, res) => {
  try {
    const cacheKey = "charts:monthly-sales";

    const cachedData = getCache(cacheKey);

    if (cachedData) {
      res.set("X-Cache", "HIT");

      return res.status(200).json({
        success: true,
        message: "Monthly sales retrieved successfully",
        data: cachedData,
      });
    }

    res.set("X-Cache", "MISS");

    const monthlySales = await Sale.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$saleDate" },
            month: { $month: "$saleDate" },
          },
          revenue: {
            $sum: "$revenue",
          },
          quantity: {
            $sum: "$quantity",
          },
          sales: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          monthNumber: "$_id.month",
          revenue: 1,
          quantity: 1,
          sales: 1,
        },
      },
    ]);

    setCache(cacheKey, monthlySales);

    return res.status(200).json({
      success: true,
      message: "Monthly sales retrieved successfully",
      data: monthlySales,
    });
  } catch (error) {
    console.error("Monthly sales error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve monthly sales",
      data: null,
    });
  }
};

// GET /api/charts/category-sales
const getCategorySales = async (req, res) => {
  try {
    const cacheKey = "charts:category-sales";

const cachedData = getCache(cacheKey);

if (cachedData) {
  res.set("X-Cache", "HIT");

  return res.status(200).json({
    success: true,
    message: "Category sales retrieved successfully",
    data: cachedData
  });
}

res.set("X-Cache", "MISS");
    const categorySales = await Sale.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $group: {
          _id: "$product.category",
          revenue: {
            $sum: "$revenue",
          },
          quantity: {
            $sum: "$quantity",
          },
          sales: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          revenue: -1,
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          revenue: 1,
          quantity: 1,
          sales: 1,
        },
      },
    ]);

  setCache(cacheKey, categorySales);

return res.status(200).json({
  success: true,
  message: "Category sales retrieved successfully",
  data: categorySales
});


  } catch (error) {
    console.error("Category sales error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve category sales",
      data: null,
    });
  }
};

// GET /api/charts/region-sales
const getRegionSales = async (req, res) => {
  try {

    const cacheKey = "charts:region-sales";

const cachedData = getCache(cacheKey);

if (cachedData) {
  res.set("X-Cache", "HIT");

  return res.status(200).json({
    success: true,
    message: "Region sales retrieved successfully",
    data: cachedData
  });
}

res.set("X-Cache", "MISS");

    const regionSales = await Sale.aggregate([
      {
        $group: {
          _id: "$region",
          revenue: {
            $sum: "$revenue",
          },
          quantity: {
            $sum: "$quantity",
          },
          sales: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          revenue: -1,
        },
      },
      {
        $project: {
          _id: 0,
          region: "$_id",
          revenue: 1,
          quantity: 1,
          sales: 1,
        },
      },
    ]);

setCache(cacheKey, regionSales);

return res.status(200).json({
  success: true,
  message: "Region sales retrieved successfully",
  data: regionSales
});
  } catch (error) {
    console.error("Region sales error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve region sales",
      data: null,
    });
  }
};

// GET /api/charts/top-products
const getTopProducts = async (req, res) => {
  try {
const limit = Math.min(
  Math.max(parseInt(req.query.limit) || 5, 1),
  20
);

const cacheKey = `charts:top-products:${limit}`;

const cachedData = getCache(cacheKey);

if (cachedData) {
  res.set("X-Cache", "HIT");

  return res.status(200).json({
    success: true,
    message: "Top products retrieved successfully",
    data: cachedData
  });
}

res.set("X-Cache", "MISS");

    const topProducts = await Sale.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $group: {
          _id: "$product._id",
          productName: {
            $first: "$product.name",
          },
          category: {
            $first: "$product.category",
          },
          revenue: {
            $sum: "$revenue",
          },
          quantity: {
            $sum: "$quantity",
          },
          sales: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          revenue: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: 1,
          category: 1,
          revenue: 1,
          quantity: 1,
          sales: 1,
        },
      },
    ]);
setCache(cacheKey, topProducts);

return res.status(200).json({
  success: true,
  message: "Top products retrieved successfully",
  data: topProducts
});

  } catch (error) {
    console.error("Top products error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve top products",
      data: null,
    });
  }
};

module.exports = {
  getMonthlySales,
  getCategorySales,
  getRegionSales,
  getTopProducts,
};
