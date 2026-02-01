import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export default function insights() {
  return (
    <LinearGradient
      colors={["#ff9a9e", "#e3bef0", "#c386cf"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.text}>You accomplished 5 goals this week!</Text>
          <Text style={styles.text}>
            Your confidence in geometry has doubled from last month.
          </Text>
          <Text style={styles.text}>
            Overall, you were feeling happy this week.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    //background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #fbc2eb 100%)", // Not supported in RN
    borderRadius: 32,
    margin: 16,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%", // Or use a fixed number, e.g., 400
  },
  innerContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 28,
    marginBottom: 50,
    marginTop: 50,
    textAlign: "center",
  },
});
