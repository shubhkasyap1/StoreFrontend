# ⭐ Store Rating Platform

A full-stack **Store Rating Platform** where users can discover stores, submit ratings, and manage their profiles. The platform also provides dedicated dashboards and role-based access for **Admins, Store Owners, and Users**.

Built with **React.js, Tailwind CSS, Express.js, PostgreSQL, Prisma, and JWT Authentication**.

## 🚀 Live Demo

* **Frontend:** https://storeratingplatform.netlify.app/
* **Backend API:** https://backend-rating.onrender.com
* **Swagger API Documentation:** https://backend-rating.onrender.com/api-docs/swagger.json#/

---

## ✨ Features

### 👤 User

* User registration and login
* JWT-based authentication
* View available stores
* Search stores
* Filter stores by address
* View store ratings
* Submit ratings for stores
* Update existing ratings
* View personal profile
* Protected routes

### 🏪 Store Owner

* Owner authentication
* Owner dashboard
* View owned store
* View store rating statistics
* View customer ratings
* Manage store information
* Role-based access control

### 🛡️ Admin

* Admin authentication
* Admin dashboard
* Manage users
* Manage store owners
* Manage stores
* View platform statistics
* Create users
* Role-based permissions
* Protected administrative routes

---

## 🔐 Authentication & Authorization

The application uses **JWT (JSON Web Tokens)** for authentication.

### Authentication Flow

```text
User Login
    ↓
Backend validates credentials
    ↓
JWT Access Token generated
    ↓
Frontend stores authentication state
    ↓
Token sent with protected API requests
    ↓
Backend verifies JWT
    ↓
User Role checked
    ↓
Request allowed / rejected
```

### RBAC

The platform implements **Role-Based Access Control (RBAC)**.

Supported roles:

```text
ADMIN
OWNER
USER
```

Each role has access to different resources and actions.

Example:

```text
ADMIN
 ├── Manage Users
 ├── Manage Stores
 ├── Manage Owners
 └── View Platform Statistics

OWNER
 ├── View Own Store
 ├── View Ratings
 └── View Store Statistics

USER
 ├── View Stores
 ├── Rate Stores
 └── Manage Own Profile
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Axios
* JavaScript
* Responsive UI

### Backend

* Node.js
* Express.js
* REST API
* JWT Authentication
* RBAC
* Swagger / OpenAPI

### Database

* PostgreSQL
* Prisma ORM

### Deployment

* Netlify — Frontend
* Render — Backend
* PostgreSQL — Database

---

## 📁 Project Structure

### Frontend

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── admin/
│   │   ├── owner/
│   │   └── user/
│   ├── services/
│   ├── context/
│   ├── routes/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── tailwind.config.js
```

### Backend

```text
backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── config/
│   ├── prisma/
│   └── app.js
├── prisma/
│   └── schema.prisma
├── package.json
└── server.js
```

---

## 🗄️ Database

The application uses **PostgreSQL** with **Prisma ORM**.

Main entities include:

```text
User
 │
 ├── Role
 │
 └── Rating
        │
        └── Store
              │
              └── Owner
```

### Example relationships

```text
User
 ├── id
 ├── name
 ├── email
 ├── password
 └── role

Store
 ├── id
 ├── name
 ├── address
 └── ownerId

Rating
 ├── id
 ├── rating
 ├── userId
 └── storeId
```

Prisma handles database queries, relationships, migrations, and schema management.

---

## 🔌 API

The backend exposes RESTful APIs.

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### Stores

```http
GET    /api/stores
GET    /api/stores/:id
POST   /api/stores
PUT    /api/stores/:id
DELETE /api/stores/:id
```

### Ratings

```http
POST /api/ratings
GET  /api/ratings/:storeId
PUT  /api/ratings/:id
```

### Users

```http
GET /api/users
GET /api/users/:id
PUT /api/users/:id
```

> Exact available endpoints and request/response schemas can be explored through the Swagger documentation.

### 📚 Swagger Documentation

**OpenAPI / Swagger:**

https://backend-rating.onrender.com/api-docs/swagger.json#/

---

## 🔒 API Security

The backend includes multiple security layers:

* JWT authentication
* Password hashing
* Protected API routes
* Role-based authorization
* Request validation
* CORS configuration
* Environment-based secrets
* Database-level relationships and constraints

Protected requests use the authentication token:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## ⚙️ Environment Variables

### Backend

Create a `.env` file:

```env
PORT=5000

DATABASE_URL="postgresql://username:password@host:5432/database"

JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_refresh_secret"

CLIENT_URL="http://localhost:5173"
```

### Frontend

Create a `.env` file:

```env
VITE_API_URL="http://localhost:5000/api"
```

Never commit `.env` files to GitHub.

---

## 💻 Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd store-rating-platform
```

### 2. Backend setup

```bash
cd backend
npm install
```

Configure the `.env` file.

Then run Prisma:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Configure:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🧪 API Testing

The API can be tested using:

* Swagger UI
* Postman
* Thunder Client
* Browser
* Frontend application

The deployed API documentation is available here:

https://backend-rating.onrender.com/api-docs/swagger.json#/

---

## 📊 Application Flow

```text
                    ┌─────────────────┐
                    │     React.js    │
                    │  Tailwind CSS   │
                    └────────┬────────┘
                             │
                             │ REST API
                             ▼
                    ┌─────────────────┐
                    │   Express.js    │
                    │   REST API      │
                    └────────┬────────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
            JWT Authentication      RBAC
                  │                     │
                  └──────────┬──────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Prisma ORM     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    └─────────────────┘
```

---

## 🎯 Key Learning Outcomes

This project demonstrates practical experience with:

* Building a full-stack application
* React component architecture
* Tailwind CSS
* REST API development
* Express.js middleware
* JWT authentication
* Refresh token handling
* Role-Based Access Control
* PostgreSQL database design
* Prisma ORM
* API validation
* Protected routes
* CORS configuration
* Swagger/OpenAPI documentation
* Frontend/backend integration
* Production deployment
* Netlify deployment
* Render deployment

---

## 🌐 Deployment

### Frontend

Deployed using **Netlify**:

https://storeratingplatform.netlify.app/

### Backend

Deployed using **Render**:

https://backend-rating.onrender.com

### API Documentation

https://backend-rating.onrender.com/api-docs/swagger.json#/

---


## 🔮 Future Improvements

* Store review comments
* Advanced analytics
* Rating distribution charts
* Email notifications
* Password reset via email
* Google OAuth
* Store categories
* Location-based store search
* Pagination improvements
* Automated testing
* Docker support
* CI/CD pipeline

---

## 👨‍💻 Author

**Shubham Kumar**

Full Stack Developer

Built with ❤️ using React.js, Express.js, PostgreSQL and Prisma.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
