// screens/LoginScreen.js
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  return (
    <LinearGradient
      //colors={["#e1ac73","#e17f56", "#a695d5","#e07aa6"]}
      colors={["#e07aa6", "#a695d5", "#e1ac73"]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create your account</Text>

        <TextInput placeholder="Email" style={styles.input} />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 36,
    padding: 24,
    marginHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    height: 600,
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "300",
    fontFamily: "Brawler",
  },
  input: {
    borderWidth: 1,
    borderColor: "#f7a",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#ff8fb1",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
