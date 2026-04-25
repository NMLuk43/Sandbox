import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getSnips } from "@/lib/api";
import { Snip } from "@snipd/shared";
import { formatDuration, formatRelativeDate } from "@snipd/shared";

const BRAND = "#6147ff";
const BG = "#0a0a12";
const CARD = "#0f0f1a";
const BORDER = "#1a1a2e";
const TEXT = "#f0f0f5";
const MUTED = "#666680";

interface RawSnip {
  id: string;
  user_id: string;
  episode_id: string;
  episode_title: string;
  podcast_title: string;
  podcast_image_url: string;
  audio_url: string;
  start_time: number;
  end_time: number;
  title: string;
  note?: string;
  transcript?: string;
  ai_summary?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export default function SnipsScreen() {
  const [snips, setSnips] = useState<Snip[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getSnips()
      .then((data) =>
        setSnips(
          (data.snips ?? []).map((s: RawSnip) => ({
            id: s.id,
            userId: s.user_id,
            episodeId: s.episode_id,
            episodeTitle: s.episode_title,
            podcastTitle: s.podcast_title,
            podcastImageUrl: s.podcast_image_url,
            audioUrl: s.audio_url,
            startTime: s.start_time,
            endTime: s.end_time,
            title: s.title,
            note: s.note,
            transcript: s.transcript,
            aiSummary: s.ai_summary,
            tags: s.tags ?? [],
            createdAt: s.created_at,
            updatedAt: s.updated_at,
          }))
        )
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={BRAND} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text style={styles.title}>My Snips</Text>
        <Text style={{ color: MUTED, fontSize: 13, marginBottom: 16 }}>{snips.length} captured moments</Text>

        {snips.length === 0 ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="cut" size={48} color={MUTED} style={{ marginBottom: 12 }} />
            <Text style={{ color: TEXT, fontSize: 16, fontWeight: "600", marginBottom: 6 }}>No snips yet</Text>
            <Text style={{ color: MUTED, fontSize: 13, textAlign: "center", maxWidth: 220 }}>
              Play a podcast and tap Snip to capture key moments.
            </Text>
          </View>
        ) : (
          <FlatList
            data={snips}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => setExpanded(expanded === item.id ? null : item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  {item.podcastImageUrl && (
                    <Image source={{ uri: item.podcastImageUrl }} style={styles.image} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.snipTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.snipMeta}>{item.podcastTitle}</Text>
                    <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
                      <Text style={styles.snipMeta}>{formatDuration(item.endTime - item.startTime)}</Text>
                      <Text style={styles.snipMeta}>{formatRelativeDate(item.createdAt)}</Text>
                    </View>
                  </View>
                  <Ionicons name={expanded === item.id ? "chevron-up" : "chevron-down"} size={16} color={MUTED} />
                </View>

                {expanded === item.id && (
                  <View style={styles.expanded}>
                    {item.aiSummary && (
                      <View style={styles.summaryBox}>
                        <Text style={styles.summaryLabel}>AI SUMMARY</Text>
                        <Text style={styles.summaryText}>{item.aiSummary}</Text>
                      </View>
                    )}
                    {item.transcript && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={styles.summaryLabel}>TRANSCRIPT</Text>
                        <Text style={{ color: TEXT, fontSize: 13, lineHeight: 20, marginTop: 4 }}>{item.transcript}</Text>
                      </View>
                    )}
                    {item.note && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={styles.summaryLabel}>MY NOTE</Text>
                        <Text style={{ color: TEXT, fontSize: 13, lineHeight: 20, marginTop: 4 }}>{item.note}</Text>
                      </View>
                    )}
                    {item.tags.length > 0 && (
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                        {item.tags.map((tag) => (
                          <View key={tag} style={styles.tag}>
                            <Text style={{ color: MUTED, fontSize: 11 }}>#{tag}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", color: "#f0f0f5", marginTop: 8, marginBottom: 4, letterSpacing: -0.5 },
  card: { backgroundColor: CARD, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: BORDER },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  image: { width: 48, height: 48, borderRadius: 10 },
  snipTitle: { fontSize: 14, fontWeight: "600", color: "#f0f0f5", lineHeight: 20 },
  snipMeta: { fontSize: 12, color: MUTED },
  expanded: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: BORDER },
  summaryBox: { backgroundColor: "rgba(97,71,255,0.1)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(97,71,255,0.25)" },
  summaryLabel: { fontSize: 10, fontWeight: "700", color: MUTED, letterSpacing: 1 },
  summaryText: { color: "#e0d7ff", fontSize: 13, lineHeight: 20, marginTop: 4 },
  tag: { backgroundColor: "#1a1a2e", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
});
