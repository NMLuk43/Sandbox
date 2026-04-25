import { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { searchPodcasts } from "@/lib/api";
import { Podcast } from "@snipd/shared";
import { truncate } from "@snipd/shared";

const BRAND = "#6147ff";
const BG = "#0a0a12";
const CARD = "#0f0f1a";
const BORDER = "#1a1a2e";
const TEXT = "#f0f0f5";
const MUTED = "#666680";
const INPUT_BG = "#13131f";

export default function DiscoverScreen() {
  const [query, setQuery] = useState("");
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await searchPodcasts(q || undefined);
      setPodcasts(data.podcasts ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(""); }, [load]);

  useEffect(() => {
    if (!query) { load(""); return; }
    const t = setTimeout(() => load(query), 400);
    return () => clearTimeout(t);
  }, [query, load]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <View style={styles.container}>
        <Text style={styles.title}>Discover</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={MUTED} style={{ marginLeft: 12 }} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search podcasts…"
            placeholderTextColor={MUTED}
          />
          {loading && <ActivityIndicator size="small" color={BRAND} style={{ marginRight: 12 }} />}
        </View>

        <FlatList
          data={podcasts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({
                pathname: "/podcast/[id]",
                params: { id: item.id, feedUrl: item.feedUrl, title: item.title, image: item.imageUrl },
              })}
              activeOpacity={0.7}
            >
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              ) : (
                <View style={[styles.image, { alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a2e" }]}>
                  <Ionicons name="headset" size={24} color={MUTED} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardAuthor} numberOfLines={1}>{item.author}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{truncate(item.description, 100)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={MUTED} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            loading ? null : (
              <View style={{ alignItems: "center", padding: 40 }}>
                <Ionicons name="search" size={40} color={MUTED} style={{ marginBottom: 12 }} />
                <Text style={{ color: MUTED }}>No podcasts found</Text>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: "700", color: TEXT, marginBottom: 16, marginTop: 8, letterSpacing: -0.5 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: INPUT_BG, borderRadius: 16, borderWidth: 1, borderColor: BORDER, marginBottom: 16, gap: 8 },
  searchInput: { flex: 1, height: 48, color: TEXT, fontSize: 15, paddingHorizontal: 4 },
  card: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: CARD, borderRadius: 16, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: BORDER },
  image: { width: 60, height: 60, borderRadius: 12 },
  cardTitle: { fontSize: 14, fontWeight: "600", color: TEXT, marginBottom: 2 },
  cardAuthor: { fontSize: 12, color: MUTED, marginBottom: 4 },
  cardDesc: { fontSize: 12, color: MUTED, lineHeight: 17 },
});
