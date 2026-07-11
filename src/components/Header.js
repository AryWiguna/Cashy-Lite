import React from "react";
import { View, Text, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = ({ title, subtitle, rightElement, variant = "primary" }) => {
  
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
