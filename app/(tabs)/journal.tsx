import { saveJournalEntry, saveQuestionnaire } from "@/api/call_backend";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import {useSession} from "@/app/context/SessionContext";

export default function Journal() {
  //questionnaire stuff
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [confidence, setConfidence] = useState(5);
  const [difficulty, setDifficulty] = useState(5);
  const [learningText, setLearningText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [metYesterdayGoal, setMetYesterdayGoal] = useState<boolean>(false);
  const [tomorrowGoal, setTomorrowGoal] = useState<string>("");
  //journal stuff
  const [journalTitle, setJournalTitle] = useState<string>("");
  const [journalContent, setJournalContent] = useState<string>("");
  // custom metrics
  const [customMetrics, setCustomMetrics] = useState<
    { id: string; label: string; value: number }[]
  >([]);
  const [addingMetric, setAddingMetric] = useState(false);
  const [newMetricLabel, setNewMetricLabel] = useState("");

  const emojis = ["😄", "🙂", "😐", "😞", "😢"];
  const {userId} = useSession()
  const addMetric = () => {
    const label = newMetricLabel.trim();
    if (!label) return;

    // Prevent duplicates (case-insensitive)
    const exists = customMetrics.some(
      (m) => m.label.toLowerCase() === label.toLowerCase()
    );
    if (exists) {
      Alert.alert("Already added", "You already have a metric with that name.");
      return;
    }

    setCustomMetrics((prev) => [
      ...prev,
      { id: String(Date.now()), label, value: 5 },
    ]);
    setNewMetricLabel("");
    setAddingMetric(false);
  };

  const updateMetricValue = (id: string, value: number) => {
    setCustomMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, value } : m))
    );
  };

  const buildQuizPayload = useCallback(() => {
    return {
      date: new Date().toISOString(),
      user_ID: userId,
      tomorrow: tomorrowGoal,
      yesterday_goal: metYesterdayGoal,
      quiz: {
        how_are_you_feeling_emoji: selectedEmoji,
        confidence_level: confidence,
        topic_difficulty: difficulty,
        what_did_you_learn_today: learningText,
        custom_metrics: customMetrics.reduce((acc, m) => {
          acc[m.label] = m.value;
          return acc;
        }, {} as Record<string, number>),
      },
    };
  }, [
    selectedEmoji,
    learningText,
    confidence,
    difficulty,
    tomorrowGoal,
    metYesterdayGoal,
    customMetrics,
  ]);

  const handleSave = useCallback(async (): Promise<void> => {
    setSaved(false);
    const payload = buildQuizPayload();
    const payloadJournal = {
      date: Math.floor(Date.now() / 1000), // integer seconds
      title: journalTitle,
      content: journalContent,
      user_ID: userId,
    };
    setLoading(true);

    try {
      await saveQuestionnaire(payload);
      await saveJournalEntry(payloadJournal);
      Alert.alert("Saved", "Journal entry saved successfully.");
      // mark success
      setSaved(true);
    } catch (err: any) {
      Alert.alert("Save failed", err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [buildQuizPayload, journalTitle, journalContent]);

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.date}>
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </Text>

      <Text style={styles.label}>How do you feel today?</Text>
      <View style={styles.emojiRow}>
        {emojis.map((e) => {
          const selected = e === selectedEmoji;
          return (
            <Pressable
              key={e}
              onPress={() => setSelectedEmoji(e)}
              style={[
                styles.emojiButton,
                selected ? styles.emojiButtonSelected : undefined,
              ]}
            >
              <Text style={styles.emoji}>{e}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>What did you learn today?</Text>
      <TextInput
        style={styles.input}
        placeholder="Today I learned about..."
        placeholderTextColor="#666"
        value={learningText}
        onChangeText={setLearningText}
        multiline
      />

      <Text style={styles.label}>How confident do you feel?</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={confidence}
        onValueChange={setConfidence}
        minimumTrackTintColor={
          confidence <= 1.67
            ? "#95a5d5"
            : confidence <= 3.33
              ? "#a695d5"
              : confidence <= 5
                ? "#e07aa6"
                : confidence <= 6.67
                  ? "#e17f56"
                  : confidence <= 8.33
                    ? "#e1c473"
                    : "#9fdc70"
        }
        maximumTrackTintColor="#444"
        thumbTintColor={
          confidence <= 1.67
            ? "#95a5d5"
            : confidence <= 3.33
              ? "#a695d5"
              : confidence <= 5
                ? "#e07aa6"
                : confidence <= 6.67
                  ? "#e17f56"
                  : confidence <= 8.33
                    ? "#e1c473"
                    : "#9fdc70"
        }
      />
      <Text style={styles.sliderValue}>{confidence}</Text>

    <Text style={styles.label}>How hard was the topic?</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={difficulty}
        onValueChange={setDifficulty}
        minimumTrackTintColor={
          difficulty <= 1.67
            ? "#95a5d5"
            : difficulty <= 3.33
              ? "#a695d5"
              : difficulty <= 5
                ? "#e07aa6"
                : difficulty <= 6.67
                  ? "#e17f56"
                  : difficulty <= 8.33
                    ? "#e1c473"
                    : "#9fdc70"
        }
        maximumTrackTintColor="#444"
        thumbTintColor={
          difficulty <= 1.67
            ? "#95a5d5"
            : difficulty <= 3.33
              ? "#a695d5"
              : difficulty <= 5
                ? "#e07aa6"
                : difficulty <= 6.67
                  ? "#e17f56"
                  : difficulty <= 8.33
                    ? "#e1c473"
                    : "#9fdc70"
        }
      />
      <Text style={styles.sliderValue}>{difficulty}</Text>

      <View style={styles.metricActionsRow}>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => setAddingMetric((v) => !v)}
          style={styles.plusSquircle}
          accessibilityLabel="Add a custom metric"
        >
          <Text style={styles.plusText}>+</Text>
        </Pressable>
      </View>

      {addingMetric ? (
        <View style={styles.addMetricRow}>
          <TextInput
            value={newMetricLabel}
            onChangeText={setNewMetricLabel}
            placeholder="Add custom metric (e.g., focus, stress)"
            placeholderTextColor="#777"
            style={styles.addMetricInput}
          />
          <Pressable onPress={addMetric} style={styles.addMetricBtn}>
            <Text style={styles.addMetricBtnText}>Add</Text>
          </Pressable>
        </View>
      ) : null}

      {customMetrics.map((m) => (
        <View key={m.id} style={styles.customMetricBlock}>
          <Text style={styles.label}>{m.label}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={m.value}
            onValueChange={(v) => updateMetricValue(m.id, v)}
            minimumTrackTintColor="#e1c473"
            maximumTrackTintColor="#444"
            thumbTintColor="#e1c473"
          />
          <Text style={styles.sliderValue}>{m.value}</Text>
        </View>
      ))}

  <View style={styles.switchRow}>
    <Text style={styles.switchLabel}>Did you meet the goal you set yesterday?</Text>
    <Switch
      value={metYesterdayGoal}
      onValueChange={setMetYesterdayGoal}
      thumbColor={metYesterdayGoal ? "#9fdc70" : "#fff"}
      trackColor={{ false: "#555", true: "#9fdc70" }}
    />
  </View>

      <Text style={styles.label}>What will you aim for tomorrow?</Text>
      <TextInput
        style={styles.input}
        placeholder="My goal for tomorrow is..."
        placeholderTextColor="#666"
        value={tomorrowGoal}
        onChangeText={setTomorrowGoal}
        multiline
      />

      <View style={styles.section}>
        <Text style={styles.label}>Journal Title</Text>
        <TextInput
          style={styles.input}
          value={journalTitle}
          onChangeText={setJournalTitle}
          placeholder="Enter title"
          textAlignVertical="top"
          placeholderTextColor="#666"
        />
        <Text style={styles.label}>Journal Content</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={journalContent}
          onChangeText={setJournalContent}
          placeholder="Write your journal entry..."
          placeholderTextColor="#666"
          multiline
          textAlignVertical="top"
          numberOfLines={6}
        />
      </View>

      <LinearGradient
        colors={[
          "#D0AA7D",
          "#CCA872",
          "#CB8B6A",
          "#e07aa6",
          "#a695d5",
          "#95a5d5",
        ]} // Your extracted palette
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.saveGradient}
      >
        <Pressable
          style={[
            styles.saveButton,
            loading ? styles.saveButtonDisabled : null,
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Journal</Text>
          )}
        </Pressable>
      </LinearGradient>

      {saved ? <Text style={styles.savedText}>Saved ✓</Text> : null}
      <View style={{ height: 140 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "#1b1b1b",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  date: {
    color: "#fff",
    fontSize: 34,
    marginBottom: 12,
    marginTop: 18,
    fontFamily: "Brawler",
  },
  label: {
    color: "#ccc",
    marginTop: 24,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
  },
  switchLabel: {
    color: "#ccc",
    fontSize: 16,
    flex: 1,
    paddingRight: 16,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 25,
  },
  emoji: {
    fontSize: 28,
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  emojiButton: {
    padding: 5,
    borderRadius: 100,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 48,
  },
  emojiButtonSelected: {
    backgroundColor: "#56773c",
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#444",
    marginTop: 8,
    minHeight: 100,
    textAlignVertical: "top",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  slider: {
    width: "100%",
    height: 48,
    marginTop: 8,
  },
  sliderValue: {
    color: "#ccc",
    marginTop: 4,
    fontSize: 16,
  },
  metricActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  plusSquircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: "#ddd",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 22,
  },
  addMetricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  addMetricInput: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#444",
  },
  addMetricBtn: {
    borderRadius: 14,
    backgroundColor: "#CC6692",
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addMetricBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  customMetricBlock: {
    marginTop: 0,
  },
  bottomCard: {
    position: "absolute",
    bottom: 34, // Above tab bar
    left: 24,
    right: 24,
  },
  saveGradient: {
    borderRadius: 16, // Rounded outer gradient
    padding: 2, // Thin gradient border effect
    marginTop: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  saveButton: {
    //backgroundColor: "#1B1B1B",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    flex: 1,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  savedText: {
    color: "#4CAF50",
    marginTop: 12,
    fontSize: 14,
  },
  section: { marginTop: 24 },
  multiline: { height: 140, marginTop: 8 },
});
