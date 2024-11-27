import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  BackHandler
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAnimation } from '../context/AnimationContext';

export default function SubscriptionScreen({ navigation }) {
  const { currentAnimation } = useAnimation();
  
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const handleGoBack = () => {
    if (Platform.OS === 'ios') {
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: currentAnimation === 'sun' ? '#FFF3D4' : '#87CEEB' 
    }]}>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={handleGoBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={styles.closeButtonInner}>
          <Ionicons name="chevron-back" size={28} color="#2C3E50" />
        </View>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Premium Deneyim ✨</Text>
          <Text style={styles.headerSubtitle}>
            Cildinize özel kişiselleştirilmiş bakım asistanı
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="sunny" size={24} color="#FF9500" />
            <Text style={styles.featureText}>UV İndeksi Bazlı Akıllı Hatırlatıcılar</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="water" size={24} color="#4A90E2" />
            <Text style={styles.featureText}>Nem Oranına Göre Nemlendirici Önerileri</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="notifications" size={24} color="#FF6B6B" />
            <Text style={styles.featureText}>Kişiselleştirilmiş Cilt Bakım Bildirimleri</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="calendar" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Cilt Bakım Rutini Takip Takvimi</Text>
          </View>
        </View>

        <View style={styles.plansContainer}>
          <TouchableOpacity style={[styles.planCard, styles.popularPlan]}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>EN AVANTAJLI</Text>
            </View>
            <Text style={styles.planTitle}>Yıllık Üyelik</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₺179.99</Text>
              <Text style={styles.period}>/yıl</Text>
            </View>
            <Text style={styles.savings}>%40 Tasarruf</Text>
            <Text style={styles.monthly}>Aylık sadece ₺15</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.planCard}>
            <Text style={styles.planTitle}>Aylık Üyelik</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₺24.99</Text>
              <Text style={styles.period}>/ay</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.guaranteeContainer}>
          <Ionicons name="shield-checkmark" size={24} color="#4A90E2" />
          <Text style={styles.guaranteeText}>
            7 Gün Koşulsuz İade Garantisi
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 1000,
  },
  closeButtonInner: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    opacity: 0.9,
  },
  featuresContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: 20,
    borderRadius: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
  },
  plansContainer: {
    padding: 20,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popularPlan: {
    borderColor: '#4A90E2',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  popularBadgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  period: {
    fontSize: 16,
    color: '#7F8C8D',
    marginLeft: 5,
  },
  savings: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  monthly: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 5,
  },
  guaranteeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: 20,
    borderRadius: 15,
    marginBottom: 40,
  },
  guaranteeText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#2C3E50',
  },
});