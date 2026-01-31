import { ImageBackground, StyleSheet, Text } from "react-native";

export default function index() {
  return (
    <ImageBackground
      source={require("../../assets/images/stars.png")}
      style={styles.container}
      resizeMode="contain"
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
    backgroundColor: "#1B1B1B",
  },
  title: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "600",
  },
});
