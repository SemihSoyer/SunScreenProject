import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HumidityWidget({ humidity }) {
  if (!humidity) {
    return null;
  }

  const getHumidityLevel = (humidity) => {
    if (humidity <= 30) return 'Düşük';
    if (humidity <= 60) return 'Normal';
    return 'Yüksek';
  };

  const getHumidityColor = (humidity) => {
    if (humidity <= 30) return '#FF9800';
    if (humidity <= 60) return '#4CAF50';
    return '#2196F3';
  };

  const getHumidityAdvice = (humidity) => {
    if (humidity <= 25) {
      return "Nem oranı çok düşük! Nemlendirici kullanmanız ve bol su içmeniz önerilir. Cildinizi korumak için nemlendirici krem kullanın.";
    } 
    else if (humidity <= 50) {
      return "Nem oranı normal seviyenin altında. Günde iki kez nemlendirici kullanın ve su tüketiminize dikkat edin.";
    } 
    else if (humidity <= 75) {
      return "Nem oranı ideal! Hafif nemlendiriciler kullanabilirsiniz. Güneş koruyucunuzu ihmal etmeyin.";
    } 
    else {
      return "Nem oranı yüksek! Yağsız ve hafif ürünler tercih edin. Su geçirmez güneş koruyucular kullanın.";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nem Oranı</Text>
      <View style={styles.contentContainer}>
        <View 
          style={[
            styles.humidityBox,
            { borderColor: getHumidityColor(humidity) }
          ]}
        >
          <Text style={styles.time}>Şu an</Text>
          <Text style={[
            styles.humidityLevel,
            { color: getHumidityColor(humidity) }
          ]}>
            %{humidity}
          </Text>
          <Text style={[
            styles.humidityText,
            { color: getHumidityColor(humidity) }
          ]}>
            {getHumidityLevel(humidity)}
          </Text>
        </View>

        <Text style={styles.adviceText}>
          {getHumidityAdvice(humidity)}
        </Text>
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
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
  },
  humidityBox: {
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    minWidth: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  time: {
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 5,
    fontWeight: '600',
  },
  humidityLevel: {
    fontSize: 28,
    fontWeight: '800',
    marginVertical: 5,
  },
  humidityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  adviceText: {
    flex: 1,
    fontSize: 13,
    color: '#1a1a1a',
    paddingRight: 10,
    fontStyle: 'italic',
    lineHeight: 20,
    fontWeight: '500',
  }
});