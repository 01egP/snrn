# Stage 1: Build the frontend (React)
FROM node:20 AS frontend-build

# Set the working directory for frontend
WORKDIR /usr/src/frontend

# Copy frontend package files and install dependencies
COPY ./frontend/package*.json ./
RUN npm install

# Copy the frontend source code and build it
COPY ./frontend/ ./
RUN npm run build


# Stage 2: Build the NestJS app (backend)
FROM node:20 AS backend-build

# Set the working directory for backend
WORKDIR /usr/src/app

# Copy backend package files and install dependencies
COPY ./backend/package*.json ./
RUN npm install

# Copy the backend source code
COPY ./backend/ ./

# Build the backend (NestJS)
RUN npm run build

# Stage 3: Production stage for both frontend and backend
FROM node:20 AS backend-production

WORKDIR /usr/src/app

# Install only production dependencies for the backend
COPY ./backend/package*.json ./
RUN npm install --production

# Copy the compiled backend files from the backend build stage
COPY --from=backend-build /usr/src/app/dist ./dist

# Copy the built frontend files directly into the dist folder, without an additional "dist"
COPY --from=frontend-build /usr/src/frontend/build ./frontend-build

# Copy the wait-for-it.sh script to manage backend startup
COPY ./backend/wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose port 3000 for the NestJS app
EXPOSE 3000

# Start the app, but wait-for-it.sh only blocks backend startup until the database is ready
CMD ["/usr/src/app/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "start:prod"]
