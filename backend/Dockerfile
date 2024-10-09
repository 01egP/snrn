# Stage 1: Build the frontend (React)
FROM node:20 AS frontend-build

# Set the working directory inside the container
WORKDIR /usr/src/frontend

# Copy package.json and package-lock.json for the frontend
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the frontend source code and build it
COPY frontend/ ./
RUN npm run build


# Stage 2: Build the NestJS app (backend)
FROM node:20 AS backend-build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for the backend
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the backend source code
COPY backend/ ./

# Build the backend (NestJS)
RUN npm run build


# Stage 3: Production build
FROM node:20 AS production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy backend production dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend build files from the build stage
COPY --from=backend-build /usr/src/app/dist ./dist

# Copy frontend build files from the frontend build stage
COPY --from=frontend-build /usr/src/frontend/build ./dist/frontend-build

# Copy the wait-for-it script and ensure it's executable
COPY backend/wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose the port on which the NestJS app will run
EXPOSE 3000

# Use the wait-for-it script to ensure MySQL is ready before starting the application
CMD ["/usr/src/app/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "start:prod"]
