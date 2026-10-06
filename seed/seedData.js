const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Product = require("../src/models/Product");
const Sale = require("../src/models/Sale");

dotenv.config();

const products = [
  {
    name: "Laptop Pro",
    category: "Electronics",
    price: 1200,
    stock: 50
  },
  {
    name: "Wireless Headphones",
    category: "Electronics",
    price: 150,
    stock: 100
  },
  {
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 90,
    stock: 75
  },
  {
    name: "Office Chair",
    category: "Furniture",
    price: 250,
    stock: 40
  },
  {
    name: "Standing Desk",
    category: "Furniture",
    price: 450,
    stock: 25
  },
  {
    name: "Notebook Set",
    category: "Stationery",
    price: 25,
    stock: 200
  },
  {
    name: "Premium Backpack",
    category: "Accessories",
    price: 80,
    stock: 80
  },
  {
    name: "Smart Watch",
    category: "Electronics",
    price: 300,
    stock: 60
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    await Product.deleteMany();
    await Sale.deleteMany();

    const createdProducts = await Product.insertMany(products);

    const productMap = {};

    createdProducts.forEach((product) => {
      productMap[product.name] = product._id;
    });

    const sales = [
      {
        product: productMap["Laptop Pro"],
        quantity: 2,
        revenue: 2400,
        region: "North",
        customer: "Ali Khan",
        saleDate: new Date("2026-01-15")
      },
      {
        product: productMap["Wireless Headphones"],
        quantity: 5,
        revenue: 750,
        region: "South",
        customer: "Ahmed Raza",
        saleDate: new Date("2026-01-22")
      },
      {
        product: productMap["Office Chair"],
        quantity: 3,
        revenue: 750,
        region: "East",
        customer: "Sara Ahmed",
        saleDate: new Date("2026-02-10")
      },
      {
        product: productMap["Standing Desk"],
        quantity: 2,
        revenue: 900,
        region: "West",
        customer: "Usman Ali",
        saleDate: new Date("2026-02-18")
      },
      {
        product: productMap["Smart Watch"],
        quantity: 4,
        revenue: 1200,
        region: "North",
        customer: "Hamza Khan",
        saleDate: new Date("2026-03-05")
      },
      {
        product: productMap["Premium Backpack"],
        quantity: 6,
        revenue: 480,
        region: "South",
        customer: "Ayesha Malik",
        saleDate: new Date("2026-03-20")
      },
      {
        product: productMap["Mechanical Keyboard"],
        quantity: 8,
        revenue: 720,
        region: "East",
        customer: "Bilal Ahmed",
        saleDate: new Date("2026-04-12")
      },
      {
        product: productMap["Notebook Set"],
        quantity: 20,
        revenue: 500,
        region: "West",
        customer: "Fatima Noor",
        saleDate: new Date("2026-04-25")
      },
      {
        product: productMap["Laptop Pro"],
        quantity: 3,
        revenue: 3600,
        region: "South",
        customer: "Zain Shah",
        saleDate: new Date("2026-05-08")
      },
      {
        product: productMap["Smart Watch"],
        quantity: 5,
        revenue: 1500,
        region: "East",
        customer: "Maryam Khan",
        saleDate: new Date("2026-05-21")
      },
      {
        product: productMap["Office Chair"],
        quantity: 4,
        revenue: 1000,
        region: "North",
        customer: "Omar Farooq",
        saleDate: new Date("2026-06-11")
      },
      {
        product: productMap["Wireless Headphones"],
        quantity: 10,
        revenue: 1500,
        region: "West",
        customer: "Hassan Ali",
        saleDate: new Date("2026-06-29")
      }
    ];

    await Sale.insertMany(sales);

    console.log("Products seeded:", createdProducts.length);
    console.log("Sales seeded:", sales.length);
    console.log("Database seeding completed successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();