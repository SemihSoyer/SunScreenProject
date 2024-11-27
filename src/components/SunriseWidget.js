import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SunriseWidget({ sunrise }) {
  if (!sunrise) return null;

  const convertTo24Hour = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="sunny" size={32} color="#FF9500" />
        <Ionicons 
          name="arrow-up-outline" 
          size={20} 
          color="#FF9500" 
          style={styles.arrowIcon} 
        />
      </View>
      <View style={styles.timeInfo}>
        <Text style={styles.label}>Gün Doğumu</Text>
        <Text style={styles.time}>{convertTo24Hour(sunrise)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 5,
  },
  iconContainer: {
    position: 'relative',
    width: 32,
    height: 32,
  },
  arrowIcon: {
    position: 'absolute',
    bottom: -8,
    left: 6,
  },
  timeInfo: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  time: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 2,
  },
});