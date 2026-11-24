
# Personal Finance Tracker – Backend (NestJS)

This is the backend API for the Personal Finance Tracker app. Built with [NestJS](https://nestjs.com/) and [TypeORM](https://typeorm.io/) using a modular structure.

## Features

- REST API built with NestJS
- MySQL database integration with TypeORM
- JWT-based authentication (login, register, profile)
- Swagger UI documentation
- CRUD operations for:
  - Transactions
  - Categories
  - Budgets
  - Users
- Global prefix: `/api`

## Technologies Used

- **Node.js** / **NestJS** / **TypeScript**
- **TypeORM** for database operations
- **MySQL** as database
- **JWT Auth** (passport-jwt)
- **Swagger** for API documentation

---

## Getting Started

### 📦 Install dependencies

```bash
npm install
```

### ⚙️ Environment variables

Copy `.env.example` to `.env` in the `backend/` directory and fill in your own
values (`DB_*` for the database connection, `JWT_SECRET` for signing tokens,
`MYSQL_*` for the MySQL container in Docker Compose):

```bash
cp .env.example .env
```

### 🚀 Run the server

```bash
npm run start:dev
```

Server will start on `http://localhost:3000/api`

---

## 📘 Swagger API Docs

Once the backend is running, access Swagger documentation at:

```
http://localhost:3000/api-docs
```

Provides live documentation for all endpoints, schemas, and example payloads.

---

## 🧪 Run tests

```bash
npm run test
```

Runs unit tests using Jest. Most services and controllers are covered.

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── auth/              → login, register, jwt auth
│   ├── budget/            → budget CRUD
│   ├── category/          → category CRUD
│   ├── transaction/       → transaction CRUD
│   ├── user/              → user CRUD
│   ├── app.module.ts      → root Nest module
│   └── main.ts            → entry point (Swagger configured here)
```

---

## 📤 API Routes Overview

| Method | Endpoint                  | Description                   |
|--------|---------------------------|-------------------------------|
| POST   | /auth/register            | Register new user            |
| POST   | /auth/login               | Login and get access token   |
| GET    | /auth/profile             | Get current user (JWT)       |
| GET    | /transaction              | Get all transactions         |
| POST   | /transaction              | Create new transaction       |
| PATCH  | /transaction/:id          | Update transaction           |
| DELETE | /transaction/:id          | Delete transaction           |
| ...    | `/category`, `/budget`, `/users` — same pattern |

---

## License

This project is open source and part of a personal portfolio project.
