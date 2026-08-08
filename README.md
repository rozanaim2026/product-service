# 🛍️ LUCCI Product Service

The **Product Service** is a backend microservice of the LUCCI e-commerce platform responsible for managing product-related operations. It provides RESTful APIs to retrieve products, filter products by category, fetch individual product details, and allow administrators to add new products.

Built using **Node.js** and **Express.js**, the service stores product data in **Amazon RDS PostgreSQL** and is deployed as a Docker container on **Amazon ECS (Fargate)**. A Jenkins CI/CD pipeline automates the build, containerization, and deployment process using **Amazon ECR**.

---

## ✨ Features

- View all available products
- Retrieve product details by product ID
- Filter products by category
- Admin-only product creation
- JWT-based authentication and authorization
- PostgreSQL database integration
- RESTful API architecture
- Docker containerization
- Automated CI/CD using Jenkins
- Deployment on Amazon ECS (Fargate)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [AWS Infrastructure](#-aws-infrastructure)
- [Architecture](#-architecture)
- [API Endpoints](#-api-endpoints)
- [Authentication & Authorization](#-authentication--authorization)
- [Database Configuration](#-database-configuration)
- [Docker Configuration](#-docker-configuration)
- [Jenkins CI/CD Pipeline](#-jenkins-cicd-pipeline)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [Application Screenshots](#-application-screenshots)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 📖 Overview

The Product Service is responsible for handling all product-related functionalities within the LUCCI e-commerce application. It exposes REST APIs that allow users to browse products while restricting product creation to authorized administrators.

The service communicates with a PostgreSQL database hosted on Amazon RDS and is designed as an independent microservice, making it scalable and easy to maintain within the overall application architecture.

---
## 🚀 Tech Stack

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### Authentication
- JSON Web Token (JWT)

### API Testing
- Postman

### Containerization
- Docker

### CI/CD
- Jenkins
- Amazon ECR
- Amazon ECS (Fargate)

### Cloud Services
- Amazon ECS
- Amazon ECR
- Amazon RDS PostgreSQL
- Application Load Balancer (ALB)

### Version Control
- Git
- GitHub

---

## ☁️ AWS Infrastructure

The Product Service is deployed on AWS using a containerized microservices architecture.

### Services Used

- Amazon ECS (Fargate)
- Amazon Elastic Container Registry (ECR)
- Amazon RDS PostgreSQL
- Application Load Balancer (ALB)
- Jenkins CI/CD Pipeline
- GitHub

### Deployment Flow

Developer
↓
GitHub Repository
↓
Jenkins Pipeline
↓
Docker Image Build
↓
Amazon ECR
↓
Amazon ECS Service
↓
Application Load Balancer
↓
Product Service API
↓
Amazon RDS PostgreSQL

---
## 🏗️ Architecture

The Product Service follows a layered architecture to separate routing, business logic, authentication, and database access.

```
Client
   │
   ▼
Express Server (app.js)
   │
   ▼
Product Routes
(product.routes.js)
   │
   ▼
Controllers
(product.controller.js)
   │
   ▼
JWT Middleware
(auth.middleware.js)
   │
   ▼
Database Layer
(db.js)
   │
   ▼
Amazon RDS PostgreSQL
```

### Request Flow

1. Client sends an HTTP request.
2. Express receives the request.
3. The request is forwarded to the appropriate route.
4. Protected routes validate the JWT token.
5. Admin routes additionally verify the user's role.
6. The controller performs the required business logic.
7. SQL queries are executed through the PostgreSQL connection pool.
8. The API returns a JSON response to the client.

This architecture keeps routing, authentication, business logic, and database operations modular and easy to maintain.

---


## 📡 API Endpoints

### Public APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/products` | Retrieve all products |
| GET | `/products/:id` | Retrieve a product by ID |
| GET | `/products/category/:category` | Retrieve products by category |
| GET | `/products/health` | Product Service health check |
| GET | `/health` | Application health check |

---

### Admin APIs

| Method | Endpoint | Authentication | Description |
|---------|----------|----------------|-------------|
| POST | `/products` | JWT + Admin | Create a new product |

---

### Sample Request

```http
POST /products
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

```json
{
  "name": "Leather Bag",
  "price": 2499,
  "image_url": "https://bucket-url/bag.jpg",
  "category": "bags"
}
```

---

### Successful Response

```json
{
  "success": true
}
```

---
## 🔐 Authentication & Authorization

The Product Service uses JSON Web Tokens (JWT) to secure administrative operations.

### Public Routes

- View all products
- View products by category
- View product details
- Health check

### Protected Routes

- Add new product

### Authorization Flow

1. Client sends JWT token in the Authorization header.
2. The `verifyToken` middleware validates the token.
3. The `verifyAdmin` middleware checks the user role.
4. Only users with the `admin` role can create products.

Example header:

```http
Authorization: Bearer <JWT Token>
```
---

## 🗄️ Database Configuration

The Product Service stores product information in Amazon RDS PostgreSQL.

Connection pooling is implemented using the **pg** package to efficiently manage database connections.

The application performs the following database operations:

- Retrieve all products
- Retrieve product by ID
- Retrieve products by category
- Insert new products (Admin)

The PostgreSQL connection uses SSL for secure communication with Amazon RDS.

---
## 🐳 Docker Configuration

The Product Service is containerized using Docker for consistent deployment across environments.

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 6000

CMD ["node", "src/app.js"]
```

### Docker Build

```bash
docker build -t product-service .
```

### Run Container

```bash
docker run -p 6000:6000 product-service
```

The application listens on **Port 6000** inside the container.

---
## 🔄 Jenkins CI/CD Pipeline

The Product Service uses Jenkins to automate the build and deployment process.

### Pipeline Stages

1. Checkout Source Code
2. Authenticate with Amazon ECR
3. Build Docker Image
4. Push Docker Image to Amazon ECR
5. Register New ECS Task Definition
6. Deploy Updated Task to Amazon ECS
7. Clean Up Docker Images

### Deployment Flow

GitHub

↓

Jenkins

↓

Docker Build

↓

Amazon ECR

↓

Amazon ECS

↓

Running Product Service

---

## 🗄️ Database Configuration

The Product Service stores product information in Amazon RDS PostgreSQL.

Connection pooling is implemented using the **pg** package to efficiently manage database connections.

The application performs the following database operations:

- Retrieve all products
- Retrieve product by ID
- Retrieve products by category
- Insert new products (Admin)

The PostgreSQL connection uses SSL for secure communication with Amazon RDS.

---

## 📸 Application Screenshots

### Women's Collection

<img src="./assets/Womens.png" width="100%">

---

### Men's Collection

<img src="./assets/Mens.png" width="100%">

---

### Bags Collection

<img src="./assets/Bags.png" width="100%">

---

### Jewellery Collection

<img src="./assets/Jwellery.png" width="100%">

---
## 🚀 Future Improvements

The Product Service can be extended with several additional features to improve scalability and functionality.

- Product search by name and keywords.
- Pagination and sorting for large product catalogs.
- Product update and delete APIs for administrators.
- Product inventory and stock management.
- Product ratings and customer reviews.
- Image upload support using Amazon S3 instead of storing image URLs.
- Redis caching to improve API response times.
- API documentation using Swagger/OpenAPI.
- Unit and integration testing using Jest and Supertest.
- Monitoring and logging with Amazon CloudWatch.

---

## 👩‍💻 Author

**Rozana IM**

MCA Student | Cloud & DevOps Enthusiast

This Product Service was developed as part of the LUCCI Microservices E-Commerce Platform using Node.js, Express.js, PostgreSQL, Docker, Jenkins, Amazon ECR, Amazon ECS (Fargate), and Amazon RDS.

---


