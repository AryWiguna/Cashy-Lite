// ============================================================
// tailwind.config.js — NativeWind / Tailwind CSS Configuration
//
// NativeWind v4 uses the standard Tailwind config file.
// The `content` array tells Tailwind which files to scan for
// className usage so it can generate only the needed styles.
// ============================================================
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan all JS/JSX files inside the src folder and root App.js
  content: ["./App.{js,jsx}", "./src/**/*.{js,jsx}"],

  // NativeWind preset is required for v4
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // --------------------------------------------------
      // Custom Color Palette — "Cashy Lite" Brand Colors
      // --------------------------------------------------
      colors: {
        primary: {
          DEFAULT: "#6C63FF", // Main brand purple
          light: "#8B85FF",
          dark: "#4B44CC",
        },
        income: "#22C55E",     // Green for income transactions
        expense: "#EF4444",    // Red for expense transactions
        surface: "#F8F7FF",    // Light purple-tinted background
        card: "#FFFFFF",       // Pure white for cards
        muted: "#9CA3AF",      // Gray for secondary text
      },
      // --------------------------------------------------
      // Custom Font Sizes for Financial Amounts
      // --------------------------------------------------
      fontSize: {
        "amount-lg": ["28px", { lineHeight: "34px", fontWeight: "700" }],
        "amount-sm": ["18px", { lineHeight: "24px", fontWeight: "600" }],
      },
    },
  },
  plugins: [],
};
