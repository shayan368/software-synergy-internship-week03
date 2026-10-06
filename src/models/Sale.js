const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
      index: true
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"]
    },

    revenue: {
      type: Number,
      required: [true, "Revenue is required"],
      min: [0, "Revenue cannot be negative"]
    },

    region: {
      type: String,
      required: [true, "Region is required"],
      trim: true,
      minlength: [2, "Region must be at least 2 characters"],
      index: true
    },

    customer: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: [2, "Customer name must be at least 2 characters"]
    },

    saleDate: {
      type: Date,
      required: [true, "Sale date is required"],
      index: true
    }
  },
   {
    timestamps: true
  }
);

saleSchema.index({ saleDate: -1, region: 1 });
saleSchema.index({ region: 1, saleDate: -1 });
saleSchema.index({ product: 1, saleDate: -1 });

module.exports = mongoose.model("Sale", saleSchema);