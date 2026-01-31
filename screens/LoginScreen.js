// screens/LoginScreen.js
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  return (
    <LinearGradient
      colors={['#ff9a9e', '#fad0c4', '#fad0c4']}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create your account</Text>

        <TextInput placeholder="Email" style={styles.input} />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
  },
  title: { fontSize: 22, marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#f7a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ff8fb1',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
