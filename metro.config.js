const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes("mp3")) {
  config.resolver.assetExts.push("mp3");
}

const nativewindConfig = withNativewind(config);
const resolveRequest = nativewindConfig.resolver.resolveRequest;

nativewindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  // react-native-css 3.1.0-rc.0 omits AssetRegistry from its native wrapper.
  // Expo Asset needs the real export to resolve bundled images and audio.
  if (
    platform !== "web" &&
    moduleName === "react-native" &&
    /[/\\]node_modules[/\\]expo-asset[/\\]/.test(context.originModulePath)
  ) {
    return {
      type: "sourceFile",
      filePath: require.resolve("react-native"),
    };
  }

  return resolveRequest(context, moduleName, platform);
};

module.exports = nativewindConfig;
