FROM node:20.19.2-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Expose port
EXPOSE 3004

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3004/health || exit 1

# Start the application
CMD ["node", "src/index.js"]
