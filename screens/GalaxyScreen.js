// screens/GalaxyScreen.js
import { StyleSheet, Text, View } from "react-native";

export default function GalaxyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Username’s Galaxy</Text>
      <View style={styles.oval} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingTop: 64 },
  title: { color: "#fff", fontSize: 22, textAlign: "center" },
  oval: {
    marginTop: 32,
    alignSelf: "center",
    width: 260,
    height: 400,
    borderRadius: 200,
    borderWidth: 2,
    borderColor: "#ffb347",
  },
});
