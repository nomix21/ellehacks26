import { ImageBackground, StyleSheet } from "react-native";

export default function index() {
  return (
    <ImageBackground
      source={require("../../assets/images/welcome.png")}
      style={[styles.container, { width: '100%', height: '100%' }]}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B1B1B",
  },
  
});
