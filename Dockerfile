# Stage 1: Build the frontend (React)
FROM node:20 AS frontend-build

WORKDIR /usr/src/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build


# Stage 2: Build the NestJS app (backend)
FROM node:20 AS backend-build

WORKDIR /usr/src/app

COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build


# Stage 3: Production build
FROM node:20 AS production

WORKDIR /usr/src/app

COPY backend/package*.json ./
RUN npm install --production

# Copy backend build files from the backend-build stage
COPY --from=backend-build /usr/src/app/dist ./dist

# Copy frontend build files from the frontend-build stage
COPY --from=frontend-build /usr/src/frontend/build ./dist/frontend-build

COPY backend/wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

EXPOSE 3000

CMD ["/usr/src/app/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "start:prod"]
