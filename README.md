<div align="center">

# 📦 LUCCI Product Service (Free-Tier Deployment)

### Product Catalog Microservice for the LUCCI Cloud Native E-Commerce Platform

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Aiven](https://img.shields.io/badge/Aiven-FF3D00?style=for-the-badge&logo=aiven&logoColor=white)](https://aiven.io/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

<br/>

> Built using **Node.js + Express.js + PostgreSQL**

> Containerized using **Docker**, deployed to **Render** (free tier)

> Manages product catalog operations including product retrieval, category filtering, product creation, and secure administrator access for the LUCCI e-commerce platform.

<br/>

### 🔗 [Live Application](https://frontend-aws-devops-1.vercel.app)

This service powers part of the live LUCCI application above — see the link for the full working demo.


</div>

---

# ✨ Features

- View all available products
- Retrieve product details by ID
- Filter products by category
- Add new products (Admin only)
- JWT-based authentication
- Role-based administrator authorization
- Aiven PostgreSQL database integration
- RESTful API architecture
- Docker containerization
- Render free-tier deployment
- Secure API endpoints
- Cloud-native microservice architecture
  
---

# 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Why a Free-Tier Branch](#-why-a-free-tier-branch)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Architecture](#architecture)
- [Database Configuration](#database-configuration)
- [Authentication & Authorization](#-authentication--authorization)
- [REST API Endpoints](#-rest-api-endpoints)
- [Docker Configuration](#-docker-configuration)
- [Deployment Workflow](#-deployment-workflow)
- [Getting Started](#-getting-started)
- [Environment Variables](#environment-variables)
- [Future Improvements](#-future-improvements)
- [Author](#author)
- [License](#-license)

---

# 📖 Project Overview

The **Product Service** is one of the core backend microservices of the **LUCCI Cloud Native E-Commerce Platform**. It manages the product catalog and exposes secure REST APIs that allow users to browse products while enabling administrators to manage inventory.

This branch (`free-tier-deploy`) runs the service as a Docker container on **Render's free web service tier**, storing product data in **Aiven PostgreSQL** rather than Amazon RDS MySQL. Administrative operations remain protected using JWT-based authentication and role-based authorization, unchanged from the original design.

---

# 💡 Why a Free-Tier Branch

The `main` branch documents the original AWS deployment (ECS Fargate, ECR, RDS **MySQL**, Jenkins CI/CD). This branch migrates the database layer from MySQL to PostgreSQL — MySQL is not available on Aiven's free plan — while keeping every controller and route file untouched.

The migration was done through a compatibility adapter in `db.js`: it converts MySQL-style `?` placeholders to PostgreSQL's `$1, $2...` syntax on the fly and auto-appends `RETURNING id` to `INSERT` statements, so `result.insertId`-style code kept working exactly as before with **zero changes to `product.controller.js`**.

One real bug surfaced and was fixed during this migration: `product.routes.js` originally registered `GET /:id` *before* `GET /health`. Since Express matches routes in registration order, any request to `/products/health` was being captured by the `:id` handler (with `id="health"`), causing a database error. The health route was reordered to be registered first.

---

# 💻 Technology Stack

| Category | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL (Aiven, free tier) |
| Authentication | JWT (JSON Web Token) |
| Containerization | Docker |
| Hosting | Render (free web service) |
| Version Control | Git & GitHub |

---

# 📂 Project Structure

```text
product-service/
│
├── src/
│   ├── controllers/
│   │   └── product.controller.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   ├── routes/
│   │   └── product.routes.js
│   │
│   ├── app.js
│   └── db.js              (Postgres adapter — mysql2-compatible interface)
│
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```

## 📁 Folder Description

| Folder/File | Purpose |
|-------------|---------|
| **controllers/** | Business logic for retrieving, filtering, and creating products — unchanged from the MySQL version |
| **middleware/** | JWT authentication and administrator authorization |
| **routes/** | REST API endpoint definitions (health route ordered before `/:id`) |
| **app.js** | Express server initialization, CORS, database connection, routing |
| **db.js** | PostgreSQL connection pool + MySQL-compatible query adapter |
| **Dockerfile** | Builds the Docker image deployed by Render |
| **package.json** | Project metadata, dependencies (`pg` instead of `mysql2`), scripts |

---

# Architecture
```text
                Client (Vercel-hosted frontend)
                   │
                   ▼
           Express Application
               (app.js)
                   │
                   ▼
           Product Routes
      (product.routes.js)
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
 JWT Authentication     Public APIs
  verifyToken()
        │
        ▼
Admin Authorization
 verifyAdmin()
        │
        ▼
 Product Controller
(product.controller.js)
        │
        ▼
 Database Layer
      (db.js)
        │
        ▼
 Aiven PostgreSQL
```

## 🔄 Request Flow

1. Client sends an HTTP request directly to this service's Render URL.
2. Express receives and routes the request.
3. Public APIs directly access the controller.
4. Protected APIs validate the JWT token.
5. Admin APIs additionally verify the user's administrator role.
6. The controller executes the required business logic — identical code to the MySQL version.
7. SQL queries run through the PostgreSQL connection pool (SSL enabled), translated by the adapter in `db.js`.
8. Results are returned to the client as JSON responses.

---

# Database Configuration
The Product Service stores all product information in **Aiven PostgreSQL** (free tier), sharing a single database instance with the other three LUCCI microservices.

Database connectivity uses the **pg** package with connection pooling and SSL (`ssl: { rejectUnauthorized: false }`).

## 📋 Product Information Stored

- Product ID
- Product Name
- Description
- Price
- Category
- Image URL (relative path, served from the frontend's committed `assets/` folder)
- Stock
- Created At

## ⚙️ Database Operations

- Retrieve all products
- Retrieve a product by ID
- Retrieve products by category
- Insert new products (Admin only)

## 🔁 MySQL → PostgreSQL Compatibility Layer

```js
// Converts "?" placeholders to "$1, $2, ..."
function convertPlaceholders(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

// Auto-appends RETURNING id to INSERT statements
// so result.insertId-style code keeps working
```

This adapter meant the original `product.controller.js` — written against `mysql2`'s `pool.query()` / `[rows]` destructuring — required **no code changes** to run against PostgreSQL.

---

# 🔐 Authentication & Authorization

The Product Service secures administrative APIs using **JSON Web Tokens (JWT)** together with **role-based authorization** — unchanged from the original design.

## 🌐 Public APIs

- Retrieve all products
- Retrieve product by ID
- Retrieve products by category
- Health check

## 🔒 Protected APIs

- Create a new product (Admin only)

## 🔄 Authorization Flow

```text
Client
   │
   ▼
Authorization Header
Bearer <JWT Token>
   │
   ▼
verifyToken()
   │
   ▼
JWT Validation
   │
   ▼
verifyAdmin()
   │
   ▼
Administrator Access Granted
   │
   ▼
Create Product
```

```http
Authorization: Bearer <your_jwt_token>
```

---

# 📡 REST API Endpoints

## 🌐 Public APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/products/` | Retrieve all products |
| GET | `/products/:id` | Retrieve a product by ID |
| GET | `/products/category/:category` | Retrieve products by category |
| GET | `/products/health` | Product Service health check |
| GET | `/health` | Application health check |

> ⚠️ `/products/health` must be registered **before** `/products/:id` in the routes file — otherwise Express treats "health" as a product ID and the request fails with a database error instead of returning a health status.

## 🔒 Administrator APIs

| Method | Endpoint | Authentication | Description |
|---------|----------|----------------|-------------|
| POST | `/products/` | JWT + Admin | Create a new product |

## 📥 Sample Request

```http
POST /products/
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

```json
{
  "name": "Leather Bag",
  "price": 2499,
  "image_url": "assets/bags/Bags.jpg",
  "category": "bags"
}
```

## 📤 Successful Response

```json
{
  "success": true
}
```

## ❌ Example Error Response

```json
{
  "error": "Admin only"
}
```

---

# 🐳 Docker Configuration

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 6000

CMD ["node", "src/app.js"]
```

## 🏗️ Build Docker Image

```bash
docker build -t product-service .
```

## ▶️ Run Docker Container

```bash
docker run -p 6000:6000 product-service
```

```
http://localhost:6000
```

Render builds and runs this same Dockerfile automatically on deploy.

---

# 🚀 Deployment Workflow

This branch is deployed manually to Render rather than through an automated Jenkins pipeline — a deliberate simplification for a free-tier, single-maintainer portfolio deployment.

## 📋 Deployment Steps

1. Developer pushes code to the `free-tier-deploy` branch on GitHub.
2. Render is triggered via **Manual Deploy** in its dashboard (connected via public repository URL rather than GitHub OAuth).
3. Render builds a new Docker image from the Dockerfile.
4. The container is deployed and given a public Render URL.
5. The Product Service connects to Aiven PostgreSQL over SSL.
6. The frontend calls this service's Render URL directly for all `/products/*` requests.

## 🔄 Complete Deployment Flow

```text
Developer
    │
    ▼
GitHub (free-tier-deploy branch)
    │
    ▼
Render (Docker build & deploy)
    │
    ▼
Running Product Service
    │
    ▼
Aiven PostgreSQL
```

---

# 🚀 Getting Started

```bash
git clone -b free-tier-deploy https://github.com/rozanaim2026/product-service.git
cd product-service
npm install
npm start
```

Service starts on `http://localhost:6000`.

---

# Environment Variables
| Variable | Description |
|----------|-------------|
| `DB_HOST` | Aiven PostgreSQL host |
| `DB_USER` | Database user (`avnadmin`) |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name (`defaultdb`) |
| `DB_PORT` | Aiven's custom Postgres port |
| `JWT_SECRET` | Shared JWT signing secret across all 4 services |
| `FRONTEND_URL` | Deployed Vercel frontend URL (for CORS) |
| `PORT` | Injected automatically by Render |

---

# 🚀 Future Improvements

- 🔍 Product search by name and keywords (currently handled client-side on the frontend)
- 📄 Pagination and sorting for large product catalogs
- ✏️ Update existing product information
- 🗑️ Delete products with administrator authorization
- 📦 Product inventory and stock management
- ⭐ Product ratings and customer reviews
- 🖼️ Direct image uploads instead of committed relative paths
- ⚡ Redis caching for faster product retrieval
- 📑 API documentation using Swagger/OpenAPI
- 🧪 Unit and integration testing using Jest and Supertest
- 🔁 Restore automated CI/CD (currently manual deploy via Render dashboard)

---

# Author
<div align="center">

## Rozana IM

**Cloud Engineer • DevOps Engineer • AWS Enthusiast**

GitHub: https://github.com/rozanaim2026

LinkedIn: https://www.linkedin.com/in/rozana-im-a63541302/

</div>

---

# ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub. It really helps and motivates me to build more cloud-native projects.

---

# 📄 License

This project is part of the **LUCCI Cloud Native E-Commerce Platform** and is intended for learning, portfolio, and demonstration purposes.

---

<div align="center">

## ☁️ Built with Node.js • Express.js • PostgreSQL • Docker • Render • Aiven

### ❤️ Part of the LUCCI Cloud Native E-Commerce Platform (Free-Tier Edition)

</div>
