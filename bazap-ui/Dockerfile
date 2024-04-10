# Step 1: Use the official Node.js 16 LTS image as the base
FROM node:16-alpine as build

# Step 2: Set the working directory in the Docker container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Optionally, if you're using yarn, you would copy over yarn.lock instead and use yarn commands below

# Install dependencies including Ant Design and Material-UI
RUN npm install --force

# Step 4: Copy the rest of your application code
COPY . .

# Step 5: Build your Vite project
RUN npm run build

# You might want to use a different base image for production serving
# For simplicity, we'll continue using the same image

# Step 6: Install a server to serve the static files
# If you're not pre-installing this as a dependency
RUN npm install -g serve

# Expose the port your app runs on
EXPOSE 5173

# Command to serve your static files using `serve`
CMD ["serve", "-s", "dist", "-l", "5173"]
