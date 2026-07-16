import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> ¡Conectado por QR!</Text>
      <Text style={styles.subtitle}>Sin emulador - Directo a tu celular</Text>
      <Button
        title="✅ ¡Funciona!"
        onPress={() => Alert.alert('Éxito', 'Tu app móvil está corriendo sin emulador 🎉')}
        color="#000000"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
});