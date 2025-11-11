# syntax=docker/dockerfile:1

ARG RUBY_VERSION=3.4.7
FROM ruby:$RUBY_VERSION-slim AS base

WORKDIR /rails

# Install dependencies: Node.js (with npm), Yarn, PostgreSQL libs, Git, build tools, YAML dev
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      curl \
      gnupg \
      libpq-dev \
      git \
      libyaml-dev && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn && \
    rm -rf /var/lib/apt/lists/*

# Copy Gemfiles first for caching
COPY Gemfile Gemfile.lock ./

# Install Ruby gems
RUN gem install bundler && bundle install --jobs 4

# Copy app code
COPY . .

# Set environment
ENV RAILS_ENV=development
ENV PORT=3000

# Expose port
EXPOSE 3000

# Entrypoint: create .env if not exists, then setup DB and start server
CMD bash -c "if [ ! -f .env ]; then cp .env.example .env; fi && bin/rails db:create db:migrate && bin/rails server -b 0.0.0.0 -p 3000"
