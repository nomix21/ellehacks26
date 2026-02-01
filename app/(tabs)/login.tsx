// screens/LoginScreen.js
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const API_BASE = "http://147.182.158.24:7000";

  const onSignIn = async () => {
    if (!email.trim() || !name.trim()) {
      Alert.alert("Missing info", "Enter name and email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      setUserId(data.user_id);
      console.log("LOGIN OK, USER ID:", data.user_id);
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#e07aa6", "#a695d5", "#e1ac73"]}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create your account</Text>

        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={onSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Signing in..." : "Sign In"}</Text>
        </TouchableOpacity>

        {userId && (
          <Text style={{ marginTop: 20 }}>User ID: {userId}</Text>
        )}
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
    height: 500,
    justifyContent: "center",
  },
  title: { fontSize: 28, marginBottom: 24, textAlign: "center" },
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
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
