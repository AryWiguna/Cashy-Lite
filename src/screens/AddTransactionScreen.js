import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

// ─── Local Imports ───────────────────────────────────────────
import CustomButton     from "../components/CustomButton";
import { addTransaction } from "../services/db";
import { getTodayISO }  from "../utils/formatDate";

// ─── Category Definitions ────────────────────────────────────
// Same category list as TransactionCard for consistency.
const CATEGORIES = [
  { label: "Makanan",      emoji: "🍜" },
  { label: "Transportasi", emoji: "🚌" },
  { label: "Hiburan",      emoji: "🎬" },
  { label: "Kesehatan",    emoji: "💊" },
  { label: "Pendidikan",   emoji: "📚" },
  { label: "Belanja",      emoji: "🛍️" },
  { label: "Tagihan",      emoji: "🧾" },
  { label: "Lainnya",      emoji: "📦" },
];

// ============================================================
// AddTransactionScreen Component
// ============================================================
const AddTransactionScreen = ({ navigation }) => {
  // ─── Form State ────────────────────────────────────────────
  const [title,       setTitle]       = useState("");
  const [amount,      setAmount]      = useState("");
  const [category,    setCategory]    = useState(""); // Selected category label
  const [date,        setDate]        = useState(getTodayISO()); // Pre-filled: today
  const [receiptUri,  setReceiptUri]  = useState(null); // Local file URI or null
  const [isSaving,    setIsSaving]    = useState(false);

  // ─── Image Picker Logic ─────────────────────────────────────
  const handlePickImage = useCallback(async (source) => {
    try {
      let result;

      if (source === "camera") {
        // Request camera permission before opening
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Izin Diperlukan",
            "Cashy Lite memerlukan izin kamera untuk mengambil foto struk."
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,   // Allow the user to crop the image
          aspect: [4, 3],        // Enforce a landscape aspect ratio for receipts
          quality: 0.7,          // 70% quality — balanced file size vs. clarity
        });
      } else {
        // Request media library permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Izin Diperlukan",
            "Cashy Lite memerlukan akses galeri untuk memilih foto struk."
          );
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.7,
        });
      }

      // `canceled` is the correct spelling in expo-image-picker v16+
      if (!result.canceled && result.assets.length > 0) {
        // ✅ SAVE ONLY THE URI — NOT base64 or BLOB
        setReceiptUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Gagal membuka kamera/galeri.");
      console.error("[AddTransaction] handlePickImage error:", error);
    }
  }, []);

  /**
   * showImagePickerOptions()
   * Presents an action sheet letting the user choose the source.
   */
  const showImagePickerOptions = useCallback(() => {
    Alert.alert(
      "Lampirkan Struk",
      "Pilih sumber foto struk:",
      [
        {
          text: "📷 Kamera",
          onPress: () => handlePickImage("camera"),
        },
        {
          text: "🖼️ Galeri",
          onPress: () => handlePickImage("library"),
        },
        {
          text: "Batal",
          style: "cancel",
        },
      ]
    );
  }, [handlePickImage]);

  // ─── Form Validation ────────────────────────────────────────
  const validateForm = useCallback(() => {
    if (!title.trim()) {
      Alert.alert("Validasi", "Judul transaksi tidak boleh kosong.");
      return false;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Validasi", "Masukkan jumlah yang valid (lebih dari 0).");
      return false;
    }
    if (!category) {
      Alert.alert("Validasi", "Pilih kategori transaksi.");
      return false;
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert("Validasi", "Format tanggal harus YYYY-MM-DD.");
      return false;
    }
    return true;
  }, [title, amount, category, date]);

  // ─── Submit Handler ─────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      addTransaction({
        title:       title.trim(),
        amount:      parseFloat(amount),
        category:    category,
        date:        date,
        receipt_uri: receiptUri, // null if no image was picked
      });

      // Show success feedback then navigate back
      Alert.alert(
        "✅ Berhasil!",
        "Transaksi berhasil disimpan.",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate back to the Dashboard tab
              navigation.navigate("MainTabs", { screen: "Dashboard" });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan transaksi. Coba lagi.");
      console.error("[AddTransaction] handleSubmit error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [validateForm, title, amount, category, date, receiptUri, navigation]);

  // ─── Render ─────────────────────────────────────────────────
  return (
    // KeyboardAvoidingView shifts content up when the keyboard appears,
    // preventing form inputs from being hidden behind it.
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >

        {/* ════════════════════════════════════════════════
            FIELD 1 — Transaction Title
        ════════════════════════════════════════════════ */}
        <View className="mb-5">
          <Text className="text-gray-700 font-semibold text-sm mb-2">
            📝 Judul Transaksi
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Contoh: Makan siang di warteg"
            placeholderTextColor="#9CA3AF"
            maxLength={100}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-gray-800 text-base"
          />
        </View>

        {/* ════════════════════════════════════════════════
            FIELD 2 — Amount
        ════════════════════════════════════════════════ */}
        <View className="mb-5">
          <Text className="text-gray-700 font-semibold text-sm mb-2">
            💰 Jumlah (IDR)
          </Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4">
            <Text className="text-gray-500 text-base font-medium mr-2">Rp</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="flex-1 py-4 text-gray-800 text-base font-semibold"
            />
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            FIELD 3 — Category Picker (Grid)
            A visual grid of TouchableOpacity buttons is
            used instead of a native Picker/Select to avoid
            platform-specific inconsistencies and provide
            a much richer UX.
        ════════════════════════════════════════════════ */}
        <View className="mb-5">
          <Text className="text-gray-700 font-semibold text-sm mb-3">
            🏷️ Kategori
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.label;
              return (
                <TouchableOpacity
                  key={cat.label}
                  onPress={() => setCategory(cat.label)}
                  className={`flex-row items-center px-3 py-2.5 rounded-xl border-2 ${
                    isSelected
                      ? "bg-primary border-primary"
                      : "bg-white border-gray-200"
                  }`}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
                  <Text
                    className={`ml-1.5 text-sm font-medium ${
                      isSelected ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ════════════════════════════════════════════════
            FIELD 4 — Date
        ════════════════════════════════════════════════ */}
        <View className="mb-5">
          <Text className="text-gray-700 font-semibold text-sm mb-2">
            📅 Tanggal (YYYY-MM-DD)
          </Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="2024-07-15"
            placeholderTextColor="#9CA3AF"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-gray-800 text-base"
          />
          <Text className="text-muted text-xs mt-1.5 ml-1">
            Format: Tahun-Bulan-Hari (contoh: 2024-07-15)
          </Text>
        </View>

        {/* ════════════════════════════════════════════════
            FIELD 5 — Receipt Image (expo-image-picker)
        ════════════════════════════════════════════════ */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold text-sm mb-3">
            📷 Lampiran Struk (opsional)
          </Text>

          {receiptUri ? (
            /* ── Receipt Preview ── */
            <View>
              <Image
                source={{ uri: receiptUri }}
                className="w-full h-48 rounded-2xl"
                resizeMode="cover"
              />
              {/* URI display — for educational/demo purposes */}
              <Text className="text-muted text-xs mt-2 ml-1" numberOfLines={2}>
                💾 Disimpan sebagai URI:{"\n"}{receiptUri}
              </Text>
              {/* Button to clear the selected image */}
              <TouchableOpacity
                onPress={() => setReceiptUri(null)}
                className="mt-2 self-start flex-row items-center"
              >
                <Text className="text-expense text-sm font-medium">
                  ✕ Hapus foto
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ── Upload Placeholder ── */
            <TouchableOpacity
              onPress={showImagePickerOptions}
              activeOpacity={0.7}
              className="h-36 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center bg-gray-50"
            >
              <Text style={{ fontSize: 32 }}>📎</Text>
              <Text className="text-gray-600 font-semibold mt-2">
                Lampirkan Foto Struk
              </Text>
              <Text className="text-muted text-xs mt-1">
                Kamera atau Galeri
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ════════════════════════════════════════════════
            SUBMIT BUTTON
        ════════════════════════════════════════════════ */}
        <CustomButton
          title="Simpan Transaksi"
          onPress={handleSubmit}
          variant="primary"
          loading={isSaving}
          disabled={isSaving}
        />

        {/* Cancel / Go Back */}
        <CustomButton
          title="Batal"
          onPress={() => navigation.goBack()}
          variant="ghost"
          className="mt-2"
        />

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddTransactionScreen;
