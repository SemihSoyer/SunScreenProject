import React, { useEffect } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SunAnimation() {
  const scaleValue = new Animated.Value(1);
  const glowOpacity = new Animated.Value(0.4);

  useEffect(() => {
    // Büyüyüp küçülme animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Parlaklık animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Dış parlaklık halkası */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            transform: [{ scale: scaleValue }],
          },
        ]}
      />
      
      {/* Ana güneş dairesi */}
      <Animated.View
        style={[
          styles.sun,
          {
            transform: [
              { scale: scaleValue },
            ],
          },
        ]}
      >
        {/* İç parlaklık */}
        <View style={styles.innerGlow} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -180,
    left: -180,
    width: 500,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  sun: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  innerGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFEB3B',
    opacity: 0.7,
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#FFE0B2',
    opacity: 0.3,
  },
});