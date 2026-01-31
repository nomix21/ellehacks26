// screens/JournalScreen.js
import Slider from "@react-native-community/slider";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function JournalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>Tuesday, April 1</Text>

      <Text style={styles.label}>How do you feel today?</Text>
      <Text style={styles.emoji}>😄 🙂 😐 😞 😢</Text>

      <Text style={styles.label}>What did you learn today?</Text>
      <TextInput style={styles.input} />

      <Text style={styles.label}>How confident do you feel?</Text>
      <Slider minimumValue={0} maximumValue={10} />

      <Text style={styles.label}>How hard was the topic?</Text>
      <Slider minimumValue={0} maximumValue={10} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#111" },
  date: { color: "#fff", fontSize: 22, marginBottom: 16 },
  label: { color: "#ccc", marginTop: 24 },
  emoji: { fontSize: 24, marginTop: 8 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
});
