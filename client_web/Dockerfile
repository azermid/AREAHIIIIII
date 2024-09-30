FROM node:18
WORKDIR /usr/src/app
# Install Expo CLI globally (if you need it for other operations).
# RUN npm install -g expo-cli
# COPY package*.json ./
COPY client/area/ ./
RUN npm install
EXPOSE 8081
CMD ["npm", "run", "web"]
