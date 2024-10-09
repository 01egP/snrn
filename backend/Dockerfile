# Stage 1: Build the NestJS app
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

# Build the NestJS app
RUN npm run build

# Stage 2: Run the built NestJS app
FROM node:20 AS production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for production dependencies
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy the build files from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Copy the wait-for-it script and ensure it's executable
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose the port on which the NestJS app will run
EXPOSE 3000

# Use the wait-for-it script to ensure MySQL is ready before starting the application
CMD ["/usr/src/app/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "start:prod"]
