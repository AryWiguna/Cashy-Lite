// ============================================================
// src/components/Header.js — Reusable Screen Header Component
//
// A consistent top-of-screen header used across all screens.
// Accepts a title, optional subtitle, and optional right-side
// action element (e.g., a button or icon).
//
// Uses NativeWind className props for styling. The `styled()`
// wrapper from NativeWind is NOT needed in v4 — className
// works directly on core RN components via the babel transform.
// ============================================================

import React from "react";
import { View, Text, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Header Component
 *
 * @param {string}      title       — Primary header title text (required).
 * @param {string}      [subtitle]  — Secondary smaller text below title.
 * @param {ReactNode}   [rightElement] — Optional component on the right side.
 * @param {string}      [variant]   — "primary" (purple bg) | "white" (white bg).
 */
const Header = ({ title, subtitle, rightElement, variant = "primary" }) => {
  // useSafeAreaInsets gives us the device-safe padding values.
  // We apply the top inset as padding to avoid the status bar
  // overlapping our header content on notched devices.
  const insets = useSafeAreaInsets();

  const isPrimary = variant === "primary";

  return (
    <>
      {/* Configure StatusBar style based on header variant */}
      <StatusBar
        barStyle={isPrimary ? "light-content" : "dark-content"}
        backgroundColor={isPrimary ? "#6C63FF" : "#FFFFFF"}
      />

      <View
        style={{ paddingTop: insets.top }}
        className={`px-5 pb-4 ${
          isPrimary
            ? "bg-primary"                        // Purple gradient header
            : "bg-white border-b border-gray-100"  // White header with divider
        }`}
      >
        <View className="flex-row items-center justify-between">
          {/* ── Left: Title & Subtitle ── */}
          <View className="flex-1">
            <Text
              className={`text-2xl font-bold ${
                isPrimary ? "text-white" : "text-gray-800"
              }`}
            >
              {title}
            </Text>

            {/* Only render subtitle if provided */}
            {subtitle ? (
              <Text
                className={`text-sm mt-0.5 ${
                  isPrimary ? "text-purple-200" : "text-muted"
                }`}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* ── Right: Optional Action Element ── */}
          {rightElement ? (
            <View className="ml-3">{rightElement}</View>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default Header;
