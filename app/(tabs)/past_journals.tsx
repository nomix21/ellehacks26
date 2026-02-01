import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
} from "react-native";
import { getAll } from "@/api/call_backend";
import { useSession } from "@/app/context/SessionContext";

type JournalItem = {
    journal_id?: string;
    user_ID?: string;
    title?: string;
    content?: string;
    date?: number | string;
};

type QuizItem = {
    quiz_id?: string;
    user_ID?: string;
    date?: number | string;
    score?: number;
    yesterday_goal?: boolean | number;
    tomorrow?: string;
    quiz?: {
        how_are_you_feeling_emoji?: string;
        confidence_level?: number;
        topic_difficulty?: number;
        what_did_you_learn_today?: string;
        [k: string]: any;
    };
};

export default function PastJournalsAndQuizzes() {
    const { userId } = useSession();
    const [journals, setJournals] = useState<JournalItem[]>([]);
    const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            if (userId) {
                const res = await getAll(userId);
                if (Array.isArray(res)) {
                    const js: JournalItem[] = res.filter((r: any) => r.content);
                    const qs: QuizItem[] = res.filter((r: any) => r.quiz || r.score !== undefined || r.yesterday_goal !== undefined);
                    setJournals(js);
                    setQuizzes(qs);
                } else if (res && typeof res === "object") {
                    setJournals(Array.isArray(res.journals) ? res.journals : Array.isArray(res.journal) ? res.journal : []);
                    setQuizzes(Array.isArray(res.quizzes) ? res.quizzes : Array.isArray(res.quiz) ? res.quiz : []);
                } else {
                    setJournals([]);
                    setQuizzes([]);
                }
            } else {
                setJournals([
                    {
                        journal_id: "placeholder-j-1",
                        title: "Today I finally understood fractions",
                        content:
                            "I practiced fraction addition for 30 minutes. Breaking problems into smaller steps made everything click — I can now add mixed numbers confidently. I used visual diagrams and it helped a lot.",
                        date: Math.floor(Date.now() / 1000) - 2 * 86400,
                    },
                ]);
                setQuizzes([
                    {
                        quiz_id: "placeholder-q-1",
                        date: Math.floor(Date.now() / 1000) - 4 * 86400,
                        yesterday_goal: true,
                        tomorrow: "Review mixed numbers",
                        quiz: {
                            how_are_you_feeling_emoji: "🙂",
                            confidence_level: 8,
                            topic_difficulty: 3,
                            what_did_you_learn_today: "Visual fraction addition",
                        },
                    },
                ]);
            }
        } catch (err: any) {
            Alert.alert("Unable to load entries", err?.message ?? "Unknown error");
            setJournals([]);
            setQuizzes([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const renderDate = (d?: number | string) => {
        if (d === undefined || d === null) return "";
        try {
            const ts =
                typeof d === "number"
                    ? d
                    : isNaN(Number(d))
                        ? Date.parse(String(d))
                        : Number(d);
            const date = new Date(
                typeof ts === "number" && String(ts).length <= 13 && ts > 1e12 ? ts : ts * 1000
            );
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return String(d);
        }
    };

    const onPressJournal = (j: JournalItem) => {
        Alert.alert(j.title ?? "Journal", j.content ?? "");
    };

    const onPressQuiz = (q: QuizItem) => {
        const parts: string[] = [];
        if (q.quiz?.how_are_you_feeling_emoji) parts.push(`Feeling: ${q.quiz.how_are_you_feeling_emoji}`);
        if (q.quiz?.confidence_level !== undefined) parts.push(`Confidence: ${q.quiz.confidence_level}`);
        if (q.quiz?.topic_difficulty !== undefined) parts.push(`Difficulty: ${q.quiz.topic_difficulty}`);
        if (q.quiz?.what_did_you_learn_today) parts.push(`Learned: ${q.quiz.what_did_you_learn_today}`);
        if (q.yesterday_goal !== undefined) parts.push(`Met yesterday goal: ${q.yesterday_goal ? "Yes" : "No"}`);
        if (q.tomorrow) parts.push(`Tomorrow: ${q.tomorrow}`);
        Alert.alert("Quiz details", parts.join("\n") || JSON.stringify(q, null, 2));
    };

    return (
        <View style={styles.screenBackground}>
            <LinearGradient
                colors={["#e07aa6", "#a695d5", "#e1ac73"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <Text style={styles.header}>Past entries</Text>

                    {loading ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator color="#fff" />
                            <Text style={styles.loadingText}>Loading…</Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>Journals</Text>
                            {journals.length === 0 ? (
                                <View style={styles.empty}>
                                    <Text style={styles.emptyTitle}>No journals yet</Text>
                                    <Text style={styles.emptyBody}>Write a journal and it will appear here.</Text>
                                </View>
                            ) : (
                                journals.map((j) => (
                                    <Pressable
                                        key={j.journal_id ?? j.title}
                                        onPress={() => onPressJournal(j)}
                                        style={styles.card}
                                    >
                                        <View style={styles.cardHeader}>
                                            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                                                {j.title || "Untitled"}
                                            </Text>
                                            <Text style={styles.cardDate}>{renderDate(j.date)}</Text>
                                        </View>
                                        <Text style={styles.cardContent} numberOfLines={6} ellipsizeMode="tail">
                                            {j.content ?? ""}
                                        </Text>
                                    </Pressable>
                                ))
                            )}

                            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Quizzes</Text>
                            {quizzes.length === 0 ? (
                                <View style={styles.empty}>
                                    <Text style={styles.emptyTitle}>No quizzes yet</Text>
                                    <Text style={styles.emptyBody}>Quizzes will appear here after you complete them.</Text>
                                </View>
                            ) : (
                                quizzes.map((q) => (
                                    <Pressable
                                        key={q.quiz_id ?? String(q.date)}
                                        onPress={() => onPressQuiz(q)}
                                        style={styles.card}
                                    >
                                        <View style={styles.cardHeader}>
                                            <Text style={styles.cardTitle}>Quiz</Text>
                                            <Text style={styles.cardDate}>{renderDate(q.date)}</Text>
                                        </View>

                                        {/* questionnaire-like layout */}
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Feeling</Text>
                                            <Text style={styles.detailValue}>{q.quiz?.how_are_you_feeling_emoji ?? "-"}</Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Confidence</Text>
                                            <Text style={styles.detailValue}>
                                                {q.quiz?.confidence_level ?? (q.score !== undefined ? `${q.score}/10` : "-")}
                                            </Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Difficulty</Text>
                                            <Text style={styles.detailValue}>{q.quiz?.topic_difficulty ?? "-"}</Text>
                                        </View>

                                        {q.quiz?.what_did_you_learn_today ? (
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailLabel}>Learned</Text>
                                                <Text style={[styles.detailValue, styles.learnedText]} numberOfLines={3} ellipsizeMode="tail">
                                                    {q.quiz.what_did_you_learn_today}
                                                </Text>
                                            </View>
                                        ) : null}

                                        {q.yesterday_goal !== undefined || q.tomorrow ? (
                                            <>
                                                <View style={styles.detailRow}>
                                                    <Text style={styles.detailLabel}>Met yesterday goal</Text>
                                                    <Text style={styles.detailValue}>{q.yesterday_goal ? "Yes" : "No"}</Text>
                                                </View>
                                                <View style={styles.detailRow}>
                                                    <Text style={styles.detailLabel}>Tomorrow</Text>
                                                    <Text style={[styles.detailValue, styles.learnedText]} numberOfLines={2} ellipsizeMode="tail">
                                                        {q.tomorrow ?? "-"}
                                                    </Text>
                                                </View>
                                            </>
                                        ) : null}
                                    </Pressable>
                                ))
                            )}
                        </>
                    )}

                    <View style={{ height: 140 }} />
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    screenBackground: {
        flex: 1,
        backgroundColor: "#1B1B1B",
    },
    container: {
        borderRadius: 32,
        margin: 16,
        padding: 20,
        flex: 1,
        backgroundColor: "transparent",
    },
    scroll: {
        paddingBottom: 24,
    },
    header: {
        color: "#fff",
        fontSize: 34,
        marginBottom: 8,
        fontFamily: "Brawler",
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        marginTop: 8,
        marginBottom: 6,
        fontWeight: "700",
    },
    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 24,
        gap: 12,
    },
    loadingText: {
        color: "#fff",
        marginLeft: 12,
    },
    empty: {
        marginTop: 12,
        padding: 16,
        backgroundColor: "rgba(0,0,0,0.25)",
        borderRadius: 14,
    },
    emptyTitle: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 6,
    },
    emptyBody: {
        color: "#ddd",
    },
    card: {
        backgroundColor: "#121212",
        borderRadius: 16,
        padding: 14,
        marginTop: 12,
        borderWidth: 1,
        borderColor: "#222",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        overflow: "hidden", // keep children clipped and avoid date spilling out
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    cardTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        flex: 1,
        marginRight: 8,
    },
    cardDate: {
        color: "#bbb",
        fontSize: 12,
        flexShrink: 0, // keep date on same line and inside the card
    },
    cardContent: {
        color: "#ddd",
        marginTop: 6,
        lineHeight: 20,
        fontSize: 14,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: 8,
    },
    detailLabel: {
        color: "#ccc",
        fontSize: 14,
        flex: 0.45,
    },
    detailValue: {
        color: "#fff",
        fontSize: 14,
        flex: 0.55,
        textAlign: "right",
    },
    learnedText: {
        textAlign: "right",
    },
});
