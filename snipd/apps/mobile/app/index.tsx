import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const BRAND = "#6147ff";
const BG = "#0a0a12";
const CARD = "#0f0f1a";
const BORDER = "#1a1a2e";
const TEXT = "#f0f0f5";
const MUTED = "#666680";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={["#6147ff", "#a78bfa"]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <Ionicons name="headset" size={20} color="white" />
          </LinearGradient>
          <Text style={styles.logoText}>Snipd</Text>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome back</Text>
          <Text style={styles.heroSub}>
            Capture podcast moments with AI-powered transcription and summaries.
          </Text>
        </View>

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get started</Text>
          {[
            { label: "Discover Podcasts", sub: "Search thousands of shows", icon: "compass", route: "/discover" as const },
            { label: "My Snips", sub: "Captured moments & notes", icon: "cut", route: "/snips" as const },
            { label: "Now Playing", sub: "Audio player", icon: "play-circle", route: "/player" as const },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.card}
              onPress={() => router.push(item.route)}
              activeOpacity={0.7}
            >
              <View style={styles.cardIcon}>
                <Ionicons name={item.icon as never} size={20} color={BRAND} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={MUTED} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { flexDirection: "row", alignItems: "center", gap: 10, padding: 20, paddingBottom: 8 },
  logoGradient: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 22, fontWeight: "700", color: TEXT },
  hero: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  heroTitle: { fontSize: 32, fontWeight: "700", color: TEXT, marginBottom: 8, letterSpacing: -0.5 },
  heroSub: { fontSize: 15, color: MUTED, lineHeight: 22 },
  section: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: MUTED, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 },
  card: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: BORDER },
  cardIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(97,71,255,0.15)", alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 15, fontWeight: "600", color: TEXT, marginBottom: 2 },
  cardSub: { fontSize: 13, color: MUTED },
});
