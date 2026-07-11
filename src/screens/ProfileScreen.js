import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Local Imports ───────────────────────────────────────────
import Header       from "../components/Header";
import CustomButton from "../components/CustomButton";
import { clearAllTransactions, getAllTransactions } from "../services/db";

// ─── Static Profile Data ─────────────────────────────────────
const STUDENT_PROFILE = {
  name:    "I Komang Ary Wiguna",
  nim:     "230040185",
  class:   "JE244",
  prodi:   "Teknologi Informasi",
  kampus:  "Institut Teknologi dan Bisnis Stikom Bali",
  avatar:  "👨‍💻", // Emoji avatar — no image required
};

// ─── App Info ─────────────────────────────────────────────────
const APP_INFO = [
  { label: "Versi Aplikasi",  value: "1.0.0" },
  { label: "Framework",       value: "React Native + Expo SDK 54" },
  { label: "Database",        value: "expo-sqlite (SQLite)" },
  { label: "Navigasi",        value: "React Navigation v6" },
  { label: "Styling",         value: "NativeWind v4 (Tailwind CSS)" },
];

// ============================================================
// InfoRow — Reusable key-value display row
// ============================================================
const InfoRow = ({ label, value }) => (
  <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
    <Text className="text-muted text-sm">{label}</Text>
    <Text className="text-gray-800 text-sm font-medium text-right flex-1 ml-4">
      {value}
    </Text>
  </View>
);

// ============================================================
// ProfileScreen Component
// ============================================================
const ProfileScreen = () => {
  const [isClearing, setIsClearing] = useState(false);

  // ─── Danger Zone: Clear DB ──────────────────────────────────
  const handleClearDatabase = useCallback(() => {
    // First confirmation
    Alert.alert(
      "⚠️ Reset Database",
      "Semua data transaksi akan DIHAPUS PERMANEN. Apakah kamu yakin?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Lanjutkan",
          style: "destructive",
          onPress: () => {
            // Second confirmation — extra safety for live demos
            Alert.alert(
              "🗑️ Konfirmasi Terakhir",
              "Ini tidak bisa dibatalkan. Hapus SEMUA transaksi sekarang?",
              [
                { text: "Tidak", style: "cancel" },
                {
                  text: "Ya, Hapus Semua",
                  style: "destructive",
                  onPress: () => {
                    setIsClearing(true);
                    try {
                      clearAllTransactions();
                      Alert.alert(
                        "✅ Selesai",
                        "Database telah direset. Semua transaksi dihapus."
                      );
                    } catch (error) {
                      Alert.alert("Error", "Gagal mereset database.");
                      console.error("[Profile] handleClearDatabase error:", error);
                    } finally {
                      setIsClearing(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  }, []);

  // ─── Render ─────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header
        title="Profil"
        subtitle="Pengaturan & Informasi"
        variant="primary"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >

        {/* ════════════════════════════════════════════════
            SECTION 1 — Student Profile Card
        ════════════════════════════════════════════════ */}
        <View
          className="bg-white rounded-3xl p-6 items-center mt-2"
          style={{
            shadowColor: "#6C63FF",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          {/* Avatar Circle */}
          <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-3">
            <Text style={{ fontSize: 40 }}>{STUDENT_PROFILE.avatar}</Text>
          </View>

          {/* Name */}
          <Text className="text-gray-900 text-xl font-bold text-center">
            {STUDENT_PROFILE.name}
          </Text>
          <Text className="text-primary text-sm font-medium mt-1">
            {STUDENT_PROFILE.nim}
          </Text>

          {/* Divider */}
          <View className="w-full h-px bg-gray-100 my-4" />

          {/* Detail Rows */}
          <View className="w-full">
            <InfoRow label="Kelas"  value={STUDENT_PROFILE.class}  />
            <InfoRow label="Prodi"  value={STUDENT_PROFILE.prodi}  />
            <InfoRow label="Kampus" value={STUDENT_PROFILE.kampus} />
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            SECTION 2 — Tech Stack / App Info
        ════════════════════════════════════════════════ */}
        <View className="mt-5">
          <Text className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3 ml-1">
            Tentang Aplikasi
          </Text>
          <View
            className="bg-white rounded-2xl px-4 py-1"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {APP_INFO.map((item, index) => (
              <InfoRow key={index} label={item.label} value={item.value} />
            ))}
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            SECTION 3 — Danger Zone
            Red bordered section clearly signaling destructive
            action. Uses a double-confirmation Alert pattern.
        ════════════════════════════════════════════════ */}
        <View className="mt-6">
          <Text className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3 ml-1">
            Danger Zone
          </Text>

          <View
            className="bg-white rounded-2xl p-4"
            style={{
              borderWidth: 1.5,
              borderColor: "#FCA5A5", // red-300
              shadowColor: "#EF4444",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            {/* Warning Description */}
            <View className="flex-row items-start mb-4">
              <Text style={{ fontSize: 24 }}>⚠️</Text>
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-semibold text-base">
                  Reset Seluruh Data
                </Text>
                <Text className="text-muted text-sm mt-1">
                  Hapus semua transaksi dari database SQLite. Berguna untuk
                  mempersiapkan demo atau presentasi dari awal. Tindakan ini
                  {" "}<Text className="font-bold text-expense">tidak dapat dibatalkan</Text>.
                </Text>
              </View>
            </View>

            {/* Danger Button */}
            <CustomButton
              title="🗑️  Hapus Semua Transaksi"
              onPress={handleClearDatabase}
              variant="danger"
              loading={isClearing}
              disabled={isClearing}
            />
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════════ */}
        <Text className="text-muted text-xs text-center mt-8">
          Cashy Lite v1.0.0 • Dibuat dengan ❤️ menggunakan React Native & Expo
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
