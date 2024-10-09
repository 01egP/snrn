# Dockerfile for React Frontend

# Stage 1: Build the React app
FROM node:20 AS build

# Set working directory in container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the built React app using Nginx
FROM nginx:alpine

# Copy the build folder from the first stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port the frontend will run on
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
