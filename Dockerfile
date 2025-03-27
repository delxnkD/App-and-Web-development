# Use Node.js LTS as base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire backend folder
COPY . .

# # Seed data before starting the application
# RUN npm run product-seed

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
