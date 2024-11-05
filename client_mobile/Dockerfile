FROM node:18

WORKDIR /usr/src/app

# Install Git, OpenJDK 17, wget, and other dependencies
RUN apt-get update && \
    apt-get install -y git wget unzip openjdk-17-jdk && \
    apt-get clean

# Set environment variables for Java and Android SDK
ENV JAVA_HOME /usr/lib/jvm/java-17-openjdk-amd64
ENV PATH $JAVA_HOME/bin:$PATH
ENV ANDROID_HOME /opt/android-sdk-linux
ENV PATH $ANDROID_HOME/cmdline-tools/tools/bin:$ANDROID_HOME/platform-tools:$PATH

# Install Android SDK command-line tools
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O sdk-tools.zip && \
    unzip sdk-tools.zip -d $ANDROID_HOME/cmdline-tools && \
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/tools && \
    rm sdk-tools.zip

# Accept licenses and install necessary Android SDK components
RUN yes | $ANDROID_HOME/cmdline-tools/tools/bin/sdkmanager --licenses && \
    $ANDROID_HOME/cmdline-tools/tools/bin/sdkmanager "platform-tools" "build-tools;33.0.0" "platforms;android-33"

# Install Expo CLI and EAS CLI globally
RUN npm install -g expo-cli eas-cli

# Set Expo token for authentication
ENV EXPO_TOKEN=AGEj71IZnU22Trl5p_Sd9L3-aCth69_DDms87AmM

# Copy package.json and install dependencies
COPY client/area/package*.json ./
RUN npm install

# Initialize Git repository to satisfy EAS requirements
RUN git init && \
    git config user.name "Docker Build" && \
    git config user.email "docker@example.com" && \
    git add . && \
    git commit -m "Initial commit for EAS build"

# Copy the entire project
COPY client/area .

# Expose necessary ports
EXPOSE 19000 19001 19002

# Run the EAS build command to generate the APK
CMD ["eas", "build", "-p", "android", "--local"]
