FROM node:22-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml ./
COPY packages/api/package.json ./packages/api/
COPY packages/ui/package.json ./packages/ui/

# Install global dependencies
RUN npm install -g pnpm@latest pm2@latest

# Install architecture-specific Rollup module for ARM64 | AMD64
RUN if [ "$(uname -m)" = "aarch64" ]; then \
      npm install @rollup/rollup-linux-arm64-musl --no-save; \
    elif [ "$(uname -m)" = "x86_64" ]; then \
      npm install @rollup/rollup-linux-x64-musl --no-save; \
    fi

# Install project dependencies
RUN pnpm install --frozen-lockfile --no-optional --unsafe-perm=true

# Copy the rest of the application
COPY . .

# Copy the environment variable
COPY ./packages/api/.env.production ./packages/api/.env

# Build the application
RUN pnpm run build

# Expose the application port
EXPOSE 3000

# Run the application with PM2
CMD ["pm2-runtime", "./packages/api/src/index.js", "--no-autorestart"]