# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build



RUN npm install -g serve

# Expose the port the app runs on
ARG PORT=8080
ENV PORT=$PORT
ENV HOSTNAME="0.0.0.0"
EXPOSE $PORT

# Command to start the application
# CMD ["sh", "-c", "pnpm run start -- --port ${PORT} --host 0.0.0.0"]
CMD ["sh", "-c", "serve -s dist -l 8080"]
