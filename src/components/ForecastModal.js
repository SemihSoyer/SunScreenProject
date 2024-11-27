import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

export default function ForecastModal({ visible, onClose, forecastData }) {
  const getUVColor = (uv) => {
    if (uv <= 2) return '#87CEEB';
    if (uv <= 5) return '#4A90E2';
    if (uv <= 7) return '#FF9500';
    if (uv <= 10) return '#FF3B30';
    return '#AF52DE';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.forecastModalContainer}>
        <View style={styles.forecastModalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.backButton}
            >
              <Ionicons name="chevron-down" size={28} color="#2C3E50" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>5 Günlük Tahmin</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {forecastData && (
              <>
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>UV İndeksi Tahmini</Text>
                  <LineChart
                    data={{
                      labels: forecastData.map(day => 
                        new Date(day.date).toLocaleDateString('tr-TR', { weekday: 'short' })
                      ),
                      datasets: [{
                        data: forecastData.map(day => day.day.uv)
                      }]
                    }}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 1,
                      color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
                      style: {
                        borderRadius: 16
                      },
                      propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#4A90E2"
                      }
                    }}
                    bezier
                    style={styles.chart}
                  />
                </View>

                {forecastData.map(item => (
                  <View key={item.date} style={styles.forecastItem}>
                    <View style={styles.forecastDay}>
                      <Text style={styles.dayText}>
                        {new Date(item.date).toLocaleDateString('tr-TR', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </Text>
                    </View>
                    
                    <View style={styles.forecastDetails}>
                      <Image 
                        source={{ uri: `https:${item.day.condition.icon}` }} 
                        style={styles.weatherIcon} 
                      />
                      <View style={styles.tempContainer}>
                        <Text style={styles.tempText}>
                          {Math.round(item.day.maxtemp_c)}°C / {Math.round(item.day.mintemp_c)}°C
                        </Text>
                        <Text style={styles.conditionText}>{item.day.condition.text}</Text>
                      </View>
                      <View style={styles.uvContainer}>
                        <Ionicons 
                          name="sunny" 
                          size={24} 
                          color={getUVColor(item.day.uv)} 
                        />
                        <Text style={[styles.uvText, { color: getUVColor(item.day.uv) }]}>
                          {item.day.uv}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  forecastModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  forecastModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%', // Yüksekliği azalttım
    marginTop: 50, // Üstten boşluk ekledim
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  chartContainer: {
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  forecastItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  forecastDay: {
    marginBottom: 10,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  forecastDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weatherIcon: {
    width: 40,
    height: 40,
  },
  tempContainer: {
    flex: 1,
    marginLeft: 15,
  },
  tempText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  conditionText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  uvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 20,
  },
  uvText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
});