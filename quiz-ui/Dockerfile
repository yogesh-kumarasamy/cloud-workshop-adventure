# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json ./

# Install dependencies
RUN npm install

RUN rm -rf dist
# Copy the rest of the application code
COPY . .


# Build the application
RUN npm run build

# Expose the port the app runs on
ENV PORT=8080
EXPOSE 8080

# Command to start the application
CMD ["npm", "run", "start"]
