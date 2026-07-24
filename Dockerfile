# =========================================
# STAGE 1: BUILD ENVIRONMENT
# =========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (frozen-lockfile/clean-install is ideal for CI, using standard install here)
RUN npm install

# Copy source repository
COPY . .

# Run production build compilation
RUN npm run build

# =========================================
# STAGE 2: PRODUCTION SERVER
# =========================================
FROM nginx:stable-alpine

# Copy custom nginx configuration if exists, or use default serving block
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
