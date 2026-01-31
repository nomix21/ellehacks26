import { Text, StyleSheet, ImageBackground } from 'react-native';

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={require('../../assets/images/stars.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>GirlMath</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '600',
  },
});
