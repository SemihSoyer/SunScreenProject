import React, { useEffect } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CloudAnimation({ animationKey }) {
  const clouds = React.useMemo(() => ([
    {
      position: new Animated.Value(-200),
      opacity: new Animated.Value(0.8)
    },
    {
      position: new Animated.Value(-300),
      opacity: new Animated.Value(0.6)
    },
    {
      position: new Animated.Value(-250),
      opacity: new Animated.Value(0.7)
    },
    {
      position: new Animated.Value(-150),
      opacity: new Animated.Value(0.9)
    },
    {
      position: new Animated.Value(-350),
      opacity: new Animated.Value(0.5)
    },
    {
      position: new Animated.Value(-250),
      opacity: new Animated.Value(0.7)
    },
    {
      position: new Animated.Value(-180),
      opacity: new Animated.Value(0.6)
    },
    {
      position: new Animated.Value(-220),
      opacity: new Animated.Value(0.75)
    },
    {
      position: new Animated.Value(-280),
      opacity: new Animated.Value(0.65)
    }
  ]), [animationKey]);

  useEffect(() => {
    const animations = clouds.map(cloud => 
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(cloud.position, {
              toValue: width + 100,
              duration: 15000 + Math.random() * 5000,
              useNativeDriver: true
            }),
            Animated.timing(cloud.position, {
              toValue: -200,
              duration: 0,
              useNativeDriver: true
            })
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(cloud.opacity, {
              toValue: 0.4,
              duration: 1500,
              useNativeDriver: true
            }),
            Animated.timing(cloud.opacity, {
              toValue: 0.8,
              duration: 1500,
              useNativeDriver: true
            })
          ])
        )
      ])
    );

    // Tüm animasyonları başlat
    animations.forEach(animation => animation.start());

    // Cleanup
    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [animationKey]);

  const renderCloud = (cloud, style) => {
    return (
      <Animated.View
        style={[
          styles.cloudContainer,
          style,
          {
            transform: [{ translateX: cloud.position }],
            opacity: cloud.opacity
          }
        ]}
      >
        <View style={[styles.cloudPart, styles.cloudMain]} />
        <View style={[styles.cloudPart, styles.cloudTop]} />
        <View style={[styles.cloudPart, styles.cloudRight]} />
        <View style={[styles.cloudPart, styles.cloudLeft]} />
        <View style={[styles.cloudPart, styles.cloudBottom]} />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Üst kısım */}
      {renderCloud(clouds[0], { top: height * 0.05, transform: [{ scale: 1.2 }] })}
      {renderCloud(clouds[1], { top: height * 0.15, transform: [{ scale: 0.8 }] })}
      {renderCloud(clouds[2], { top: height * 0.25, transform: [{ scale: 1.0 }] })}
      
      {/* Orta kısım */}
      {renderCloud(clouds[3], { top: height * 0.35, transform: [{ scale: 0.9 }] })}
      {renderCloud(clouds[4], { top: height * 0.45, transform: [{ scale: 1.1 }] })}
      {renderCloud(clouds[7], { top: height * 0.55, transform: [{ scale: 0.85 }] })}
      
      {/* Alt kısım */}
      {renderCloud(clouds[5], { top: height * 0.65, transform: [{ scale: 1.3 }] })}
      {renderCloud(clouds[6], { top: height * 0.75, transform: [{ scale: 0.9 }] })}
      {renderCloud(clouds[8], { top: height * 0.85, transform: [{ scale: 1.0 }] })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden'
  },
  cloudContainer: {
    position: 'absolute',
    width: 150,
    height: 60,
  },
  cloudPart: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 50
  },
  cloudMain: {
    width: 100,
    height: 40,
    left: 25,
    top: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },
  cloudTop: {
    width: 50,
    height: 50,
    left: 50,
    top: -10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)'
  },
  cloudRight: {
    width: 40,
    height: 40,
    left: 90,
    top: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.75)'
  },
  cloudLeft: {
    width: 45,
    height: 45,
    left: 15,
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },
  cloudBottom: {
    width: 120,
    height: 30,
    left: 15,
    top: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  }
});