import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { useAnimation } from '../context/AnimationContext';
import CloudAnimation from '../components/CloudAnimation';
import SunAnimation from '../components/SunAnimation';
import { Ionicons } from '@expo/vector-icons';
import SettingsDrawer from '../components/SettingsDrawer';

// Bildirimleri yapılandır
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ReminderScreen() {
  const navigation = useNavigation();
  const { currentAnimation } = useAnimation();
  const [sunscreenReminder, setSunscreenReminder] = useState(null);
  const [moisturizerReminder, setMoisturizerReminder] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Bildirim İzni Gerekli',
        'Hey! Sana hatırlatma yapabilmem için bildirim iznine ihtiyacım var 🙏',
        [{ text: 'Tamam' }]
      );
      return;
    }
  };

  const scheduleReminder = async (type) => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Güneş kremi için hatırlatma mantığı
    if (type === 'sunscreen') {
      let message = '';
      let delay = 0;

      if (currentHour < 10) {
        message = "Günaydın! ☀️ Güne güneş kremiyle başlamaya ne dersin? SPF'siz çıkma dışarı!";
        delay = 2;
      } else if (currentHour < 12) {
        message = "Öğle güneşi yaklaşıyor! 🌞 Güneş kremini yenilemeyi unutma bestie!";
        delay = 2;
      } else if (currentHour < 15) {
        message = "UV ışınları tam gaz! 🔥 Hadi güneş kremini tazele, tenin bize teşekkür edecek!";
        delay = 2;
      } else if (currentHour < 17) {
        message = "İkindi güneşi de yakıyor! 🌅 Son bir güneş kremi tazelemesi yapalım mı?";
        delay = 1.5;
      } else {
        message = "Akşam güneşi de UV yapar! 🌆 Son bir koruma daha eklemeye ne dersin?";
        delay = 1;
      }

      await schedulePushNotification(message, delay);
      setSunscreenReminder({
        time: new Date(now.getTime() + delay * 60 * 60 * 1000),
        type: 'sunscreen'
      });
    }
    // Nemlendirici için hatırlatma mantığı
    else if (type === 'moisturizer') {
      let message = '';
      let delay = 0;

      if (currentHour < 11) {
        message = "Günaydın! 💧 Nemlendiricini sürdün mü? Gün boyu nemli bir cilt için hadi başlayalım!";
        delay = 3;
      } else if (currentHour < 15) {
        message = "Öğlen rutini! 💦 Cildin kurumuş olabilir, hadi bir nemlendirme yapalım!";
        delay = 3;
      } else if (currentHour < 19) {
        message = "Akşam yaklaşıyor! 🌙 Gün boyu yorulan cildini nemlendirmeye ne dersin?";
        delay = 2;
      } else {
        message = "Yatmadan önce son görev! ✨ Gece nemlendiricini sürerek günü bitirelim!";
        delay = 1;
      }

      await schedulePushNotification(message, delay);
      setMoisturizerReminder({
        time: new Date(now.getTime() + delay * 60 * 60 * 1000),
        type: 'moisturizer'
      });
    }
  };

  const schedulePushNotification = async (message, hours) => {
    const trigger = new Date();
    trigger.setHours(trigger.getHours() + hours);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Cilt Bakım Zamanı! ✨",
        body: message,
        sound: true,
        priority: 'high',
      },
      trigger: trigger,
    });
  };

  const formatReminderTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: currentAnimation === 'sun' ? '#FFF3D4' : '#87CEEB' }]}>
      <View style={styles.animationContainer}>
        {currentAnimation === 'sun' ? <SunAnimation /> : <CloudAnimation animationKey={animationKey} />}
      </View>

      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => setIsSettingsVisible(true)}
      >
        <Ionicons name="menu" size={30} color="#333" />
      </TouchableOpacity>

      <SettingsDrawer 
        isVisible={isSettingsVisible}
        onClose={() => {
          setIsSettingsVisible(false);
          if (Platform.OS === 'android') {
            setTimeout(() => {
              setIsSettingsVisible(false);
            }, 300);
          }
        }}
        navigation={navigation}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Cilt Bakım Asistanın! ✨</Text>
        
        <Text style={styles.description}>
          Merhaba! Ben senin kişisel cilt bakım asistanınım. Güneş kremi ve nemlendirici kullanımını hatırlatmak için buradayım! 
        </Text>

        <View style={styles.reminderStatus}>
          {sunscreenReminder && (
            <View style={styles.activeReminder}>
              <Ionicons name="sunny" size={24} color="#FF9500" />
              <Text style={styles.reminderText}>
                Güneş kremi hatırlatıcısı {formatReminderTime(sunscreenReminder.time)} için kuruldu
              </Text>
            </View>
          )}
          
          {moisturizerReminder && (
            <View style={styles.activeReminder}>
              <Ionicons name="water" size={24} color="#4A90E2" />
              <Text style={styles.reminderText}>
                Nemlendirici hatırlatıcısı {formatReminderTime(moisturizerReminder.time)} için kuruldu
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.sunscreenButton]} 
            onPress={() => scheduleReminder('sunscreen')}
          >
            <Text style={styles.buttonText}>Güneş Kremi Hatırlatıcısı Kur ☀️</Text>
            <Text style={styles.buttonSubText}>2-3 saat sonra hatırlatırım!</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.moisturizerButton]} 
            onPress={() => scheduleReminder('moisturizer')}
          >
            <Text style={styles.buttonText}>Nemlendirici Hatırlatıcısı Kur 💧</Text>
            <Text style={styles.buttonSubText}>1-3 saat sonra hatırlatırım!</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.tip}>
          İpucu: Güneş kremini 2-3 saatte bir, nemlendiricini ise sabah ve akşam kullanmanı öneririm! 🌟
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  animationContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    zIndex: 2,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sunscreenButton: {
    backgroundColor: '#FF9500',
  },
  moisturizerButton: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSubText: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 5,
    opacity: 0.9,
  },
  tip: {
    fontSize: 14,
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 15,
    borderRadius: 10,
    lineHeight: 20,
  },
  reminderStatus: {
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
  activeReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reminderText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#2C3E50',
    flex: 1,
    fontWeight: '500',
  },
  header: undefined,
  menuButton: undefined,
  settingsButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 1000,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});