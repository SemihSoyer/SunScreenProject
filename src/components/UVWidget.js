import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UVWidget({ uvForecast, sunrise, sunset }) {
  if (!uvForecast || uvForecast.length === 0 || !sunrise || !sunset) {
    return null;
  }

  const currentUV = uvForecast[0]?.uv;

  const getUVInfo = (uv) => {
    const uvIndex = Number(uv);
    if (uvIndex <= 2) return { icon: 'sunny-outline', color: '#87CEEB', level: 'Düşük' };
    if (uvIndex <= 5) return { icon: 'sunny-outline', color: '#4A90E2', level: 'Orta' };
    if (uvIndex <= 7) return { icon: 'warning-outline', color: '#FF9500', level: 'Yüksek' };
    if (uvIndex <= 10) return { icon: 'warning', color: '#FF3B30', level: 'Çok Yüksek' };
    return { icon: 'alert-circle', color: '#AF52DE', level: 'Aşırı' };
  };

  const uvInfo = getUVInfo(currentUV);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UV İndeksi</Text>
      
      <View style={[styles.uvContainer, { borderColor: uvInfo.color }]}>
        <Ionicons name={uvInfo.icon} size={32} color={uvInfo.color} />
        <Text style={[styles.uvValue, { color: uvInfo.color }]}>{currentUV}</Text>
        <Text style={[styles.uvLevel, { color: uvInfo.color }]}>{uvInfo.level}</Text>
      </View>

      <View style={styles.sunTimesContainer}>
        <View style={styles.sunTimeBox}>
          <Ionicons name="sunrise-outline" size={24} color="#FF9500" />
          <Text style={styles.sunTimeText}>{sunrise}</Text>
        </View>
        
        <View style={styles.sunTimeBox}>
          <Ionicons name="sunset-outline" size={24} color="#FF4500" />
          <Text style={styles.sunTimeText}>{sunset}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2C3E50',
  },
  uvContainer: {
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    width: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  uvValue: {
    fontSize: 48,
    fontWeight: '800',
    marginVertical: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  uvLevel: {
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sunTimesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  sunTimeBox: {
    alignItems: 'center',
    padding: 10,
  },
  sunTimeText: {
    fontSize: 16,
    color: '#2C3E50',
    marginTop: 5,
    fontWeight: '500',
  }
});