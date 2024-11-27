import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WeatherCard({ weatherData, uvForecast, onForecastPress }) {
  if (!weatherData || !uvForecast) {
    return null;
  }

  const { location, current } = weatherData;
  const temperature = Math.round(current.temp_c);
  const description = current.condition.text;
  const icon = `https:${current.condition.icon}`;
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
      <View style={styles.weatherSection}>
        <View style={styles.headerRow}>
          <Text style={styles.cityName}>{location.name}</Text>
          <TouchableOpacity 
            style={styles.forecastButton}
            onPress={onForecastPress}
          >
            <View style={styles.forecastButtonContent}>
              <Ionicons name="stats-chart" size={20} color="#4A90E2" />
              <Text style={styles.forecastButtonText}>Grafikler</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.weatherInfo}>
          <Image style={styles.icon} source={{ uri: icon }} />
          <View style={styles.tempContainer}>
            <Text style={styles.temperature}>{temperature}°C</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.uvSection}>
        <View style={styles.uvHeader}>
          <Text style={styles.uvTitle}>UV İndeksi</Text>
          <View style={styles.currentBadge}>
            <Text style={styles.currentText}>Şu an</Text>
          </View>
        </View>
        <View style={[styles.uvContainer, { borderColor: uvInfo.color }]}>
          <Ionicons name={uvInfo.icon} size={24} color={uvInfo.color} />
          <Text style={[styles.uvValue, { color: uvInfo.color }]}>{currentUV}</Text>
          <Text style={[styles.uvLevel, { color: uvInfo.color }]}>{uvInfo.level}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    width: '90%',
    minHeight: 200,
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    marginHorizontal: 0,
  },
  weatherSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  cityName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 10,
  },
  icon: {
    width: 80,
    height: 80,
  },
  tempContainer: {
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  description: {
    fontSize: 16,
    color: '#34495E',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 15,
  },
  uvSection: {
    alignItems: 'center',
    width: '100%',
  },
  uvHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  uvTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  currentBadge: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  uvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  uvValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  uvLevel: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  forecastButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  forecastButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  forecastButtonText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
});