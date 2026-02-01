import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export default function insights() {
  return (
    <LinearGradient
      colors={["#CC6692", "#e1ac73", "#e17f56", "#a695d5", "#e07aa6"]}
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
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  innerContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 32,
    marginBottom: 50,
    marginTop: 50,
    textAlign: "left",
    alignItems: "flex-start",
    fontFamily: "Brawler",
  },
});
