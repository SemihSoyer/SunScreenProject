import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MaxUVWidget({ maxUV, maxUVTime }) {
  if (!maxUV) return null;

  const formatTime = (time) => {
    const hour = parseInt(time);
    return hour > 12 ? `${hour-12}:00` : `${hour}:00`;
  };

  const getUVInfo = (uv) => {
    const uvIndex = Number(uv);
    if (uvIndex <= 2) return { icon: 'sunny-outline', color: '#87CEEB' };
    if (uvIndex <= 5) return { icon: 'sunny-outline', color: '#4A90E2' };
    if (uvIndex <= 7) return { icon: 'warning-outline', color: '#FF9500' };
    if (uvIndex <= 10) return { icon: 'warning', color: '#FF3B30' };
    return { icon: 'alert-circle', color: '#AF52DE' };
  };

  const uvInfo = getUVInfo(maxUV);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="time-outline" size={18} color="#666" />
        <Text style={styles.timeText}>{formatTime(maxUVTime)}</Text>
      </View>
      
      <View style={[styles.uvContainer, { borderColor: uvInfo.color }]}>
        <Ionicons name={uvInfo.icon} size={32} color={uvInfo.color} />
        <Text style={[styles.uvValue, { color: uvInfo.color }]}>{maxUV}</Text>
      </View>
      
      <Text style={styles.label}>Max UV</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  uvContainer: {
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  uvValue: {
    fontSize: 36,
    fontWeight: '800',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});