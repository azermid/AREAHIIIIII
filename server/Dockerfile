FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./source ./source
EXPOSE 8080
CMD [ "npm", "run", "start" ]