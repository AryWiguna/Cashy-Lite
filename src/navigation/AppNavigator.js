import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// ─── Screen Imports ─────────────────────────────────────────
import DashboardScreen    from "../screens/DashboardScreen";
import HistoryScreen      from "../screens/HistoryScreen";
import ProfileScreen      from "../screens/ProfileScreen";
import AddTransactionScreen from "../screens/AddTransactionScreen";

// ─── Navigator Factories ────────────────────────────────────
const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const TabIcon = ({ emoji, label, focused }) => (
  <View className="items-center justify-center pt-1">
    <Text style={{ fontSize: 22 }}>{emoji}</Text>
    <Text
      className={`text-xs mt-0.5 font-medium ${
        focused ? "text-primary" : "text-muted"
      }`}
    >
      {label}
    </Text>
  </View>
);

// ============================================================
// MainTabs — Bottom Tab Navigator
// Wraps the three main tab screens.
// ============================================================
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      // ── Hide the default React Navigation header ──
      // Each screen manages its own Header component for
      // full styling control via NativeWind.
      headerShown: false,

      // ── Tab Bar Styling ──────────────────────────
      tabBarStyle: {
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        height: Platform.OS === "ios" ? 85 : 65,
        paddingBottom: Platform.OS === "ios" ? 25 : 8,
        paddingTop: 8,
        // Subtle shadow above the tab bar
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 10,
      },

      // Hide default labels — our TabIcon component renders them
      tabBarShowLabel: false,
    }}
  >
    {/* ── Tab 1: Dashboard ──────────────────────── */}
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="🏠" label="Beranda" focused={focused} />
        ),
      }}
    />

    {/* ── Tab 2: History ────────────────────────── */}
    <Tab.Screen
      name="History"
      component={HistoryScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="📋" label="Riwayat" focused={focused} />
        ),
      }}
    />

    {/* ── Tab 3: Profile ────────────────────────── */}
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="👤" label="Profil" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

// ============================================================
// AppNavigator — Root Stack Navigator (Default Export)
// Wraps MainTabs and adds AddTransaction as a modal screen.
// ============================================================
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        // All headers are managed per-screen via the Header component
        headerShown: false,
      }}
    >
      {/* ── Main App with Bottom Tabs ──────────── */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
      />

      {/* ── Add Transaction Modal ──────────────── */}
      {/* presentation="modal" makes this screen slide up from the
          bottom on iOS and animate in from the bottom on Android. */}
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          // Show a native header for the modal with a close gesture
          headerShown: true,
          headerTitle: "Tambah Transaksi",
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
            color: "#1F2937",
          },
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
