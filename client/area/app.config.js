import 'dotenv/config';

export default {
  expo: {
    name: "area",
    slug: "area",
    version: "1.0.0",
    platforms: ["ios", "android", "web"],
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.webepitech.area",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.webepitech.area",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "74a41a5e-50cb-4431-a7b8-b9c91f7ebf00",
      },
      MACHINE_IP: process.env.MACHINE_IP,
      ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID,
      IOS_CLIENT_ID: process.env.IOS_CLIENT_ID,
      WEB_CLIENT_ID: process.env.WEB_CLIENT_ID,
    },
  },
};
