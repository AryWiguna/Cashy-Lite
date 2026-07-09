// ============================================================
// App.js — Application Root Entry Point
//
// Responsibilities:
//  1. Import the global NativeWind CSS (required for v4)
//  2. Initialize the SQLite database schema on first launch
//  3. Set up React Navigation providers (SafeArea, etc.)
//  4. Render the root AppNavigator
//
// CRITICAL: The `import "./global.css"` line MUST be the first
// import in this file. NativeWind v4 requires the CSS to be
// registered before any styled components are rendered.
// ============================================================

// ── Step 1: Import NativeWind global CSS FIRST ──────────────
import "./global.css";

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// ─── Local Imports ───────────────────────────────────────────
import AppNavigator from "./src/navigation/AppNavigator";
import { initDB }   from "./src/services/db";

// ============================================================
// App Component
// ============================================================
export default function App() {
  // Track whether the database has been initialized yet.
  // We show a loading screen while initDB() runs to prevent
  // any screen from trying to query before the table exists.
  const [dbReady, setDbReady]   = useState(false);
  const [dbError, setDbError]   = useState(null);

  useEffect(() => {
    // ── Initialize SQLite Database ──────────────────────────
    // initDB() creates the `transactions` table if it doesn't
    // exist. This is idempotent — safe to call on every launch.
    try {
      initDB();
      setDbReady(true);
    } catch (error) {
      console.error("[App] Database initialization failed:", error);
      setDbError(error.message);
    }
  }, []);

  // ── Loading State ─────────────────────────────────────────
  // Shown briefly on first launch while SQLite is initializing.
  if (!dbReady && !dbError) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#6C63FF" }}>
        <Text style={{ color: "white", fontSize: 32 }}>💰</Text>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 20, marginTop: 12 }}>
          Cashy Lite
        </Text>
        <ActivityIndicator color="white" size="large" style={{ marginTop: 24 }} />
      </View>
    );
  }

  // ── Error State ───────────────────────────────────────────
  // Shown if the database could not be created (rare, but safe).
  if (dbError) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
        <Text style={{ fontSize: 48 }}>❌</Text>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16, textAlign: "center" }}>
          Gagal Inisialisasi Database
        </Text>
        <Text style={{ color: "#9CA3AF", marginTop: 8, textAlign: "center" }}>
          {dbError}
        </Text>
      </View>
    );
  }

  // ── Main App ──────────────────────────────────────────────
  return (
    // SafeAreaProvider is REQUIRED by react-native-safe-area-context.
    // It must wrap the entire app so that useSafeAreaInsets() works
    // in any nested component (like our Header component).
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
