import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// Giriş ekranı bileşeni
export default function EntryScreen({ navigation }) {
  const handleGetStarted = () => {
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      {/* Giriş sayfası başlığı */}
      <Text style={styles.title}>Giriş Sayfası Başlığı</Text>
      {/* Uygulama açıklaması */}
      <Text style={styles.description}>Uygulama Açıklaması</Text>
      {/* Kullanım talimatları */}
      <Text style={styles.instructions}>Nasıl Kullanılır?</Text>
      {/* Ana sayfaya geçiş butonu */}
      <Button
        title="Buton Metni"
        onPress={handleGetStarted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
  },
});
