# Sales Analytics API — API Documentation

## 1. Overview

Sales Analytics API is a RESTful backend built with Node.js, Express.js, and MongoDB.

The API provides structured sales and product data for analytics dashboards and visualizations.

### Main Features

* JWT authentication
* Product listing and search
* Sales listing and filtering
* Sorting and pagination
* Sales summary
* Monthly sales analytics
* Category-wise sales analytics
* Region-wise sales analytics
* Top-selling products
* MongoDB aggregation
* MongoDB indexes
* Response caching
* Validation and error handling

---

# 2. Base URL

When running locally:

`http://localhost:5000/api`

---

# 3. Authentication

Protected endpoints require a JWT access token.

Include the token in the request header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

The token is returned after successful registration or login.

---

# 4. Standard Response Format

Successful responses generally follow this structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Paginated endpoints additionally return:

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  }
}
```

Error responses follow:

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

---

## 5. Authentication Endpoints

All authentication examples below use **Shayan Ahmad**.

---

## 5.1 Register User

### Endpoint

```http
POST /auth/register
```

### Authentication

Not required.

### Request Body

```json
{
  "name": "Shayan Ahmad",
  "email": "shayan@example.com",
  "password": "password123"
}
```

### Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Shayan Ahmad",
      "email": "shayan@example.com",
      "role": "user"
    },
    "token": "JWT_TOKEN"
  }
}
```

---

## 5.2 Login

### Endpoint

```http
POST /auth/login
```

### Authentication

Not required.

### Request Body

```json
{
  "email": "shayan@example.com",
  "password": "password123"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Shayan Ahmad",
      "email": "shayan@example.com",
      "role": "user"
    },
    "token": "JWT_TOKEN"
  }
}
```

---

## 5.3 Get Profile

### Endpoint

```http
GET /auth/profile
```

### Authentication

Required.

### Headers

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "USER_ID",
    "name": "Shayan Ahmad",
    "email": "shayan@example.com",
    "role": "user"
  }
}
```

# 6. Product Endpoints

All product endpoints require authentication.

## 6.1 Get Products

### Endpoint

```http
GET /products
```

### Authentication

Required.

### Query Parameters

| Parameter  | Description         | Example                |
| ---------- | ------------------- | ---------------------- |
| `search`   | Search product name | `search=laptop`        |
| `category` | Filter by category  | `category=Electronics` |
| `sortBy`   | Sort field          | `sortBy=price`         |
| `order`    | Sort direction      | `order=desc`           |
| `page`     | Page number         | `page=1`               |
| `limit`    | Number of results   | `limit=10`             |

### Example

```http
GET /products?category=Electronics&sortBy=price&order=desc&page=1&limit=5
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "_id": "PRODUCT_ID",
      "name": "Laptop Pro",
      "category": "Electronics",
      "price": 1200,
      "stock": 50
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 4,
    "totalPages": 1
  }
}
```

---

## 6.2 Get Product by ID

### Endpoint

```http
GET /products/:id
```

### Example

```http
GET /products/PRODUCT_ID
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "_id": "PRODUCT_ID",
    "name": "Laptop Pro",
    "category": "Electronics",
    "price": 1200,
    "stock": 50
  }
}
```

---

# 7. Sales Endpoints

All sales endpoints require authentication.

## 7.1 Get Sales

### Endpoint

```http
GET /sales
```

### Query Parameters

| Parameter   | Description                | Example                |
| ----------- | -------------------------- | ---------------------- |
| `search`    | Search customer or product | `search=Laptop`        |
| `region`    | Filter by region           | `region=North`         |
| `category`  | Filter by product category | `category=Electronics` |
| `startDate` | Minimum sale date          | `startDate=2026-01-01` |
| `endDate`   | Maximum sale date          | `endDate=2026-06-30`   |
| `sortBy`    | Sort field                 | `sortBy=revenue`       |
| `order`     | Sort direction             | `order=desc`           |
| `page`      | Page number                | `page=1`               |
| `limit`     | Number of results          | `limit=10`             |

### Example

```http
GET /sales?region=North&sortBy=revenue&order=desc&page=1&limit=5
```

### Search Example

```http
GET /sales?search=Laptop
```

### Date Filter Example

```http
GET /sales?startDate=2026-01-01&endDate=2026-03-31
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Sales retrieved successfully",
  "data": [
    {
      "_id": "SALE_ID",
      "quantity": 2,
      "revenue": 2400,
      "region": "North",
      "customer": "Ali Khan",
      "saleDate": "2026-01-15T00:00:00.000Z",
      "product": {
        "id": "PRODUCT_ID",
        "name": "Laptop Pro",
        "category": "Electronics",
        "price": 1200
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 7.2 Get Sale by ID

### Endpoint

```http
GET /sales/:id
```

### Example

```http
GET /sales/SALE_ID
```

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Sale retrieved successfully",
  "data": {
    "_id": "SALE_ID",
    "quantity": 2,
    "revenue": 2400,
    "region": "North",
    "customer": "Ali Khan",
    "saleDate": "2026-01-15T00:00:00.000Z",
    "product": {
      "id": "PRODUCT_ID",
      "name": "Laptop Pro",
      "category": "Electronics",
      "price": 1200
    }
  }
}
```

---

## 7.3 Sales Summary

### Endpoint

```http
GET /sales/summary
```

### Authentication

Required.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Sales summary retrieved successfully",
  "data": {
    "totalRevenue": 15300,
    "totalQuantity": 72,
    "totalSales": 12,
    "averageRevenue": 1275
  }
}
```

---

# 8. Chart / Visualization Endpoints

These endpoints are specifically designed to provide structured data for frontend charts and dashboards.

All require authentication.

---

## 8.1 Monthly Sales

### Endpoint

```http
GET /charts/monthly-sales
```

### Purpose

Provides monthly revenue, quantity, and sales count for a line chart or bar chart.

### Success Response

```json
{
  "success": true,
  "message": "Monthly sales retrieved successfully",
  "data": [
    {
      "year": 2026,
      "monthNumber": 1,
      "revenue": 3150,
      "quantity": 10,
      "sales": 2
    },
    {
      "year": 2026,
      "monthNumber": 2,
      "revenue": 1650,
      "quantity": 5,
      "sales": 2
    }
  ]
}
```

---

## 8.2 Category Sales

### Endpoint

```http
GET /charts/category-sales
```

### Purpose

Provides sales grouped by product category.

Useful for:

* Pie charts
* Doughnut charts
* Bar charts

### Success Response

```json
{
  "success": true,
  "message": "Category sales retrieved successfully",
  "data": [
    {
      "category": "Electronics",
      "revenue": 10670,
      "quantity": 54,
      "sales": 7
    },
    {
      "category": "Furniture",
      "revenue": 2650,
      "quantity": 7,
      "sales": 2
    }
  ]
}
```

---

## 8.3 Region Sales

### Endpoint

```http
GET /charts/region-sales
```

### Purpose

Provides sales grouped by geographical region.

Useful for:

* Regional bar charts
* Comparison charts
* Dashboard KPIs

### Success Response

```json
{
  "success": true,
  "message": "Region sales retrieved successfully",
  "data": [
    {
      "region": "North",
      "revenue": 4600,
      "quantity": 9,
      "sales": 3
    },
    {
      "region": "South",
      "revenue": 4830,
      "quantity": 14,
      "sales": 3
    }
  ]
}
```

---

## 8.4 Top Products

### Endpoint

```http
GET /charts/top-products
```

### Query Parameters

| Parameter | Description        | Default | Maximum |
| --------- | ------------------ | ------: | ------: |
| `limit`   | Number of products |       5 |      20 |

### Example

```http
GET /charts/top-products?limit=3
```

### Success Response

```json
{
  "success": true,
  "message": "Top products retrieved successfully",
  "data": [
    {
      "productId": "PRODUCT_ID",
      "productName": "Laptop Pro",
      "category": "Electronics",
      "revenue": 6000,
      "quantity": 5,
      "sales": 2
    }
  ]
}
```

---

# 9. Health Check

## Endpoint

```http
GET /health
```

### Authentication

Not required.

### Success Response

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

# 10. HTTP Status Codes

| Status | Meaning                                  |
| -----: | ---------------------------------------- |
|  `200` | Request successful                       |
|  `201` | Resource created                         |
|  `400` | Invalid request or validation error      |
|  `401` | Authentication required or invalid token |
|  `404` | Resource or route not found              |
|  `409` | Duplicate resource                       |
|  `500` | Internal server error                    |

---

# 11. Error Examples

## Authentication Error

```json
{
  "success": false,
  "message": "Authentication required",
  "data": null
}
```

## Invalid Token

```json
{
  "success": false,
  "message": "Invalid or expired token",
  "data": null
}
```

## Invalid Resource ID

```json
{
  "success": false,
  "message": "Invalid sale ID",
  "data": null
}
```

## Resource Not Found

```json
{
  "success": false,
  "message": "Product not found",
  "data": null
}
```

## Route Not Found

```json
{
  "success": false,
  "message": "Route not found: GET /api/unknown",
  "data": null
}
```

## Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

---

# 12. Caching

Dashboard and chart endpoints use an in-memory TTL cache.

Cached endpoints include:

```text
GET /api/sales/summary
GET /api/charts/monthly-sales
GET /api/charts/category-sales
GET /api/charts/region-sales
GET /api/charts/top-products
```

The cache lifetime is 60 seconds.

The API exposes the cache status through the response header:

```text
X-Cache: MISS
```

for a newly generated response and:

```text
X-Cache: HIT
```

when the response is served from cache.

---

# 13. Query Optimization

The API uses several database optimization techniques:

### MongoDB Indexes

Indexes are configured for frequently queried fields such as:

* Product category
* Sale product
* Sale region
* Sale date
* User email

Compound indexes are also used for common filtering combinations.

### Lean Queries

Read-only product queries use Mongoose `.lean()` to avoid unnecessary Mongoose document overhead.

### Aggregation

MongoDB aggregation pipelines are used for:

* Monthly sales
* Category sales
* Region sales
* Top products
* Sales filtering

### Early Filtering

Sales fields such as region and sale date are filtered before the product lookup where possible, reducing unnecessary database processing.

---

# 14. Frontend Integration

A frontend dashboard can consume these APIs using HTTP requests.

Example flow:

```text
Frontend Dashboard
       |
       | JWT Authentication
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
MongoDB
       |
       ↓
JSON Response
       |
       ↓
Chart / Dashboard
```

Example chart data request:

```http
GET /api/charts/monthly-sales
Authorization: Bearer YOUR_JWT_TOKEN
```

The frontend can map the returned `data` array directly into chart libraries such as Chart.js, Recharts, or similar visualization libraries.

---

# 15. API Endpoint Summary

| Method | Endpoint                     | Authentication | Purpose                |
| ------ | ---------------------------- | -------------- | ---------------------- |
| GET    | `/api/health`                | No             | Health check           |
| POST   | `/api/auth/register`         | No             | Register user          |
| POST   | `/api/auth/login`            | No             | Login                  |
| GET    | `/api/auth/profile`          | Yes            | Get current user       |
| GET    | `/api/products`              | Yes            | List/search products   |
| GET    | `/api/products/:id`          | Yes            | Get product            |
| GET    | `/api/sales`                 | Yes            | List/filter sales      |
| GET    | `/api/sales/:id`             | Yes            | Get sale               |
| GET    | `/api/sales/summary`         | Yes            | Sales KPI summary      |
| GET    | `/api/charts/monthly-sales`  | Yes            | Monthly chart data     |
| GET    | `/api/charts/category-sales` | Yes            | Category chart data    |
| GET    | `/api/charts/region-sales`   | Yes            | Region chart data      |
| GET    | `/api/charts/top-products`   | Yes            | Top product chart data |

---

# 16. Technology Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs
* CORS
* Nodemon

---

# 17. Project Purpose

This API was developed as a backend solution for a sales analytics visualization system.

It provides structured, filtered, aggregated, and chart-ready data that can be consumed by a frontend dashboard.
