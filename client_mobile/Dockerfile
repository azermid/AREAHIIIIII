FROM node:18
WORKDIR /usr/src/app
# Install Expo CLI globally (if you need it for other operations).
# RUN npm install -g expo-cli
# COPY package*.json ./
COPY client/area/package*.json ./
RUN npm install
# RUN npm install -g eas-cli
# RUN git init \
#     && git config user.name "Docker Build" \
#     && git config user.email "docker@example.com" \
#     && git add . \
#     && git commit -m "Initial commit for EAS build"
COPY client/area .
ENV EXPO_TOKEN=AGEj71IZnU22Trl5p_Sd9L3-aCth69_DDms87AmM
# Expose any required ports (usually not needed for mobile client).
# EXPOSE 19000
EXPOSE 19000 19001 19002
# Run the EAS build command to generate the APK
CMD ["npx", "eas", "build", "-p", "android", "--profile", "preview"]
