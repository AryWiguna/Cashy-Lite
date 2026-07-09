// ============================================================
// babel.config.js — Babel Configuration
//
// CRITICAL: NativeWind v4 requires 'nativewind/babel' as a
// Babel preset. This transforms Tailwind className props into
// React Native StyleSheet objects at compile time.
// ============================================================
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };
};
