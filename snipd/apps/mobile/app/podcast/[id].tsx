import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getEpisodes } from "@/lib/api";
import { Episode } from "@snipd/shared";
import { formatDuration, formatRelativeDate, truncate } from "@snipd/shared";
import { usePlayerStore } from "@/store/playerStore";

const BRAND = "#6147ff";
const BG = "#0a0a12";
const CARD = "#0f0f1a";
const BORDER = "#1a1a2e";
const TEXT = "#f0f0f5";
const MUTED = "#666680";

export default function PodcastScreen() {
  const { id, feedUrl, title, image } = useLocalSearchParams<{ id: string; feedUrl: string; title: string; image: string }>();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { loadEpisode, currentEpisode } = usePlayerStore();

  useEffect(() => {
    getEpisodes(feedUrl, id, title, image)
      .then((data) => setEpisodes(data.episodes ?? []))
      .finally(() => setLoading(false));
  }, [feedUrl, id, title, image]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={20} color={TEXT} />
          <Text style={{ color: TEXT, fontSize: 16 }}>Back</Text>
        </TouchableOpacity>

        {/* Podcast header */}
        <View style={styles.podcastHeader}>
          {image && <Image source={{ uri: image }} style={styles.podcastImage} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.podcastTitle} numberOfLines={2}>{title}</Text>
            <Text style={{ color: MUTED, fontSize: 13 }}>{episodes.length} episodes</Text>
          </View>
        </View>

        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={BRAND} />
          </View>
        ) : (
          <FlatList
            data={episodes}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isActive = currentEpisode?.id === item.id;
              return (
                <View style={[styles.episodeCard, isActive && styles.episodeCardActive]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.episodeTitle, isActive && { color: BRAND }]} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.episodeDesc} numberOfLines={2}>{truncate(item.description, 120)}</Text>
                    <View style={{ flexDirection: "row", gap: 12, marginTop: 6 }}>
                      <Text style={styles.episodeMeta}>{formatRelativeDate(item.publishedAt)}</Text>
                      {item.duration > 0 && <Text style={styles.episodeMeta}>{formatDuration(item.duration)}</Text>}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.playBtn, isActive && styles.playBtnActive]}
                    onPress={() => { loadEpisode(item); router.push("/player"); }}
                  >
                    <Ionicons name="play" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 12 },
  podcastHeader: { flexDirection: "row", gap: 16, marginBottom: 20, alignItems: "center" },
  podcastImage: { width: 80, height: 80, borderRadius: 16 },
  podcastTitle: { fontSize: 20, fontWeight: "700", color: "#f0f0f5", marginBottom: 4, letterSpacing: -0.3 },
  episodeCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: CARD, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: BORDER },
  episodeCardActive: { borderColor: "rgba(97,71,255,0.4)", backgroundColor: "rgba(97,71,255,0.08)" },
  episodeTitle: { fontSize: 14, fontWeight: "600", color: "#f0f0f5", marginBottom: 4, lineHeight: 20 },
  episodeDesc: { fontSize: 12, color: MUTED, lineHeight: 17 },
  episodeMeta: { fontSize: 11, color: MUTED },
  playBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#1a1a2e", alignItems: "center", justifyContent: "center" },
  playBtnActive: { backgroundColor: BRAND },
});
