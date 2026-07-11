import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";


const CustomButton = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  icon = null,
}) => {
  // ─── Variant Style Maps ─────────────────────────────────
  // Map variant names to NativeWind className strings.
  // This pattern is cleaner than a long chain of ternaries.

  const containerVariants = {
    primary:   "bg-primary active:bg-primary-dark",
    secondary: "bg-white border-2 border-primary active:bg-purple-50",
    danger:    "bg-red-500 active:bg-red-600",
    ghost:     "bg-transparent active:bg-gray-100",
  };

  const textVariants = {
    primary:   "text-white",
    secondary: "text-primary",
    danger:    "text-white",
    ghost:     "text-gray-600",
  };

  // Resolve classes based on the variant prop
  const containerClass = containerVariants[variant] ?? containerVariants.primary;
  const textClass      = textVariants[variant]      ?? textVariants.primary;

  // ─── Disabled State ─────────────────────────────────────
  // When loading or disabled, reduce opacity and block presses.
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={`
        flex-row items-center justify-center
        rounded-2xl px-6 py-4
        ${containerClass}
        ${isDisabled ? "opacity-50" : "opacity-100"}
        ${className}
      `}
    >
      {/* ── Loading Spinner ── */}
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "danger" ? "#fff" : "#6C63FF"}
          className="mr-2"
        />
      ) : null}

      {/* ── Optional Icon ── */}
      {!loading && icon ? (
        <View className="mr-2">{icon}</View>
      ) : null}

      {/* ── Label ── */}
      <Text className={`text-base font-bold ${textClass}`}>
        {loading ? "Memproses..." : title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
