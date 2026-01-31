// screens/WelcomeScreen.js
import { ImageBackground, StyleSheet, Text } from "react-native"; // import ImageBackground

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={require("../assets/stars.png")} // placeholder
      style={styles.container}
    >
      <Text style={styles.title}>GirlMath</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  title: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "600",
  },
});
