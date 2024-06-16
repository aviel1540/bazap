# Use an appropriate base image that includes both Node.js and MongoDB
FROM node:18-alpine

# Set up a directory for your Node.js application
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json .

# Install Node.js dependencies
RUN npm install

# Bundle app source
COPY . .

EXPOSE 5000

# Start MongoDB and Node.js
CMD ["npm", "start"]
