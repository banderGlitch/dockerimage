# USE official Node image 
FROM node:20

# Create app directory

WORKDIR /app

# Copy files
COPY package*.json ./
COPY . .

# Install dependencies
RUN npm install

# Expose 9000
EXPOSE 9000

# Run the app 

CMD [ "node","index.js" ]

