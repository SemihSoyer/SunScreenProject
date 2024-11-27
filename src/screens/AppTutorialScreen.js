import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  FlatList,
  Animated,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAnimation } from '../context/AnimationContext';

const { width, height } = Dimensions.get('window');

const tutorialData = [
  {
    id: '1',
    title: 'Hava Durumu ve UV İndeksi',
    description: 'Anlık hava durumu ve UV indeksi bilgilerini görüntüleyin. Cildinizi güneşin zararlı etkilerinden korumak için UV seviyesini takip edin.',
    icon: 'sunny',
    color: '#FF9500'
  },
  {
    id: '2',
    title: 'Akıllı Hatırlatıcılar',
    description: 'UV indeksine göre özelleştirilmiş güneş kremi ve nemlendirici hatırlatmaları alın. Cildinizin ihtiyacı olan bakımı asla unutmayın.',
    icon: 'notifications',
    color: '#4A90E2'
  },
  {
    id: '3',
    title: '5 Günlük Tahmin',
    description: 'Gelecek 5 günün hava durumu ve UV indeksi tahminlerini görüntüleyin. Önceden önlem alın, planlarınızı yapın.',
    icon: 'calendar',
    color: '#32CD32'
  },
  {
    id: '4',
    title: 'Detaylı Analizler',
    description: 'Nem oranı, gün doğumu ve batımı saatleri gibi detaylı bilgilere ulaşın. Cildiniz için en uygun bakım zamanlarını belirleyin.',
    icon: 'analytics',
    color: '#9B59B6'
  }
];

export default function AppTutorialScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { currentAnimation } = useAnimation();

  const renderItem = ({ item, index }) => (
    <View style={styles.slide}>
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={50} color="#FFF" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderDots = () => {
    return (
      <View style={styles.pagination}>
        {tutorialData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: currentAnimation === 'sun' ? '#FFF9C4' : '#E3F2FD' 
    }]}>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={28} color="#2C3E50" />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={tutorialData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      {renderDots()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  slide: {
    width: width,
    alignItems: 'center',
    padding: 40,
    paddingTop: 100,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
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
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2C3E50',
    marginHorizontal: 4,
  },
});