import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

const BRAND = "#6147ff";
const BG = "#0a0a12";
const TAB_BG = "#0f0f1a";
const INACTIVE = "#555570";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={BG} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: BRAND,
          tabBarInactiveTintColor: INACTIVE,
          tabBarStyle: {
            backgroundColor: TAB_BG,
            borderTopColor: "rgba(255,255,255,0.06)",
            borderTopWidth: 1,
            height: 88,
            paddingBottom: 28,
            paddingTop: 10,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600", marginTop: 2 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="discover"
          options={{ title: "Discover", tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="snips"
          options={{ title: "Snips", tabBarIcon: ({ color, size }) => <Ionicons name="cut" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="player"
          options={{ title: "Player", tabBarIcon: ({ color, size }) => <Ionicons name="headset" size={size} color={color} /> }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
