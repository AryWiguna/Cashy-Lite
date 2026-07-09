// ============================================================
// src/screens/HistoryScreen.js — Tab 2: Full Transaction History
//
// Displays ALL transactions from SQLite in a scrollable FlatList.
// Features:
//  - Search bar to filter by title or category
//  - FlatList with TransactionCard items (virtualized scrolling)
//  - Receipt thumbnail visible on each card (if available)
//  - useFocusEffect for auto-refresh when tab is focused
//  - Pull-to-refresh
//  - Empty state illustration
// ============================================================

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Local Imports ───────────────────────────────────────────
import TransactionCard      from "../components/TransactionCard";
import Header               from "../components/Header";
import { getAllTransactions } from "../services/db";

// ============================================================
// HistoryScreen Component
// ============================================================
const HistoryScreen = () => {
  // ─── State ─────────────────────────────────────────────────
  const [allTransactions, setAllTransactions] = useState([]);
  const [searchQuery, setSearchQuery]         = useState("");
  const [isRefreshing, setIsRefreshing]       = useState(false);

  // ─── Data Fetching ──────────────────────────────────────────
  const loadTransactions = useCallback(() => {
    try {
      const rows = getAllTransactions();
      setAllTransactions(rows);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat riwayat transaksi.");
      console.error("[History] loadTransactions error:", error);
    }
  }, []);

  // Re-fetch every time the History tab is brought into focus.
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions])
  );

  // ─── Pull-to-Refresh ────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadTransactions();
    setIsRefreshing(false);
  }, [loadTransactions]);

  // ─── Search Filtering ───────────────────────────────────────
  // Filter is applied CLIENT-SIDE (in-memory) since the dataset
  // is expected to be small for a personal finance app.
  // For large datasets, consider SQLite LIKE queries instead.
  const filteredTransactions = searchQuery.trim()
    ? allTransactions.filter((t) => {
        const query = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
        );
      })
    : allTransactions;

  // ─── FlatList Renderers ─────────────────────────────────────

  /**
   * renderItem — Renders a single TransactionCard for each list item.
   * FlatList calls this for every visible item.
   *
   * @param {{ item: Object }} — Destructured FlatList render callback.
   */
  const renderItem = useCallback(({ item }) => (
    <TransactionCard transaction={item} />
  ), []);

  /**
   * keyExtractor — Provides a unique string key per list item.
   * Using the database `id` field ensures stability.
   */
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  /**
   * ListHeaderComponent — Rendered above all list items.
   * Contains the search bar and the result count.
   */
  const ListHeader = (
    <View className="px-4 pt-2 pb-4">
      {/* ── Search Bar ── */}
      <View
        className="flex-row items-center bg-white rounded-2xl px-4 py-3"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <Text className="text-lg mr-3">🔍</Text>
        <TextInput
          placeholder="Cari transaksi atau kategori..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 text-gray-800 text-base"
          returnKeyType="search"
        />
        {/* Clear button — only visible when there is a query */}
        {searchQuery ? (
          <Text
            className="text-muted text-lg"
            onPress={() => setSearchQuery("")}
          >
            ✕
          </Text>
        ) : null}
      </View>

      {/* ── Result Count ── */}
      <Text className="text-muted text-sm mt-3 ml-1">
        {filteredTransactions.length} transaksi ditemukan
      </Text>
    </View>
  );

  /**
   * ListEmptyComponent — Shown when filteredTransactions is empty.
   */
  const ListEmpty = (
    <View className="items-center justify-center py-16 px-8">
      <Text style={{ fontSize: 56 }}>
        {searchQuery ? "🔍" : "📭"}
      </Text>
      <Text className="text-gray-700 font-semibold text-lg mt-4 text-center">
        {searchQuery
          ? `Tidak ada hasil untuk "${searchQuery}"`
          : "Belum ada transaksi"}
      </Text>
      <Text className="text-muted text-sm text-center mt-2">
        {searchQuery
          ? "Coba kata kunci lain."
          : "Semua pengeluaran yang kamu catat akan muncul di sini."}
      </Text>
    </View>
  );

  // ─── Render ─────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      {/* ── Screen Header ── */}
      <Header
        title="Riwayat"
        subtitle={`${allTransactions.length} total transaksi`}
        variant="primary"
      />

      {/* ── Virtualized Transaction List ── */}
      {/* FlatList is used instead of ScrollView + map() because it
          only renders visible items, keeping performance smooth
          even with hundreds of transactions. */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
          // Ensure the list is scrollable even when mostly empty
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        // Pull-to-refresh control
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#6C63FF"
            colors={["#6C63FF"]}
          />
        }
        // Performance optimizations for FlatList
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
      />
    </SafeAreaView>
  );
};

export default HistoryScreen;
