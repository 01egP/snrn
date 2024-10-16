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

# Stage 3: Production backend
FROM node:20 AS backend-production

WORKDIR /usr/src/app

# Copy backend production dependencies
COPY ./backend/package*.json ./
RUN npm install --production

# Copy the compiled backend files from the backend build stage
COPY --from=backend-build /usr/src/app/dist ./dist

# Copy the wait-for-it script from the backend source and set executable permissions
COPY ./backend/wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose port for the NestJS backend
EXPOSE 3000

# Start the app, ensuring MySQL is ready first
CMD ["/usr/src/app/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "start:prod"]

# Stage 4: Production frontend
FROM nginx:alpine AS frontend-production

# Copy the built frontend files from the frontend build stage
COPY --from=frontend-build /usr/src/frontend/build /usr/share/nginx/html

# Expose port for Nginx
EXPOSE 80

# Start Nginx to serve the frontend
CMD ["nginx", "-g", "daemon off;"]
