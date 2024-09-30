FROM node:18
WORKDIR /usr/src/app
# Install Expo CLI globally (if you need it for other operations).
# RUN npm install -g expo-cli
# COPY package*.json ./
COPY client/area/package*.json ./
RUN npm install
COPY client/area .
# Expose any required ports (usually not needed for mobile client).
# EXPOSE 19000
CMD ["npx", "expo", "build:android"]
