const mongoose = require("mongoose");
const Sale = require("../models/Sale");

const {
  getCache,
  setCache
} = require("../utils/cache");

// GET /api/sales
const getSales = async (req, res) => {
  try {
    const {
      search,
      region,
      category,
      startDate,
      endDate,
      sortBy = "saleDate",
      order = "desc",
      page = 1,
      limit = 10
    } = req.query;

    // -----------------------------
    // Pagination
    // -----------------------------
    const currentPage = Math.max(parseInt(page) || 1, 1);

    const itemsPerPage = Math.min(
      Math.max(parseInt(limit) || 10, 1),
      100
    );

    const skip = (currentPage - 1) * itemsPerPage;

    // -----------------------------
    // Build aggregation pipeline
    // -----------------------------
  const pipeline = [];

const saleMatch = {};

if (region) {
  saleMatch.region = region;
}

if (startDate || endDate) {
  saleMatch.saleDate = {};

  if (startDate) {
    const parsedStartDate = new Date(startDate);

    if (isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid startDate",
        data: null
      });
    }

    saleMatch.saleDate.$gte = parsedStartDate;
  }

  if (endDate) {
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid endDate",
        data: null
      });
    }

    parsedEndDate.setHours(23, 59, 59, 999);

    saleMatch.saleDate.$lte = parsedEndDate;
  }
}

if (Object.keys(saleMatch).length > 0) {
  pipeline.push({
    $match: saleMatch
  });
}

pipeline.push({
  $lookup: {
    from: "products",
    localField: "product",
    foreignField: "_id",
    as: "product"
  }
});

pipeline.push({
  $unwind: "$product"
});

    if (region) {
      match.region = region;
    }

    if (category) {
      match["product.category"] = category;
    }

    // Date filtering
    if (startDate || endDate) {
      match.saleDate = {};

      if (startDate) {
        const parsedStartDate = new Date(startDate);

        if (isNaN(parsedStartDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid startDate",
            data: null
          });
        }

        match.saleDate.$gte = parsedStartDate;
      }

      if (endDate) {
        const parsedEndDate = new Date(endDate);

        if (isNaN(parsedEndDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid endDate",
            data: null
          });
        }

        // Include the entire end date
        parsedEndDate.setHours(23, 59, 59, 999);

        match.saleDate.$lte = parsedEndDate;
      }
    }

    // Search customer or product name
    if (search) {
      match.$or = [
        {
          customer: {
            $regex: search,
            $options: "i"
          }
        },
        {
          "product.name": {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    if (Object.keys(match).length > 0) {
      pipeline.push({
        $match: match
      });
    }

    // -----------------------------
    // Sorting
    // -----------------------------
    const allowedSortFields = {
      revenue: "revenue",
      quantity: "quantity",
      saleDate: "saleDate",
      customer: "customer",
      product: "product.name"
    };

    const selectedSortField =
      allowedSortFields[sortBy] || "saleDate";

    const sortOrder = order === "asc" ? 1 : -1;

    pipeline.push({
      $sort: {
        [selectedSortField]: sortOrder
      }
    });

    // -----------------------------
    // Count matching documents
    // -----------------------------
    const countPipeline = [...pipeline];

    countPipeline.push({
      $count: "total"
    });

    const countResult = await Sale.aggregate(countPipeline);

    const total = countResult.length > 0
      ? countResult[0].total
      : 0;

    // -----------------------------
    // Pagination
    // -----------------------------
    pipeline.push({
      $skip: skip
    });

    pipeline.push({
      $limit: itemsPerPage
    });

    // -----------------------------
    // Shape response
    // -----------------------------
    pipeline.push({
      $project: {
        _id: 1,
        quantity: 1,
        revenue: 1,
        region: 1,
        customer: 1,
        saleDate: 1,
        product: {
          id: "$product._id",
          name: "$product.name",
          category: "$product.category",
          price: "$product.price"
        }
      }
    });

    const sales = await Sale.aggregate(pipeline);

    const totalPages = Math.ceil(total / itemsPerPage);

    return res.status(200).json({
      success: true,
      message: "Sales retrieved successfully",
      data: sales,
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error("Get sales error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve sales",
      data: null
    });
  }
};


// GET /api/sales/:id
const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sale ID",
        data: null
      });
    }

    const sales = await Sale.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id)
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: "$product"
      },
      {
        $project: {
          _id: 1,
          quantity: 1,
          revenue: 1,
          region: 1,
          customer: 1,
          saleDate: 1,
          product: {
            id: "$product._id",
            name: "$product.name",
            category: "$product.category",
            price: "$product.price"
          }
        }
      }
    ]);

    if (sales.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sale retrieved successfully",
      data: sales[0]
    });
  } catch (error) {
    console.error("Get sale error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve sale",
      data: null
    });
  }
};


// GET /api/sales/summary
const getSalesSummary = async (req, res) => {
  try {
    const cacheKey = "sales:summary";

const cachedData = getCache(cacheKey);

if (cachedData) {
  res.set("X-Cache", "HIT");

  return res.status(200).json({
    success: true,
    message: "Sales summary retrieved successfully",
    data: cachedData
  });
}

res.set("X-Cache", "MISS");

    const summary = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$revenue"
          },
          totalQuantity: {
            $sum: "$quantity"
          },
          totalSales: {
            $sum: 1
          },
          averageRevenue: {
            $avg: "$revenue"
          }
        }
      }
    ]);

    const result = summary[0] || {
      totalRevenue: 0,
      totalQuantity: 0,
      totalSales: 0,
      averageRevenue: 0
    };

   const responseData = {
  totalRevenue: result.totalRevenue,
  totalQuantity: result.totalQuantity,
  totalSales: result.totalSales,
  averageRevenue: Number(result.averageRevenue.toFixed(2))
};

setCache(cacheKey, responseData);

return res.status(200).json({
  success: true,
  message: "Sales summary retrieved successfully",
  data: responseData
});
  } catch (error) {
    console.error("Sales summary error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve sales summary",
      data: null
    });
  }
};


module.exports = {
  getSales,
  getSaleById,
  getSalesSummary
};