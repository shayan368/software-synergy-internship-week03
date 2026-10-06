# Sales Analytics API

A RESTful backend API for a sales analytics and data visualization system.

The project provides authenticated APIs for products, sales, analytics summaries, and chart-ready data. It uses MongoDB for data storage and MongoDB aggregation pipelines for analytics processing.

## Features

* User registration and login
* JWT authentication
* Password hashing with bcrypt
* Product API
* Sales API
* Product search
* Sales search
* Filtering by category and region
* Date-range filtering
* Sorting
* Pagination
* Sales summary/KPI endpoint
* Monthly sales analytics
* Category-wise sales analytics
* Region-wise sales analytics
* Top-products analytics
* MongoDB aggregation pipelines
* MongoDB indexes
* In-memory response caching
* Cache HIT/MISS headers
* Request validation
* Consistent JSON responses
* Centralized error handling
* 404 route handling
* CORS support

---

# Technology Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JSON Web Token (JWT)
* bcryptjs
* CORS
* Nodemon

---

# Project Structure

```text
sales-analytics-api/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── salesController.js
│   │   └── chartController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── notFoundMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Sale.js
│   │
│   ├── routes/
│   │   ├── healthRoutes.js
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── salesRoutes.js
│   │   └── chartRoutes.js
│   │
│   ├── utils/
│   │   └── cache.js
│   │
│   ├── app.js
│   └── server.js
│
├── seed/
│   └── seedData.js
│
├── .env
├── .env.example
├── .gitignore
├── API_DOCUMENTATION.md
├── README.md
└── package.json
```

---

# Prerequisites

Before running the project, install:

* Node.js
* npm
* MongoDB Atlas account

Node.js and npm should be available from the terminal:

```bash
node --version
npm --version
```

---

# Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project directory:

```bash
cd sales-analytics-api
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### Environment variable descriptions

| Variable         | Description                     |
| ---------------- | ------------------------------- |
| `PORT`           | Port used by the Express server |
| `MONGODB_URI`    | MongoDB Atlas connection string |
| `JWT_SECRET`     | Secret used to sign JWT tokens  |
| `JWT_EXPIRES_IN` | JWT expiration duration         |

Never commit the `.env` file to GitHub.

The project includes `.env.example` as a safe configuration template.

---

# MongoDB Atlas Setup

1. Create a MongoDB Atlas account.
2. Create a cluster.
3. Create a database user.
4. Configure the IP access list.
5. Copy the MongoDB connection string.
6. Add the connection string to `.env`.

Example:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/sales_analytics
```

---

# Database Seeding

The project includes sample products and sales data.

Run:

```bash
npm run seed
```

The seed script creates:

* 8 products
* 12 sales records

Expected output:

```text
MongoDB connected
Products seeded: 8
Sales seeded: 12
Database seeding completed successfully
```

> The seed script clears the existing Product and Sale collections before inserting the sample dataset.

---

# Running the Application

## Development mode

```bash
npm run dev
```

The server runs on:

```text
http://localhost:5000
```

## Production mode

```bash
npm start
```

---

# Health Check

After starting the server, test:

```http
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Sales Analytics API is running",
  "data": {
    "status": "healthy"
  }
}
```

---

# Authentication

The API uses JWT authentication.

## Register

```http
POST /api/auth/register
```

Example:

```json
{
  "name": "Shayan Ahmad",
  "email": "shayan@example.com",
  "password": "password123"
}
```

## Login

```http
POST /api/auth/login
```

Example:

```json
{
  "email": "shayan@example.com",
  "password": "password123"
}
```

The login response contains a JWT token.

Use this token for protected endpoints:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# API Endpoints

## Authentication

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register a user        |
| POST   | `/api/auth/login`    | Login                  |
| GET    | `/api/auth/profile`  | Get authenticated user |

## Products

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/products`     | Get products      |
| GET    | `/api/products/:id` | Get product by ID |

Product listing supports:

* Search
* Category filtering
* Sorting
* Pagination

Example:

```http
GET /api/products?category=Electronics&sortBy=price&order=desc&page=1&limit=5
```

## Sales

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/api/sales`         | Get sales         |
| GET    | `/api/sales/:id`     | Get sale by ID    |
| GET    | `/api/sales/summary` | Get sales summary |

Sales listing supports:

* Search
* Region filtering
* Category filtering
* Date-range filtering
* Sorting
* Pagination

Example:

```http
GET /api/sales?region=North&sortBy=revenue&order=desc&page=1&limit=5
```

## Charts

| Method | Endpoint                     | Description         |
| ------ | ---------------------------- | ------------------- |
| GET    | `/api/charts/monthly-sales`  | Monthly sales data  |
| GET    | `/api/charts/category-sales` | Category sales data |
| GET    | `/api/charts/region-sales`   | Region sales data   |
| GET    | `/api/charts/top-products`   | Top products        |

Example:

```http
GET /api/charts/top-products?limit=5
```

For complete endpoint details, see:

`API_DOCUMENTATION.md`

---

# Data Processing

MongoDB aggregation pipelines are used to process sales data.

Examples include:

### Monthly Sales

Sales are grouped by:

* Year
* Month

The API calculates:

* Revenue
* Quantity
* Number of sales

### Category Sales

Sales are joined with products and grouped by product category.

### Region Sales

Sales are grouped by geographical region.

### Top Products

Sales are joined with products and grouped by product ID to calculate total product performance.

---

# Query Optimization

The API includes several database optimization techniques.

## MongoDB Indexes

Indexes are used on frequently queried fields including:

* Product category
* Sale product
* Sale region
* Sale date
* User email

Compound indexes are also used for common filtering combinations.

## Lean Queries

Read-only product queries use Mongoose `.lean()` to reduce unnecessary Mongoose document processing.

## Early Filtering

Sales filtering on fields such as region and date is performed before product lookup whenever possible.

## Pagination

Pagination prevents the API from returning unnecessarily large datasets.

The maximum page size is limited to 100 records for product and sales listing endpoints.

---

# Caching

The project uses an in-memory TTL cache for frequently requested analytics data.

Cached endpoints include:

```text
/api/sales/summary
/api/charts/monthly-sales
/api/charts/category-sales
/api/charts/region-sales
/api/charts/top-products
```

The default cache duration is 60 seconds.

The API exposes cache status through the response header:

```text
X-Cache: MISS
```

or:

```text
X-Cache: HIT
```

This reduces repeated database aggregation work for frequently requested dashboard data.

---

# Error Handling

The API uses consistent JSON error responses.

Example:

```json
{
  "success": false,
  "message": "Product not found",
  "data": null
}
```

Common HTTP status codes:

| Code | Meaning                     |
| ---: | --------------------------- |
|  200 | Successful request          |
|  201 | Resource created            |
|  400 | Invalid request             |
|  401 | Authentication failure      |
|  404 | Resource or route not found |
|  409 | Duplicate resource          |
|  500 | Server error                |

---

# Frontend Consumption

The API is designed to provide structured JSON that can be consumed by a visualization frontend.

Example flow:

```text
Frontend Dashboard
       |
       | HTTP Request + JWT
       ↓
Express API
       |
       ↓
Authentication Middleware
       |
       ↓
Controller
       |
       ↓
MongoDB / Aggregation
       |
       ↓
JSON Response
       |
       ↓
Frontend Chart
```

Chart endpoints return data in a format that can be directly mapped into chart libraries.

For example:

```http
GET /api/charts/monthly-sales
```

can be used to create a monthly revenue chart.

---

# Available NPM Scripts

```bash
npm run dev
```

Starts the development server using Nodemon.

```bash
npm start
```

Starts the application normally.

```bash
npm run seed
```

Seeds the MongoDB database with sample data.

---

# Security

The project implements:

* JWT authentication
* Password hashing using bcrypt
* Protected API routes
* Environment variables for secrets
* `.env` excluded from Git
* Input validation
* Controlled pagination limits

---

# API Documentation

Detailed API documentation is available in:

```text
API_DOCUMENTATION.md
```

This includes:

* Authentication
* Request parameters
* Request bodies
* Response examples
* Error responses
* Chart endpoints
* HTTP status codes

---

# Project Objective

This project was developed as a backend solution for a sales analytics visualization application.

The backend demonstrates:

* REST API development
* Database modeling
* MongoDB aggregation
* Authentication
* Data filtering
* Searching
* Sorting
* Pagination
* Chart-oriented APIs
* Error handling
* Caching
* Query optimization

It provides a scalable foundation for a frontend analytics dashboard.
