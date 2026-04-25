import { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, TextInput, Modal, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { usePlayerStore } from "@/store/playerStore";
import { formatDuration, secondsToTimestamp } from "@snipd/shared";
import { transcribeSnip, summarizeSnip, saveSnip } from "@/lib/api";

const BRAND = "#6147ff";
const BG = "#0a0a12";
const CARD = "#0f0f1a";
const TEXT = "#f0f0f5";
const MUTED = "#666680";

const RATES = [0.75, 1, 1.25, 1.5, 1.75, 2];

export default function PlayerScreen() {
  const {
    currentEpisode, isPlaying, currentTime, duration, playbackRate,
    togglePlayback, seekTo, setPlaybackRate, isSnipping, snipStartTime, startSnip, stopSnip,
  } = usePlayerStore();

  const [showSnipModal, setShowSnipModal] = useState(false);
  const [snipEnd, setSnipEnd] = useState(0);
  const [snipTitle, setSnipTitle] = useState("");
  const [snipNote, setSnipNote] = useState("");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!currentEpisode) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="headset" size={60} color={MUTED} style={{ marginBottom: 16 }} />
          <Text style={{ color: MUTED, fontSize: 16 }}>Nothing playing yet</Text>
          <Text style={{ color: MUTED, fontSize: 13, marginTop: 8 }}>Browse Discover to find a podcast</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = duration > 0 ? currentTime / duration : 0;

  const handleSnip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isSnipping) {
      startSnip();
    } else {
      const start = stopSnip();
      if (start !== null) {
        setSnipEnd(currentTime);
        setSnipTitle(`Snip from ${currentEpisode.title}`);
        setTranscript(null);
        setSummary(null);
        setShowSnipModal(true);
      }
    }
  };

  const handleTranscribe = async () => {
    if (!snipStartTime) return;
    setTranscribing(true);
    const data = await transcribeSnip(currentEpisode.audioUrl, snipStartTime, snipEnd);
    setTranscript(data.transcript ?? null);
    setTranscribing(false);
  };

  const handleSummarize = async () => {
    if (!transcript) return;
    setSummarizing(true);
    const data = await summarizeSnip(transcript, currentEpisode.title, currentEpisode.podcastTitle);
    setSummary(data.summary ?? null);
    setSummarizing(false);
  };

  const handleSave = async () => {
    if (!snipStartTime) return;
    setSaving(true);
    await saveSnip({
      episodeId: currentEpisode.id,
      episodeTitle: currentEpisode.title,
      podcastTitle: currentEpisode.podcastTitle,
      podcastImageUrl: currentEpisode.podcastImageUrl,
      audioUrl: currentEpisode.audioUrl,
      startTime: snipStartTime,
      endTime: snipEnd,
      title: snipTitle || `Snip from ${currentEpisode.title}`,
      note: snipNote,
      transcript,
      aiSummary: summary,
      tags: [],
    });
    setSaving(false);
    setShowSnipModal(false);
    Alert.alert("Saved!", "Your snip has been saved.");
  };

  const cycleRate = () => {
    const idx = RATES.indexOf(playbackRate);
    setPlaybackRate(RATES[(idx + 1) % RATES.length]);
    Haptics.selectionAsync();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Artwork */}
        <View style={styles.artworkContainer}>
          {currentEpisode.podcastImageUrl ? (
            <Image source={{ uri: currentEpisode.podcastImageUrl }} style={styles.artwork} />
          ) : (
            <View style={[styles.artwork, { alignItems: "center", justifyContent: "center", backgroundColor: CARD }]}>
              <Ionicons name="headset" size={60} color={MUTED} />
            </View>
          )}
        </View>

        {/* Episode info */}
        <View style={styles.infoContainer}>
          <Text style={styles.podcastName}>{currentEpisode.podcastTitle}</Text>
          <Text style={styles.episodeTitle} numberOfLines={2}>{currentEpisode.title}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatDuration(currentTime)}</Text>
            <Text style={styles.timeText}>{formatDuration(duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => seekTo(currentTime - 15)} style={styles.controlBtn}>
            <Ionicons name="play-back" size={24} color={TEXT} />
            <Text style={styles.controlLabel}>15</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { togglePlayback(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
            <LinearGradient colors={["#6147ff", "#a78bfa"]} style={styles.playBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" style={!isPlaying && { marginLeft: 3 }} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => seekTo(currentTime + 15)} style={styles.controlBtn}>
            <Ionicons name="play-forward" size={24} color={TEXT} />
            <Text style={styles.controlLabel}>15</Text>
          </TouchableOpacity>
        </View>

        {/* Aux controls */}
        <View style={styles.auxControls}>
          <TouchableOpacity onPress={cycleRate} style={styles.auxBtn}>
            <Text style={styles.rateText}>{playbackRate}x</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSnip} style={[styles.snipBtn, isSnipping && styles.snipBtnActive]}>
            <Ionicons name="cut" size={18} color={isSnipping ? "#facc15" : BRAND} />
            <Text style={[styles.snipText, isSnipping && { color: "#facc15" }]}>
              {isSnipping ? (snipStartTime !== null ? "End Snip" : "Snipping…") : "Snip"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Snip indicator */}
        {isSnipping && snipStartTime !== null && (
          <View style={styles.snipIndicator}>
            <Ionicons name="recording" size={14} color="#facc15" />
            <Text style={{ color: "#facc15", fontSize: 13 }}>
              Snipping from {secondsToTimestamp(snipStartTime)}…
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Snip modal */}
      <Modal visible={showSnipModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: TEXT }}>Save Snip</Text>
              <TouchableOpacity onPress={() => setShowSnipModal(false)}>
                <Ionicons name="close" size={24} color={MUTED} />
              </TouchableOpacity>
            </View>

            <Text style={{ color: MUTED, fontSize: 13 }}>
              {secondsToTimestamp(snipStartTime ?? 0)} → {secondsToTimestamp(snipEnd)} ({formatDuration(snipEnd - (snipStartTime ?? 0))})
            </Text>

            <TextInput
              style={styles.input}
              value={snipTitle}
              onChangeText={setSnipTitle}
              placeholder="Title…"
              placeholderTextColor={MUTED}
            />

            <TextInput
              style={[styles.input, { height: 80 }]}
              value={snipNote}
              onChangeText={setSnipNote}
              placeholder="Add a note…"
              placeholderTextColor={MUTED}
              multiline
            />

            {transcript ? (
              <View style={styles.transcriptBox}>
                <Text style={{ color: TEXT, fontSize: 13, lineHeight: 20 }}>{transcript}</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.aiBtn} onPress={handleTranscribe} disabled={transcribing}>
                {transcribing ? <ActivityIndicator size="small" color={BRAND} /> : <Ionicons name="mic" size={18} color={BRAND} />}
                <Text style={{ color: BRAND, fontWeight: "600" }}>{transcribing ? "Transcribing…" : "Auto-transcribe"}</Text>
              </TouchableOpacity>
            )}

            {transcript && !summary && (
              <TouchableOpacity style={styles.aiBtn} onPress={handleSummarize} disabled={summarizing}>
                {summarizing ? <ActivityIndicator size="small" color={BRAND} /> : <Ionicons name="sparkles" size={18} color={BRAND} />}
                <Text style={{ color: BRAND, fontWeight: "600" }}>{summarizing ? "Summarizing…" : "Generate AI Summary"}</Text>
              </TouchableOpacity>
            )}

            {summary && (
              <View style={styles.summaryBox}>
                <Text style={{ color: "#a78bfa", fontSize: 12, fontWeight: "600", marginBottom: 6 }}>AI SUMMARY</Text>
                <Text style={{ color: "#e0d7ff", fontSize: 14, lineHeight: 22 }}>{summary}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>Save Snip</Text>}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: "center", gap: 24, paddingBottom: 40 },
  artworkContainer: { shadowColor: "#6147ff", shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.4, shadowRadius: 40 },
  artwork: { width: 280, height: 280, borderRadius: 24 },
  infoContainer: { width: "100%", alignItems: "center" },
  podcastName: { fontSize: 13, color: MUTED, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  episodeTitle: { fontSize: 20, fontWeight: "700", color: TEXT, textAlign: "center", lineHeight: 28, letterSpacing: -0.3 },
  progressContainer: { width: "100%", gap: 8 },
  progressTrack: { height: 4, backgroundColor: "#1a1a2e", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: BRAND, borderRadius: 2 },
  timeRow: { flexDirection: "row", justifyContent: "space-between" },
  timeText: { fontSize: 12, color: MUTED, fontVariant: ["tabular-nums"] as never },
  controls: { flexDirection: "row", alignItems: "center", gap: 32 },
  controlBtn: { alignItems: "center" },
  controlLabel: { color: MUTED, fontSize: 11, marginTop: 2 },
  playBtn: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  auxControls: { flexDirection: "row", gap: 16 },
  auxBtn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: CARD, borderRadius: 12, borderWidth: 1, borderColor: "#1a1a2e" },
  rateText: { color: TEXT, fontWeight: "700", fontSize: 14 },
  snipBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "rgba(97,71,255,0.1)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(97,71,255,0.3)" },
  snipBtnActive: { backgroundColor: "rgba(250,204,21,0.1)", borderColor: "rgba(250,204,21,0.3)" },
  snipText: { color: BRAND, fontWeight: "600", fontSize: 14 },
  snipIndicator: { flexDirection: "row", alignItems: "center", gap: 6, padding: 10, backgroundColor: "rgba(250,204,21,0.1)", borderRadius: 12 },
  input: { backgroundColor: CARD, borderWidth: 1, borderColor: "#1a1a2e", borderRadius: 14, padding: 14, color: TEXT, fontSize: 15 },
  transcriptBox: { backgroundColor: CARD, borderWidth: 1, borderColor: "#1a1a2e", borderRadius: 14, padding: 14 },
  summaryBox: { backgroundColor: "rgba(97,71,255,0.1)", borderWidth: 1, borderColor: "rgba(97,71,255,0.3)", borderRadius: 14, padding: 14 },
  aiBtn: { flexDirection: "row", alignItems: "center", gap: 8, padding: 14, backgroundColor: "rgba(97,71,255,0.1)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(97,71,255,0.3)" },
  saveBtn: { backgroundColor: BRAND, borderRadius: 16, padding: 18, alignItems: "center" },
});
