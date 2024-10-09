# Dockerfile for NestJS and Frontend

# Use Node.js base image
FROM node:20

# Set working directory for the NestJS backend
WORKDIR /usr/src/app

# Copy package.json and install dependencies for the backend
COPY backend/package*.json ./
RUN npm install --production

# Copy the backend application files
COPY backend/ .

# Build the frontend (React)
WORKDIR /usr/src/frontend
COPY frontend/package*.json ./
RUN npm install
RUN npm run build

# Copy the frontend build files to the backend's static folder
RUN cp -r build /usr/src/app/frontend-build

# Set the working directory back to the backend
WORKDIR /usr/src/app

# Ensure wait-for-it script has executable permissions
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose the port for the backend (NestJS)
EXPOSE 3000

# Use wait-for-it script to ensure MySQL is ready before starting the application
CMD ["/usr/src/app/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "start:prod"]
