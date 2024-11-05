FROM node:18

WORKDIR /usr/src/app

# Install Git, OpenJDK 17, wget, and other dependencies
RUN apt-get update && \
    apt-get install -y git wget unzip openjdk-17-jdk && \
    apt-get clean

# Download bundletool to convert aab to apk
RUN curl -L -o /usr/local/bin/bundletool.jar \
    https://github.com/google/bundletool/releases/download/1.8.2/bundletool-all-1.8.2.jar

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

# Create a keystore for signing the APK
RUN keytool -genkey -v \
    -keystore ./android/keystore.jks \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -alias arealias \
    -dname "CN=example, OU=Development, O=Epitech, L=City, S=State, C=US" \
    -storepass password123 \
    -keypass password123

# Set environment variables for EAS build to use the keystore
ENV EAS_BUILD_ANDROID_KEYSTORE_PATH=./android/keystore.jks
ENV EAS_BUILD_ANDROID_KEYSTORE_ALIAS=arealias
ENV EAS_BUILD_ANDROID_KEYSTORE_PASSWORD=password123
ENV EAS_BUILD_ANDROID_KEY_PASSWORD=password123

# Expose necessary ports
EXPOSE 19000 19001 19002

# Delete previous build files
RUN rm -rf /usr/src/app/shared/*

# Run the EAS build command to generate the AAB, convert it to APK, and move it to the shared volume
CMD ["sh", "-c", "eas build -p android --local --non-interactive && \
    cp /usr/src/app/build-*.aab /usr/src/app/shared/client.aab && \
    java -jar /usr/local/bin/bundletool.jar build-apks --bundle=/usr/src/app/shared/client.aab \
    --output=/usr/src/app/shared/output.apks --mode=universal \
    --ks /usr/src/app/android/keystore.jks --ks-pass pass:password123 && \
    unzip /usr/src/app/shared/output.apks -d /usr/src/app/shared && \
    mv /usr/src/app/shared/universal.apk /usr/src/app/shared/client.apk"]
