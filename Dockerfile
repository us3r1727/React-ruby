# ========== BACKEND STAGE ==========
FROM ruby:3.2.2 AS backend

# Install system dependencies
RUN apt-get update -qq && apt-get install -y \
    postgresql-client \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install backend dependencies
COPY backend/Gemfile backend/Gemfile.lock ./
RUN bundle install

# Copy backend source code
COPY backend/ ./

# ========== FRONTEND STAGE ==========
FROM node:22-alpine AS frontend

WORKDIR /app

# Copy and install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# ========== PRODUCTION STAGE ==========
# Backend runtime
FROM backend AS backend-runtime
EXPOSE 3000
CMD ["sh", "-c", "echo 'Cleaning up previous server...' && rm -f tmp/pids/server.pid && echo 'Waiting for PostgreSQL to be ready...' && until pg_isready -h postgres -p 5432 -U us3r1723 -d app_development; do echo 'Waiting for PostgreSQL...' && sleep 2; done && echo 'PostgreSQL is ready!' && echo 'Running migrations...' && rails db:migrate && echo 'Running seeds...' && rails db:seed && echo 'Starting Rails server...' && rails s -b 0.0.0.0"]

# Frontend runtime
FROM frontend AS frontend-runtime
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
