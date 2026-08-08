<div align="center">

# 🛍️ LUCCI Product Service

### Product Management Microservice for the LUCCI Cloud Native E-Commerce Platform

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Amazon ECS](https://img.shields.io/badge/Amazon_ECS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/ecs/)
[![Amazon ECR](https://img.shields.io/badge/Amazon_ECR-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/ecr/)
[![Amazon RDS](https://img.shields.io/badge/Amazon_RDS-527FFF?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/rds/)
[![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)](https://www.jenkins.io/)

<br/>

> Built using **Node.js + Express.js + PostgreSQL**

> Containerized using **Docker**

> Automated deployment using **Jenkins + Amazon ECR + Amazon ECS (Fargate)**

> Manages product catalog operations, including product retrieval, category filtering, and administrator product management for the LUCCI platform.


</div>

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
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [AWS Infrastructure](#aws-infrastructure)
- [Architecture](#architecture)
- [API Endpoints](#-api-endpoints)
- [Authentication & Authorization](#-authentication--authorization)
- [Database Configuration](#database-configuration)
- [Docker Configuration](#-docker-configuration)
- [Jenkins CI/CD Pipeline](#-jenkins-cicd-pipeline)
- [Application Screenshots](#-application-screenshots)
- [Future Improvements](#-future-improvements)
- [Author](#author)
    
---

## 📖 Overview

The Product Service is responsible for handling all product-related functionalities within the LUCCI e-commerce application. It exposes REST APIs that allow users to browse products while restricting product creation to authorized administrators.

The service communicates with a PostgreSQL database hosted on Amazon RDS and is designed as an independent microservice, making it scalable and easy to maintain within the overall application architecture.

---

## 📁 Project Structure

```text
product-service/
│
├── Assets/
│   ├── Womens.png
│   ├── Mens.png
│   ├── Bags.png
│   └── Jwellery.png
│
├── src/
│   ├── controllers/
│   │   └── product.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   └── product.routes.js
│   ├── app.js
│   └── db.js
│
├── Dockerfile
├── Jenkinsfile
├── package.json
├── package-lock.json
└── README.md
```

The project follows a modular structure to keep routing, business logic, authentication, and database configuration separated. This organization improves maintainability, scalability, and makes it easier to add new features as the Product Service evolves.

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

## AWS Infrastructure 

The Product Service is deployed on AWS using a containerized microservices architecture.

### Services Used

- Amazon ECS (Fargate)
- Amazon Elastic Container Registry (ECR)
- Amazon RDS PostgreSQL
- Application Load Balancer (ALB)
- Jenkins CI/CD Pipeline
- GitHub

### Deployment Flow

```text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
Jenkins Pipeline
    │
    ▼
Docker Image Build
    │
    ▼
Amazon ECR
    │
    ▼
Amazon ECS (Fargate)
    │
    ▼
Application Load Balancer
    │
    ▼
Product Service API
    │
    ▼
Amazon RDS PostgreSQL
```

---

## Architecture
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

- Create a new product (Admin only)

### Authorization Flow

1. Client sends JWT token in the Authorization header.
2. The `verifyToken` middleware validates the token.
3. The `verifyAdmin` middleware checks the user role.
4. Only users with the `admin` role can create products.

Example header:
```http
Authorization: Bearer <your_jwt_token>
```

---

## Database Configuration

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

### Build Docker Image

```bash
docker build -t product-service .
```

### Run Docker Container

```bash
docker run -p 6000:6000 product-service
```

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

```text
GitHub
   │
   ▼
Jenkins
   │
   ▼
Docker Build
   │
   ▼
Amazon ECR
   │
   ▼
Amazon ECS
   │
   ▼
Running Product Service
```


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

## Author
<div align="center">

## Rozana IM

Cloud Engineer • DevOps Engineer • AWS Enthusiast

GitHub: https://github.com/rozanaim2026

LinkedIn: https://www.linkedin.com/in/rozana-im-a63541302/

</div>

---

# ⭐ Support

If you found this project helpful,

please consider giving it a ⭐ on GitHub.

It really helps and motivates me to build more cloud-native projects.

---

<div align="center">

## ☁️ Built with Node.js • Express.js • PostgreSQL • Docker • Amazon ECS • Amazon ECR • Amazon RDS • Jenkins

### ❤️ Part of the LUCCI Cloud Native E-Commerce Platform

</div>


