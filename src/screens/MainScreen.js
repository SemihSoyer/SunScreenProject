import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, TouchableOpacity, Platform, Linking, TextInput, Modal, FlatList } from 'react-native';
import axios from 'axios';
import WeatherCard from '../components/WeatherCard';
import * as Location from 'expo-location';
import CloudAnimation from '../components/CloudAnimation';
import SunAnimation from '../components/SunAnimation';
import UVWidget from '../components/UVWidget';
import { useAnimation } from '../context/AnimationContext';
import { Ionicons } from '@expo/vector-icons';
import SettingsDrawer from '../components/SettingsDrawer';
import HumidityWidget from '../components/HumidityWidget';
import MaxUVWidget from '../components/MaxUVWidget';
import SunriseWidget from '../components/SunriseWidget';
import SunsetWidget from '../components/SunsetWidget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForecastModal from '../components/ForecastModal';

const DEFAULT_LOCATION = 'Boston,Massachusetts,United States';

export default function MainScreen({ navigation }) {
  const { setCurrentAnimation } = useAnimation();
  const [weatherData, setWeatherData] = useState(null);
  const [uvForecast, setUvForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#FFF9C4');
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [location, setLocation] = useState(null);
  const [maxUV, setMaxUV] = useState(null);
  const [maxUVTime, setMaxUVTime] = useState(null);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [forecastModalVisible, setForecastModalVisible] = useState(false);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);

  const fetchWeather = async (location) => {
    const API_KEY = '11b29cf228164169b1b95944242011';
    const URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&lang=tr&days=5&aqi=no`;

    try {
      const response = await axios.get(URL);
      setWeatherData(response.data);
      setFiveDayForecast(response.data.forecast.forecastday);
      
      const astronomy = response.data.forecast.forecastday[0].astro;
      const sunrise = astronomy.sunrise;
      const sunset = astronomy.sunset;

      const now = new Date();
      const currentHour = now.getHours();
      
      const forecastDay = response.data.forecast.forecastday[0];
      const currentUV = response.data.current.uv;

      const uvData = [
        {
          time: `${currentHour}:00`,
          uv: currentUV
        }
      ];

      const nextHours = forecastDay.hour
        .filter(hour => {
          const hourTime = new Date(hour.time).getHours();
          return hourTime > currentHour;
        })
        .slice(0, 2)
        .map(hour => ({
          time: `${new Date(hour.time).getHours()}:00`,
          uv: hour.uv
        }));

      const allUVData = [...uvData, ...nextHours];

      console.log('UV Verileri:', allUVData);
      setUvForecast({
        data: allUVData,
        sunrise: sunrise,
        sunset: sunset
      });

      const condition = response.data.current.condition.text.toLowerCase();
      updateBackgroundColor(condition);

      setAnimationKey(prev => prev + 1);

      const maxUVValue = forecastDay.day.uv;
      setMaxUV(maxUVValue);

      let maxHour = 12; // Varsayılan değer
      let maxUVFound = 0;
      
      forecastDay.hour.forEach(hour => {
        if (hour.uv > maxUVFound) {
          maxUVFound = hour.uv;
          maxHour = new Date(hour.time).getHours();
        }
      });

      setMaxUVTime(maxHour);

    } catch (err) {
      if (err.response) {
        setError(`Hata: ${err.response.status} - ${err.response.data.error.message}`);
      } else if (err.request) {
        setError('Hava durumu verisi alınırken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.');
      } else {
        setError('Bir hata oluştu.');
      }
      console.error('API Hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBackgroundColor = (condition) => {
    console.log('Gelen hava durumu:', condition);
    
    const sunnyConditions = ['güneşli', 'açık', 'kısmen güneşli'];
    const isSunny = sunnyConditions.some(weather => condition.toLowerCase().includes(weather.toLowerCase()));

    if (isSunny) {
      setBackgroundColor('#FFF3D4');
      setCurrentAnimation('sun');
    } else {
      setBackgroundColor('#87CEEB');
      setCurrentAnimation('cloud');
    }
  };

  const getLocation = async () => {
    try {
      const serviceEnabled = await Location.hasServicesEnabledAsync();
      if (!serviceEnabled) {
        Alert.alert(
          'Konum Servisleri Kapalı',
          'Lütfen telefonunuzun konum servislerini açın.',
          [{ text: 'Tamam' }]
        );
        return;
      }

      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Konum İzni Gerekli',
          'Hava durumu verilerini alabilmek için konum iznine ihtiyacımız var.',
          [{ text: 'Tamam' }]
        );
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 0,
      });

      if (userLocation) {
        setLocation(userLocation);
        const { latitude, longitude } = userLocation.coords;
        await fetchWeather(`${latitude},${longitude}`);
      } else {
        throw new Error('Konum alınamadı');
      }

    } catch (error) {
      console.error('Konum hatası detayı:', error);
      
      try {
        const ipLocation = await Location.getLastKnownPositionAsync();
        if (ipLocation) {
          setLocation(ipLocation);
          const { latitude, longitude } = ipLocation.coords;
          await fetchWeather(`${latitude},${longitude}`);
          return;
        }
      } catch (backupError) {
        console.error('Yedek konum hatası:', backupError);
      }

      Alert.alert(
        'Konum Hatası',
        'Konumunuz alınamadı. Lütfen konum servislerinizin açık olduğundan ve uygulamaya izin verdiğinizden emin olun.',
        [
          {
            text: 'Ayarları Aç',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
          { text: 'Tamam' },
        ]
      );
    }
  };

  const searchLocations = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/search.json?key=11b29cf228164169b1b95944242011&q=${query}&lang=tr`
      );

      const formattedResults = response.data.map(location => {
        const parts = [];
        if (location.name) parts.push(location.name);
        
        if (location.region && location.region !== location.name) {
          parts.push(location.region);
        }
        
        if (location.country) parts.push(location.country);

        return {
          ...location,
          displayName: parts.join(', '),
          type: location.region === location.name ? 'city' : 'district'
        };
      });

      const cities = formattedResults.filter(loc => loc.type === 'city');
      const districts = formattedResults.filter(loc => loc.type === 'district');

      setSearchResults([...cities, ...districts]);
    } catch (error) {
      console.error('Konum arama hatası:', error);
    }
  };

  const renderLocationDetails = (location) => {
    const parts = [];
    if (location.name) parts.push(location.name);
    if (location.region && location.region !== location.name) parts.push(location.region);
    if (location.country) parts.push(location.country);
    return parts.join(', ');
  };

  const saveLocation = async (location) => {
    try {
      const newLocation = {
        id: Math.random().toString(),
        name: location.name,
        region: location.region,
        country: location.country,
        lat: location.lat,
        lon: location.lon
      };

      const updatedLocations = [...savedLocations, newLocation];
      setSavedLocations(updatedLocations);
      await AsyncStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
      
      setSelectedLocation(newLocation);
      fetchWeather(`${location.lat},${location.lon}`);
      setSearchModalVisible(false);
    } catch (error) {
      console.error('Konum kaydetme hatası:', error);
    }
  };

  const deleteLocation = async (locationId) => {
    try {
      const updatedLocations = savedLocations.filter(loc => loc.id !== locationId);
      setSavedLocations(updatedLocations);
      await AsyncStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
    } catch (error) {
      console.error('Konum silme hatası:', error);
    }
  };

  useEffect(() => {
    const loadSavedLocations = async () => {
      try {
        const saved = await AsyncStorage.getItem('savedLocations');
        if (saved) {
          setSavedLocations(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Kayıtlı konumları yükleme hatası:', error);
      }
    };
    loadSavedLocations();
  }, []);

  useEffect(() => {
    const loadWeatherData = async () => {
      setLoading(true);
      try {
        await getLocation();
      } catch (error) {
        console.error('Hava durumu yüklenirken hata:', error);
        setError('Hava durumu verisi alınamadı. Lütfen internet bağlantınızı kontrol edin.');
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();

    const interval = setInterval(loadWeatherData, 300000);
    return () => clearInterval(interval);
  }, []);

  const returnToCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Konum İzni Gerekli',
          'Gerçek konumunuzu görebilmek için konum iznine ihtiyacımız var.',
          [{ text: 'Tamam' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setSelectedLocation(null);
      
      await fetchWeather(`${latitude},${longitude}`);
      
    } catch (error) {
      Alert.alert(
        'Hata',
        'Konumunuz alınırken bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Hava durumu verisi yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor }]}>
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

      <View style={styles.animationContainer}>
        {['güneşli', 'açık', 'kısmen güneşli'].some(weather => 
          weatherData?.current?.condition?.text.toLowerCase().includes(weather.toLowerCase())
        ) ? (
          <SunAnimation />
        ) : (
          <CloudAnimation 
            key={animationKey}
            animationKey={animationKey}
          />
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.cardWrapper}>
          <WeatherCard 
            weatherData={weatherData} 
            uvForecast={uvForecast.data}
            onForecastPress={() => setForecastModalVisible(true)}
          />
          
          <View style={styles.rowContainer}>
            <MaxUVWidget maxUV={maxUV} maxUVTime={maxUVTime} />
            <View style={styles.sunContainer}>
              <SunriseWidget sunrise={weatherData?.forecast?.forecastday[0]?.astro?.sunrise} />
              <SunsetWidget sunset={weatherData?.forecast?.forecastday[0]?.astro?.sunset} />
            </View>
          </View>

          <HumidityWidget humidity={weatherData?.current?.humidity} />
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      <View style={styles.locationButtonsContainer}>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={() => setSearchModalVisible(true)}
        >
          <Ionicons name="search-outline" size={22} color="#333" />
          <Text style={styles.buttonText}>
            {selectedLocation ? selectedLocation.name : 'Konum Ara'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.currentLocationButton}
          onPress={returnToCurrentLocation}
        >
          <Ionicons name="navigate" size={22} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={searchModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setSearchModalVisible(false)}
                style={styles.backButton}
              >
                <Ionicons name="chevron-down" size={28} color="#2C3E50" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Konum Seç</Text>
            </View>

            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Şehir veya ilçe ara..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  searchLocations(text);
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>

            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => `${item.lat},${item.lon}`}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[
                      styles.searchResultItem,
                      item.type === 'district' && styles.districtItem
                    ]}
                    onPress={() => saveLocation(item)}
                  >
                    <Ionicons 
                      name={item.type === 'city' ? 'location' : 'map'} 
                      size={20} 
                      color="#4A90E2" 
                    />
                    <View style={styles.locationTextContainer}>
                      <Text style={styles.locationName}>{item.displayName}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="search" size={48} color="#CCC" />
                <Text style={styles.emptyStateText}>
                  Konum aramak için yazmaya başlayın
                </Text>
              </View>
            )}

            {savedLocations.length > 0 && (
              <View style={styles.savedLocationsSection}>
                <Text style={styles.savedLocationsTitle}>Kayıtlı Konumlar</Text>
                <FlatList
                  data={savedLocations}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.savedLocationItem}>
                      <TouchableOpacity 
                        style={styles.savedLocationContent}
                        onPress={() => {
                          fetchWeather(`${item.lat},${item.lon}`);
                          setSelectedLocation(item);
                          setSearchModalVisible(false);
                        }}
                      >
                        <Ionicons name="bookmark" size={20} color="#4A90E2" />
                        <View style={styles.locationTextContainer}>
                          <Text style={styles.locationName}>{item.name}</Text>
                          <Text style={styles.locationDetail}>
                            {item.region}, {item.country}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => deleteLocation(item.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>

      <ForecastModal 
        visible={forecastModalVisible}
        onClose={() => setForecastModalVisible(false)}
        forecastData={fiveDayForecast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  animationContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  container: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 100,
    paddingBottom: 100,
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  placeholder: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
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
  bottomSpacing: {
    height: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
    gap: 15,
  },
  placeholderWidget: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sunContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  locationButtonsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    marginTop: 20,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  currentLocationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    padding: 8,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    marginRight: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  districtItem: {
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
  },
  savedLocationsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 20,
  },
  savedLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    marginBottom: 10,
  },
  savedLocationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  deleteButton: {
    padding: 15,
    borderLeftWidth: 1,
    borderLeftColor: '#EEE',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  locationDetail: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEE',
  },
});