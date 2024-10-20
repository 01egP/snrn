# Stage 1: Build the NestJS app (backend)
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

# Stage 2: Production stage for backend
FROM node:20 AS backend-production

WORKDIR /usr/src/app

# Install only production dependencies for the backend
COPY ./backend/package*.json ./
RUN npm install --production

# Copy the compiled backend files from the backend build stage
COPY --from=backend-build /usr/src/app/dist ./dist

# Copy wait-for-it.sh to control startup
COPY ./backend/wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose port 3000 for the NestJS app
EXPOSE 3000

# Start the application, while wait-for-it.sh only blocks the backend startup until the database is ready
CMD ["/usr/src/app/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "start:prod"]
