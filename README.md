# snrn — personal finance app

A full-stack personal finance tracker: users register, log in, and manage their
**transactions**, **categories** and **budgets**, with a dashboard and reports
(charts and a map view) on top of the data.

The project covers the whole path from code to cloud: a NestJS REST API, a React +
TypeScript SPA, Docker images, AWS infrastructure described in Terraform, and a
GitLab CI pipeline.

> **Status:** finished pet project, built **Sep 2024 – May 2025**. It ran on AWS
> (free tier) during development; the AWS account has since been closed, so there is
> no live deployment. The infrastructure stays here as code, and the app runs locally
> (see [Running locally](#running-locally)).

## Tech stack

| Layer          | Technologies |
|----------------|--------------|
| Backend        | Node.js 20, NestJS 10, TypeORM 0.3, MySQL 8, Passport + JWT, bcrypt, class-validator, Swagger (OpenAPI) |
| Frontend       | React 18, TypeScript, React Router 6, Axios, Chart.js (react-chartjs-2), Leaflet (react-leaflet) |
| Testing        | Jest (backend unit tests), React Testing Library (frontend) |
| Containers     | Docker (multi-stage build), Docker Compose |
| Infrastructure | Terraform (AWS provider ~> 5.0): EC2, S3, Application Load Balancer, CloudFront |
| CI             | GitLab CI (setup → install → test → build) |

## Architecture

```
                 ┌──────────────────────── CloudFront ────────────────────────┐
  Browser ──────▶│  default behavior  → S3 bucket (React static build)        │
                 │  /api/*            → Application Load Balancer → EC2       │
                 └─────────────────────────────────────────────────────────────┘
                                                                  │
                                              EC2 (Docker Compose)│
                                              ┌───────────────────▼─────┐
                                              │ nest-api  (NestJS :3000) │
                                              │ mysql     (MySQL 8)      │
                                              └──────────────────────────┘
```

### Backend (`backend/`)

NestJS application with one module per domain:

| Module        | Routes (global prefix `/api`)                         |
|---------------|-------------------------------------------------------|
| `auth`        | `POST /auth/register`, `POST /auth/login`, `GET /auth/profile` |
| `user`        | CRUD on `/users`                                      |
| `transaction` | CRUD on `/transaction`                                |
| `category`    | CRUD on `/category`                                   |
| `budget`      | CRUD on `/budget`                                     |

- **Auth:** passwords are hashed with bcrypt and never returned by the API; login
  issues a JWT (60 min). All CRUD routes are protected by a Passport JWT guard; only
  `register`, `login` and the health check are public. The signing secret comes from
  the `JWT_SECRET` environment variable.
- **Persistence:** TypeORM entities on MySQL; the schema (plus default categories)
  is created by TypeORM migrations in `backend/src/migrations/`.
- **Config:** a typed `ConfigService` wrapper over `@nestjs/config` that fails fast
  if a required variable is missing.
- **Validation:** a global `ValidationPipe` (whitelisting, transformation) on DTOs.
- **API docs:** Swagger UI at `/api-docs`.

### Frontend (`frontend/`)

React + TypeScript SPA (Create React App with `react-app-rewired`): login and
registration, protected routes, dashboard, transactions, reports with Chart.js
charts and a Leaflet map, profile and settings pages. The API base URL is set by
`REACT_APP_API_URL`; an Axios interceptor attaches the stored JWT to every request.

### Infrastructure (`infrastructure/`)

Terraform configuration in `infrastructure/terraform/` (details in its own
[README](infrastructure/terraform/README.md)):

- **EC2** instance (`t2.micro` by default) that bootstraps itself through user data:
  swap, Docker, Docker Compose, clone of the repository, `docker-compose up`.
- **S3** bucket for the frontend build (`prevent_destroy` lifecycle).
- **Application Load Balancer** across two subnets in front of the backend.
- **CloudFront** distribution with two origins: S3 for the SPA (with a 404 →
  `index.html` fallback for client-side routing) and the ALB for `/api/*`,
  HTTPS redirect on both.

The database runs as a MySQL container on the EC2 instance next to the API; there is
no managed database (RDS) in this setup. Environment-specific values (AMI, subnets,
security group, origin domains) are passed as Terraform variables and are not
committed.

## Running locally

### Prerequisites

- Docker and Docker Compose
- Node.js 20 and npm (for the frontend and for running tests)

### 1. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.test
```

Fill in `backend/.env` with your own local values. When the API runs in Docker
Compose, `DB_HOST` is the service name `mysql` and `DB_PORT` is `3306`.
`JWT_SECRET` must be a long random string, for example:

```bash
openssl rand -hex 32
```

In `frontend/.env.test` set `REACT_APP_API_URL=http://localhost:3000/api/` (the dev
server reads this file through `env-cmd`).

### 2. Start the backend and the database

```bash
docker compose --env-file backend/.env up --build
```

This starts MySQL 8 (exposed on host port `3307`) and the NestJS API on
`http://localhost:3000/api`; Swagger UI is at `http://localhost:3000/api-docs`.

Create the schema by running the migrations from the host against the exposed port:

```bash
cd backend
npm install
DB_HOST=127.0.0.1 DB_PORT=3307 npm run migration:run
```

### 3. Start the frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

## Tests

```bash
cd backend
npm install
npm test
```

Backend unit tests cover the controllers and services of every module (Jest with
mocked repositories, no database needed). Frontend tests run with `npm test` in
`frontend/`.

## CI/CD (GitLab)

`.gitlab-ci.yml` defines three stages on a `node:20` image:

1. **install** — `npm install` for backend and frontend, with dependency caching.
2. **test** — backend and frontend test suites.
3. **build** — `nest build` and the production React build, kept as job artifacts.

Configuration comes from GitLab CI/CD variables, which jobs receive as environment
variables: no `.env` file is written, printed to the job log or stored as an artifact,
and no secrets are kept in the repository. The unit tests need no secrets; the
frontend build reads `REACT_APP_API_URL`.

Deployment to AWS was done with Terraform and the EC2 user-data bootstrap described
below.

### User Data Script for AWS EC2

The `user-data-script.sh` script automatically configures an EC2 instance after it is launched.

#### Steps to use:
1. Copy the contents of the `infrastructure/user-data-script.sh` file.
2. Paste it into the **User Data** field when creating a new EC2 instance through the AWS Management Console.
3. Make sure the **"User data has already been base64 encoded"** checkbox is not selected.

The script will automatically install Docker, Docker Compose, clone the project, and run Docker containers.
