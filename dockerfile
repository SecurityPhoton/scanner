# Stage 1: Build React app
FROM node:lts-bullseye-slim AS build

WORKDIR /app/frontend

# Copy frontend source code
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Stage 2: Build backend
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

WORKDIR /app

# Copy backend source code
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend ./

# Copy React build to serve with FastAPI
COPY --from=build /app/frontend/build ./frontend/build

# Install and configure Nginx
RUN apt-get update && apt-get install -y nginx

# Install nmap
RUN apt-get update && apt-get install -y nmap

COPY default.conf /etc/nginx/sites-enabled/default
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80
EXPOSE 8000

# Start Nginx and FastAPI
CMD ["sh", "-c", "nginx && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"]
