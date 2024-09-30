# Dockerfile for React Frontend
# Use Node.js base image
FROM node:20

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

# Use an Nginx image to serve the built React app
FROM nginx:alpine
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Expose the port the frontend will run on
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
