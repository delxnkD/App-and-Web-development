# Use a simple Node.js image for http-server
FROM node:22

# Set working directory
WORKDIR /app

# Install http-server
RUN npm install -g http-server

# Copy all frontend files
COPY . .

# Expose port 8080 for frontend
EXPOSE 8080

# Serve frontend with http-server
CMD ["http-server", ".", "-p", "8080"]
