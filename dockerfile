# Stage 1: Build React app
FROM node:18-slim AS build

WORKDIR /app/frontend

# Copy only package files first for caching
COPY frontend/package*.json ./
RUN npm install --only=production

# Copy remaining source files
COPY frontend ./
RUN npm run build

# Stage 2: Build backend
FROM python:3.8-slim-bullseye AS backend

WORKDIR /app

# Install dependencies and minimal packages for build
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx nmap && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy backend dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend ./
# Copy React build to serve with FastAPI
COPY --from=build /app/frontend/build ./frontend/build

# Copy Nginx configuration
COPY default.conf /etc/nginx/sites-enabled/default
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80
EXPOSE 8000

# Start Nginx and FastAPI
CMD ["sh", "-c", "nginx && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"]
