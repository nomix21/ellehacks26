

import Ionicons from "@expo/vector-icons/Ionicons";
import { aiRequest, getAll } from "@/api/call_backend";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSession } from "@/app/context/SessionContext";

type TimelineItem = {
  type: "quiz" | "journal";
  date: number; // unix seconds
  raw: any;
};

function toUnixSeconds(v: any): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    // ISO string or numeric string
    const asNum = Number(v);
    if (!Number.isNaN(asNum) && v.trim() !== "") return asNum;
    const ms = Date.parse(v);
    if (!Number.isNaN(ms)) return Math.floor(ms / 1000);
  }
  return 0;
}

function pickDate(obj: any): number {
  // Try common date keys we’ve used across the app/backend
  return (
    toUnixSeconds(obj?.date) ||
    toUnixSeconds(obj?.timestamp) ||
    toUnixSeconds(obj?.created_at) ||
    0
  );
}

function mergeByDateDesc(a: any[], b: any[]): TimelineItem[] {
  // a and b are each assumed to already be MOST RECENT -> OLDEST
  const out: TimelineItem[] = [];

  let i = 0;
  let j = 0;

  while (i < a.length || j < b.length) {
    const qa = i < a.length ? a[i] : null;
    const jb = j < b.length ? b[j] : null;

    const ta = qa ? pickDate(qa) : -1;
    const tb = jb ? pickDate(jb) : -1;

    if (jb == null || (qa != null && ta >= tb)) {
      out.push({ type: "quiz", date: ta, raw: qa });
      i += 1;
    } else {
      out.push({ type: "journal", date: tb, raw: jb });
      j += 1;
    }
  }

  return out;
}

function formatDate(unixSeconds: number): string {
  if (!unixSeconds) return "";
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function History() {
  const { userId } = useSession();

  const [loading, setLoading] = useState(false);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [readJournal, setReadJournal] = useState(true);
  const [readQuizzes, setReadQuizzes] = useState(true);
  const [mentorPrompt, setMentorPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [aiErrorText, setAiErrorText] = useState<string | null>(null);

  const current = useMemo(() => timeline[idx] ?? null, [timeline, idx]);

  useEffect(() => {
    const run = async () => {
      if (!userId) {
        setTimeline([]);
        setIdx(0);
        return;
      }

      setLoading(true);
      try {
        const res: any = await getAll(userId);

        // Be defensive about backend response keys
        const quizzes =
          res?.quizzes ??
          res?.quiz_entries ??
          res?.quiz_history ??
          res?.quiz ??
          [];
        const journals =
          res?.journals ??
          res?.journal_entries ??
          res?.journal_history ??
          res?.journal ??
          [];

        const quizArr = Array.isArray(quizzes) ? quizzes : [];
        const journalArr = Array.isArray(journals) ? journals : [];

        const merged = mergeByDateDesc(quizArr, journalArr);
        setTimeline(merged);
        setIdx(0); // default to most recent
      } catch (e: any) {
        Alert.alert("Failed to load history", e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [userId]);

  const goOlder = () => {
    setIdx((v) => Math.min(v + 1, Math.max(0, timeline.length - 1)));
  };

  const goNewer = () => {
    setIdx((v) => Math.max(v - 1, 0));
  };

  const submitMentorChat = async () => {
    if (!userId) {
      Alert.alert("Not signed in", "Sign in to chat with your mentor.");
      return;
    }

    const content = mentorPrompt.trim();
    if (!content) {
      Alert.alert("Missing message", "Type a message to send.");
      return;
    }

    setAiResponseText(null);
    setAiErrorText(null);

    setAiLoading(true);
    try {
      // IMPORTANT: payload keys must match backend expectations exactly
      const unixDate = Number(Math.floor(Date.now() / 1000));
      const payload = {
        content,
        user_ID: String(userId),
        read_journal: !!readJournal,
        read_quizzes: !!readQuizzes,
      };

      console.log("ai payload", payload, {
        userIdType: typeof payload.user_ID,
      });

      const res: any = await aiRequest(payload);

      // Try a few common keys; fallback to JSON string
      const msg =
        res?.response ??
        res?.message ??
        res?.content ??
        (typeof res === "string" ? res : JSON.stringify(res, null, 2));

      setAiResponseText(String(msg));
    } catch (e: any) {
      const errMsg = e?.message ?? "Unknown error";
      setAiErrorText(String(errMsg));
    } finally {
      setAiLoading(false);
    }
  };

  const leftDisabled = idx >= timeline.length - 1;
  const rightDisabled = idx <= 0;

  if (!userId) {
    return (
      <View style={styles.screenContainer}>
        <Text style={styles.emptyText}>Sign in to view your history.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top navigation bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={goOlder}
          disabled={leftDisabled}
          style={[styles.navBtn, leftDisabled ? styles.navBtnDisabled : null]}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </Pressable>

        <Text style={styles.topTitle}>History</Text>

        <Pressable
          onPress={goNewer}
          disabled={rightDisabled}
          style={[styles.navBtn, rightDisabled ? styles.navBtnDisabled : null]}
        >
          <Ionicons name="chevron-forward" size={28} color="#fff" />
        </Pressable>
      </View>

      {loading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator color="#fff" />
        </View>
      ) : timeline.length === 0 ? (
        <Text style={styles.emptyText}>No history yet.</Text>
      ) : (
        <>
          <Text style={styles.date}>{formatDate(current?.date ?? 0)}</Text>

          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>
                {current?.type === "quiz" ? "Quiz" : "Journal"}
              </Text>
            </View>
            <Text style={styles.counterText}>
              {idx + 1} / {timeline.length}
            </Text>
          </View>

          <LinearGradient
            colors={["#D0AA7D", "#CB8B6A", "#e07aa6", "#a695d5", "#95a5d5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.card}>
              {current?.type === "journal" ? (
                <JournalCard entry={current.raw} />
              ) : (
                <QuizCard entry={current.raw} />
              )}
            </View>
          </LinearGradient>
        </>
      )}

      {/* Mentor chat */}
      <View style={styles.mentorBox}>
        <Text style={styles.mentorTitle}>Chat with mentor</Text>

        <Pressable
          onPress={() => setReadJournal((v) => !v)}
          style={styles.checkboxRow}
        >
          <Ionicons
            name={readJournal ? "checkbox" : "square-outline"}
            size={22}
            color={readJournal ? "#CC6692" : "#bbb"}
          />
          <Text style={styles.checkboxLabel}>Allow AI to read your past journals</Text>
        </Pressable>

        <Pressable
          onPress={() => setReadQuizzes((v) => !v)}
          style={styles.checkboxRow}
        >
          <Ionicons
            name={readQuizzes ? "checkbox" : "square-outline"}
            size={22}
            color={readQuizzes ? "#CC6692" : "#bbb"}
          />
          <Text style={styles.checkboxLabel}>Allow AI to read your past quizzes</Text>
        </Pressable>

        <TextInput
          value={mentorPrompt}
          onChangeText={setMentorPrompt}
          placeholder="Chat with mentor"
          placeholderTextColor="#777"
          multiline
          style={styles.mentorInput}
        />

        <Pressable
          onPress={submitMentorChat}
          disabled={aiLoading}
          style={[styles.submitBtn, aiLoading ? styles.submitBtnDisabled : null]}
        >
          <Text style={styles.submitBtnText}>
            {aiLoading ? "Sending…" : "Submit"}
          </Text>
        </Pressable>

        {aiErrorText ? (
          <Text style={styles.mentorErrorText}>{aiErrorText}</Text>
        ) : null}

        {aiResponseText ? (
          <Text style={styles.mentorResponseText}>{aiResponseText}</Text>
        ) : null}
      </View>

      <View style={{ height: 140 }} />
    </ScrollView>
  );
}

function QuizCard({ entry }: { entry: any }) {
  // Backend shape can vary; try both nested and flat keys
  const quiz = entry?.quiz ?? entry ?? {};

  const emoji =
    quiz?.how_are_you_feeling_emoji ?? quiz?.emoji ?? quiz?.mood ?? "";
  const confidence =
    quiz?.confidence_level ?? quiz?.confidence ?? quiz?.Q1 ?? null;
  const difficulty =
    quiz?.topic_difficulty ?? quiz?.difficulty ?? quiz?.Q2 ?? null;
  const learned =
    quiz?.what_did_you_learn_today ?? quiz?.learning ?? quiz?.Q3 ?? "";

  const tomorrow = entry?.tomorrow ?? quiz?.tomorrow ?? "";
  const yesterdayGoal =
    entry?.yesterday_goal ?? entry?.metYesterdayGoal ?? quiz?.yesterday_goal;

  return (
    <View>
      <Text style={styles.sectionTitle}>Quiz Snapshot</Text>

      {!!emoji && <Text style={styles.bigEmoji}>{emoji}</Text>}

      <View style={styles.kvRow}>
        <Text style={styles.kLabel}>Confidence</Text>
        <Text style={styles.kValue}>{confidence ?? "—"}</Text>
      </View>

      <View style={styles.kvRow}>
        <Text style={styles.kLabel}>Difficulty</Text>
        <Text style={styles.kValue}>{difficulty ?? "—"}</Text>
      </View>

      <Text style={styles.subLabel}>What did you learn?</Text>
      <Text style={styles.bodyText}>{learned || "—"}</Text>

      <Text style={styles.subLabel}>Tomorrow goal</Text>
      <Text style={styles.bodyText}>{tomorrow || "—"}</Text>

      <Text style={styles.subLabel}>Met yesterday goal?</Text>
      <Text style={styles.bodyText}>
        {typeof yesterdayGoal === "boolean"
          ? yesterdayGoal
            ? "Yes"
            : "No"
          : yesterdayGoal != null
            ? String(yesterdayGoal)
            : "—"}
      </Text>
    </View>
  );
}

function JournalCard({ entry }: { entry: any }) {
  const title = entry?.title ?? "Untitled";
  const content = entry?.content ?? entry?.text ?? "";

  return (
    <View>
      <Text style={styles.sectionTitle}>Journal Entry</Text>
      <Text style={styles.journalTitle}>{title}</Text>
      <Text style={styles.bodyText}>{content || "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "#1b1b1b",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 18,
  },
  topTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  navBtnDisabled: {
    opacity: 0.35,
  },
  date: {
    color: "#fff",
    fontSize: 34,
    marginBottom: 12,
    marginTop: 6,
    fontFamily: "Brawler",
  },
  pillRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 14,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#444",
  },
  pillText: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "600",
  },
  counterText: {
    color: "#777",
    fontSize: 13,
  },
  cardGradient: {
    borderRadius: 18,
    padding: 2,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#111",
    padding: 18,
  },
  emptyText: {
    color: "#aaa",
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  bigEmoji: {
    fontSize: 44,
    textAlign: "center",
    marginBottom: 12,
  },
  kvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  kLabel: {
    color: "#ccc",
    fontSize: 15,
  },
  kValue: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  subLabel: {
    color: "#ccc",
    marginTop: 14,
    fontSize: 15,
  },
  journalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  bodyText: {
    color: "#ddd",
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
  },
  mentorBox: {
    marginTop: 22,
    borderRadius: 16,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
    padding: 16,
  },
  mentorTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  checkboxLabel: {
    color: "#ddd",
    fontSize: 14,
    flex: 1,
  },
  mentorInput: {
    marginTop: 10,
    minHeight: 90,
    borderRadius: 14,
    backgroundColor: "#0b0b0b",
    borderWidth: 1,
    borderColor: "#222",
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
    textAlignVertical: "top",
  },
  submitBtn: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: "#CC6692",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  mentorErrorText: {
    marginTop: 10,
    color: "#ffb3b3",
    fontSize: 13,
    lineHeight: 18,
  },
  mentorResponseText: {
    marginTop: 10,
    color: "#eee",
    fontSize: 14,
    lineHeight: 20,
  },
});
