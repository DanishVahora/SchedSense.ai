FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy source files
COPY src/ ./src

# Expose port
EXPOSE 3001

# Start the service
CMD ["node", "src/index.js"]
