# Use the official Node.js image as a base
FROM node:21

# Set the environment variable
ENV MONGO_CONN_STR=mongodb://db:27017/kiruna-ex
ENV HUSKY=0
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY . .

RUN npm install


# Expose port 3000 to the outside world
EXPOSE 3001

# Command to run the client application
CMD ["npm", "start"]