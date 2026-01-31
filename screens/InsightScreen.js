// screens/InsightScreen.js
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function InsightScreen() {
  return (
    <LinearGradient
      colors={['#ff9a9e', '#fad0c4', '#fbc2eb']}
      style={styles.container}
    >
      <Text style={styles.text}>You accomplished 5 goals this week.</Text>
      <Text style={styles.text}>Your confidence has doubled.</Text>
      <Text style={styles.text}>Overall, you were happy.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 32,
    margin: 16,
    padding: 24,
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 24,
  },
});
