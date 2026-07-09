// ============================================================
// src/components/TransactionCard.js — Transaction List Item
//
// Renders a single transaction as a card in both the Dashboard
// (recent list) and History (full list) screens.
//
// Features:
//  - Category color-coded emoji icon badge
//  - Receipt thumbnail (if receipt_uri is available)
//  - Amount formatted with the formatCurrency utility
//  - Date formatted with the formatDateShort utility
//  - Subtle shadow and rounded card style via NativeWind
// ============================================================

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDateShort } from "../utils/formatDate";

// ─── Category Configuration ─────────────────────────────────
// Maps category names to an emoji icon and a background color.
// This makes it easy to add new categories without touching
// the component's JSX logic.
const CATEGORY_CONFIG = {
  Makanan:       { emoji: "🍜", bg: "bg-orange-100", text: "text-orange-600" },
  Transportasi:  { emoji: "🚌", bg: "bg-blue-100",   text: "text-blue-600"   },
  Hiburan:       { emoji: "🎬", bg: "bg-pink-100",   text: "text-pink-600"   },
  Kesehatan:     { emoji: "💊", bg: "bg-green-100",  text: "text-green-600"  },
  Pendidikan:    { emoji: "📚", bg: "bg-purple-100", text: "text-purple-600" },
  Belanja:       { emoji: "🛍️", bg: "bg-yellow-100", text: "text-yellow-600" },
  Tagihan:       { emoji: "🧾", bg: "bg-red-100",    text: "text-red-600"    },
  Lainnya:       { emoji: "📦", bg: "bg-gray-100",   text: "text-gray-600"   },
};

// Fallback config for unknown categories
const DEFAULT_CATEGORY = { emoji: "💰", bg: "bg-gray-100", text: "text-gray-600" };

/**
 * TransactionCard Component
 *
 * @param {Object}   transaction           — Full transaction row object from SQLite.
 * @param {number}   transaction.id
 * @param {string}   transaction.title
 * @param {number}   transaction.amount
 * @param {string}   transaction.category
 * @param {string}   transaction.date
 * @param {string|null} transaction.receipt_uri
 * @param {function} [onPress]             — Optional tap handler for the card.
 */
const TransactionCard = ({ transaction, onPress }) => {
  const { title, amount, category, date, receipt_uri } = transaction;

  // Resolve category display config (emoji, colors)
  const catConfig = CATEGORY_CONFIG[category] ?? DEFAULT_CATEGORY;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}  // Only animate if tappable
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center"
      style={{
        // React Native shadow (iOS) — NativeWind `shadow-sm` handles Android
        shadowColor: "#6C63FF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* ── Category Badge ─────────────────────────────── */}
      <View
        className={`w-12 h-12 rounded-xl items-center justify-center mr-3 ${catConfig.bg}`}
      >
        <Text className="text-2xl">{catConfig.emoji}</Text>
      </View>

      {/* ── Transaction Info ────────────────────────────── */}
      <View className="flex-1">
        {/* Title — truncated at 1 line to prevent overflow */}
        <Text
          className="text-gray-800 font-semibold text-base"
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Category label + Date on the same row */}
        <View className="flex-row items-center mt-0.5 gap-2">
          <Text className={`text-xs font-medium ${catConfig.text}`}>
            {category}
          </Text>
          <Text className="text-gray-300">•</Text>
          <Text className="text-xs text-muted">{formatDateShort(date)}</Text>
        </View>
      </View>

      {/* ── Right Section: Amount + Receipt Thumbnail ─── */}
      <View className="items-end ml-2">
        {/* Amount — colored red for expense (all are expenses in Cashy Lite) */}
        <Text className="text-expense font-bold text-base">
          -{formatCurrency(amount)}
        </Text>

        {/* Receipt thumbnail — only rendered if URI is available */}
        {receipt_uri ? (
          <View className="mt-1.5">
            <Image
              source={{ uri: receipt_uri }}
              className="w-10 h-10 rounded-lg"
              // resizeMode="cover" ensures the image fills the frame
              resizeMode="cover"
            />
            {/* Small "struk" label below thumbnail */}
            <Text className="text-xs text-muted text-center mt-0.5">
              struk
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default TransactionCard;
