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

# Add healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1

# Start the service
CMD ["node", "src/index.js"]
