# Dockerfile for NestJS
# Use Node.js base image
FROM node:20

# Set working directory in container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose the port your NestJS API will run on
EXPOSE 3000

# Run the NestJS application
CMD ["/usr/src/app/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "start:dev"]
