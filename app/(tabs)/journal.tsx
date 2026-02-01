import { useState, useCallback } from "react";
import { StyleSheet, View, Text, TextInput, ScrollView, Pressable, ActivityIndicator, Alert, Switch} from "react-native";
import Slider from "@react-native-community/slider";
import {saveQuestionnaire} from "@/api/call_backend";
import { saveJournalEntry } from '@/api/call_backend';

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

    const emojis = ["😄", "🙂", "😐", "😞", "😢"];


    const buildQuizPayload = useCallback(() => {
        return {
            date: new Date().toISOString(),
            user_ID: "",
            tomorrow: tomorrowGoal,
            yesterday_goal: metYesterdayGoal,
            quiz: {"how_are_you_feeling_emoji":selectedEmoji,"confidence_level":confidence,"topic_difficulty":difficulty,"what_did_you_learn_today":learningText},
        };
    }, [selectedEmoji, learningText, confidence, difficulty, tomorrowGoal, metYesterdayGoal]);

    const handleSave = useCallback(async (): Promise<void> => {
        setSaved(false);
        const payload = buildQuizPayload();
        const payloadJournal = {
            date: Math.floor(Date.now() / 1000), // integer seconds
            title: journalTitle,
            content: journalContent,
            user_ID: '', // empty for now; replace with real user ID when available
        };
        setLoading(true);

        try {

            await saveQuestionnaire(payload);
            await saveJournalEntry(payloadJournal);
            Alert.alert('Saved', 'Journal entry saved successfully.');
            // mark success
            setSaved(true);
        } catch (err: any) {
            Alert.alert("Save failed", err?.message ?? "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [buildQuizPayload, journalTitle, journalContent]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.date}>Tuesday, April 1</Text>

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
                placeholder="Write something..."
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
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#444"
                thumbTintColor="#4CAF50"
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
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#444"
                thumbTintColor="#4CAF50"
            />
            <Text style={styles.sliderValue}>{difficulty}</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Did you meet the goal you set yesterday?</Text>
                <Switch
                    value={metYesterdayGoal}
                    onValueChange={setMetYesterdayGoal}
                    thumbColor={metYesterdayGoal ? "#4CAF50" : "#fff"}
                    trackColor={{ false: "#555", true: "#2e7d32" }}
                />
            </View>

            <Text style={styles.label}>Goal for tomorrow</Text>
            <TextInput
                style={styles.input}
                placeholder="What will you aim for tomorrow?"
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
                />
                <Text style={styles.label}>Journal Content</Text>
                <TextInput
                    style={[styles.input, styles.multiline]}
                    value={journalContent}
                    onChangeText={setJournalContent}
                    placeholder="Write your journal entry..."
                    multiline
                    textAlignVertical="top"
                    numberOfLines={6}
                />
            </View>

            <Pressable
                style={[styles.saveButton, loading ? styles.saveButtonDisabled : null]}
                onPress={handleSave}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#111" />
                ) : (
                    <Text style={styles.saveButtonText}>Save Journal</Text>
                )}
            </Pressable>

            {saved ? <Text style={styles.savedText}>Saved ✓</Text> : null}
            <View style={{ height: 140 }}/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#111",
    },
    date: {
        color: "#fff",
        fontSize: 22,
        marginBottom: 16,},
    label: {
        color: "#ccc",
        marginTop: 24,
        fontSize: 16,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16,
    },
    emojiRow: {
        flexDirection: "row",
        marginTop: 8,
        gap: 12,
    },
    emoji: {
        fontSize: 24,
        marginTop: 8,color: "#fff",
    },
    emojiButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#222",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 48,
    },
    emojiButtonSelected: {
        backgroundColor: "#4CAF50",
    },
    input: {
        backgroundColor: "#222",
        color: "#fff",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#444",
        marginTop: 8,
        minHeight: 100,
        textAlignVertical: "top",
    },
    slider: {
        width: "100%",
        height: 40,
        marginTop: 8,
    },
    sliderValue: {
        color: "#ccc",
        marginTop: 4,
        fontSize: 16,
    },
    saveButton: {
        marginTop: 28,
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: "#111",
        fontSize: 16,
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
