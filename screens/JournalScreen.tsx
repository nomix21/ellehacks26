import { useState } from "react";

export default function JournalScreen() {
  const [confidence, setConfidence] = useState(5);
  const [difficulty, setDifficulty] = useState(5);

  return (
    <div style={styles.container}>
      <p style={styles.date}>Tuesday, April 1</p>

      <p style={styles.label}>How do you feel today?</p>
      <div style={styles.emoji}>😄 🙂 😐 😞 😢</div>

      <p style={styles.label}>What did you learn today?</p>
      <input
        type="text"
        style={styles.input}
        placeholder="Write something..."
      />

      <p style={styles.label}>How confident do you feel?</p>
      <input
        type="range"
        min="0"
        max="10"
        value={confidence}
        onChange={(e) => setConfidence(Number(e.target.value))}
        style={{ width: "100%" }}
      />
      <span style={styles.sliderValue}>{confidence}</span>

      <p style={styles.label}>How hard was the topic?</p>
      <input
        type="range"
        min="0"
        max="10"
        value={difficulty}
        onChange={(e) => setDifficulty(Number(e.target.value))}
        style={{ width: "100%" }}
      />
      <span style={styles.sliderValue}>{difficulty}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#111",
    minHeight: "100vh",
  },
  date: { color: "#fff", fontSize: 22, marginBottom: 16, margin: 0 },
  label: { color: "#ccc", marginTop: 24 },
  emoji: { fontSize: 24, marginTop: 8 },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #444",
    marginTop: 8,
    width: "100%",
    boxSizing: "border-box",
  },
  sliderValue: { color: "#ccc", marginLeft: 12 },
};