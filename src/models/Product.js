const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"]
    },

    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);