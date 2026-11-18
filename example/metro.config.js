// Monorepo setup: the example imports `expo-ui-easy` straight from the package SOURCE, so edits hot-reload
// without rebuilding the library.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const workspaceRoot = path.resolve(__dirname, "..");
const packageRoot = path.join(workspaceRoot, "packages", "expo-ui-easy");

const config = getDefaultConfig(__dirname);
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.join(__dirname, "node_modules"),
  path.join(workspaceRoot, "node_modules"),
];
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "expo-ui-easy") {
    // Without an extension, so Metro still picks index.android.ts over index.ts.
    return context.resolveRequest(
      context,
      path.join(packageRoot, "src", "index"),
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
