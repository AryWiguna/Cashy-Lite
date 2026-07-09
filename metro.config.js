// ============================================================
// metro.config.js — Metro Bundler Configuration
//
// CRITICAL for NativeWind v4: The withNativeWind wrapper
// configures Metro to process Tailwind CSS at bundle time.
// Without this, className props will NOT be transformed and
// the app will crash or render without any styles.
//
// The `input` path must point to a global CSS file that
// includes the Tailwind directives.
// ============================================================
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  // Path to the global CSS file containing @tailwind directives
  input: "./global.css",
});
