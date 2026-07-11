import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Local Imports ───────────────────────────────────────────
import TransactionCard           from "../components/TransactionCard";
import { getRecentTransactions, getMonthlyTotal } from "../services/db";
import { formatCurrency }        from "../utils/formatCurrency";
import { formatDate, getCurrentMonthYear } from "../utils/formatDate";

// ─── Month Name Map ──────────────────────────────────────────
// For a friendly display like "Juli 2024" in the summary card.
const MONTH_NAMES = [
  "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// ============================================================
// DashboardScreen Component
// ============================================================
const DashboardScreen = ({ navigation }) => {
  // ─── State ─────────────────────────────────────────────────
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlyTotal, setMonthlyTotal]             = useState(0);
  const [isRefreshing, setIsRefreshing]             = useState(false);

  // Get current month/year for the summary card label
  const { year, month } = getCurrentMonthYear();

  // ─── Data Fetching ──────────────────────────────────────────
  /**
   * loadData() fetches fresh data from SQLite.
   * Called on focus and on pull-to-refresh.
   */
  const loadData = useCallback(() => {
    try {
      const transactions = getRecentTransactions(5);
      const total        = getMonthlyTotal(year, month);
      setRecentTransactions(transactions);
      setMonthlyTotal(total);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat data transaksi.");
      console.error("[Dashboard] loadData error:", error);
    }
  }, [year, month]);

  // useFocusEffect fires every time the Dashboard tab comes into focus.
  // This is the recommended React Navigation pattern to refresh data
  // when returning from another screen (e.g., after adding a transaction).
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // ─── Pull-to-Refresh Handler ────────────────────────────────
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
    setIsRefreshing(false);
  }, [loadData]);

  // ─── Render ─────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#6C63FF"
            colors={["#6C63FF"]}
          />
        }
      >
        {/* ════════════════════════════════════════════════
            SECTION 1 — Purple Summary Card
            Shows total spending for the current month.
        ════════════════════════════════════════════════ */}
        <View
          className="mx-4 mt-4 rounded-3xl p-6 overflow-hidden"
          style={{
            backgroundColor: "#6C63FF",
            // Layered shadow for a "floating card" effect
            shadowColor: "#6C63FF",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 12,
          }}
        >
          {/* Decorative background circles (purely visual) */}
          <View
            style={{
              position: "absolute", top: -30, right: -30,
              width: 120, height: 120, borderRadius: 60,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          />
          <View
            style={{
              position: "absolute", bottom: -20, right: 60,
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: "rgba(255,255,255,0.07)",
            }}
          />

          {/* Label */}
          <Text className="text-purple-200 text-sm font-medium">
            Total Pengeluaran
          </Text>
          <Text className="text-purple-200 text-xs mt-0.5">
            {MONTH_NAMES[month]} {year}
          </Text>

          {/* Big Amount */}
          <Text
            className="text-white font-bold mt-3"
            style={{ fontSize: 32, lineHeight: 40 }}
          >
            {formatCurrency(monthlyTotal)}
          </Text>

          {/* Transaction Count */}
          <View className="flex-row items-center mt-4 bg-white/20 rounded-xl px-3 py-2 self-start">
            <Text className="text-white text-sm">
              📊 {recentTransactions.length === 5
                ? "5+ transaksi bulan ini"
                : `${recentTransactions.length} transaksi bulan ini`}
            </Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            SECTION 2 — Quick Action Button
        ════════════════════════════════════════════════ */}
        <TouchableOpacity
          onPress={() => navigation.navigate("AddTransaction")}
          activeOpacity={0.85}
          className="mx-4 mt-4 rounded-2xl p-4 flex-row items-center justify-center"
          style={{
            backgroundColor: "#FFFFFF",
            borderWidth: 2,
            borderColor: "#6C63FF",
            borderStyle: "dashed",
          }}
        >
          <Text style={{ fontSize: 20 }}>➕</Text>
          <Text className="text-primary font-bold text-base ml-2">
            Catat Pengeluaran Baru
          </Text>
        </TouchableOpacity>

        {/* ════════════════════════════════════════════════
            SECTION 3 — Recent Transactions List
        ════════════════════════════════════════════════ */}
        <View className="mx-4 mt-6">
          {/* Section Header */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-800 text-lg font-bold">
              Transaksi Terbaru
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("History")}>
              <Text className="text-primary text-sm font-medium">
                Lihat Semua →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Empty State */}
          {recentTransactions.length === 0 ? (
            <View className="bg-white rounded-3xl p-8 items-center">
              <Text style={{ fontSize: 48 }}>📭</Text>
              <Text className="text-gray-700 font-semibold text-base mt-3">
                Belum ada transaksi
              </Text>
              <Text className="text-muted text-sm text-center mt-1">
                Tekan tombol di atas untuk mencatat pengeluaran pertamamu!
              </Text>
            </View>
          ) : (
            // Render the 5 most recent transactions
            recentTransactions.map((item) => (
              <TransactionCard
                key={item.id.toString()}
                transaction={item}
              />
            ))
          )}
        </View>

        {/* Bottom padding so last card isn't hidden by tab bar */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
