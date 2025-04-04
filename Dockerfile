# syntax = docker/dockerfile:1

# Adjust the node version if needed
FROM node:23.5.0-slim as base
WORKDIR /app

FROM base as build
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config

# Copy package files
COPY package-lock.json package.json ./

# Disable husky during npm ci
ENV HUSKY=0
RUN npm ci

# Copy application code
COPY . .

# Create the production image
FROM base
# Copy built application
COPY --from=build /app /app
# Skip husky for production install too
ENV HUSKY=0
# Install only production dependencies
RUN npm ci --only=production
# Set NODE_ENV
ENV NODE_ENV=production
# Run the application
CMD [ "npm", "start" ]
