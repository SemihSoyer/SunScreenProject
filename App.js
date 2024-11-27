import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import EntryScreen from './src/screens/EntryScreen';
import MainScreen from './src/screens/MainScreen';
import ReminderScreen from './src/screens/ReminderScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import { AnimationProvider, useAnimation } from './src/context/AnimationContext';
import AppTutorialScreen from './src/screens/AppTutorialScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

function TabNavigator() {
  const { currentAnimation } = useAnimation();

  const getActiveColor = () => {
    return currentAnimation === 'sun' ? '#FFA500' : '#4A90E2';
  };

  const getActiveShadowColor = () => {
    return currentAnimation === 'sun' ? '#FFA500' : '#4A90E2';
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Hava Durumu') {
            iconName = focused ? 'sunny' : 'sunny-outline';
          } else if (route.name === 'Hatırlatıcı') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          }

          return <Ionicons name={iconName} size={28} color={focused ? '#FFFFFF' : '#95a5a6'} />;
        },
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          height: 70,
          backgroundColor: 'transparent',
          elevation: 0,
          borderTopWidth: 0,
          paddingHorizontal: 40,
        },
        tabBarBackground: () => (
          <View style={{ flex: 1 }} />
        ),
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen 
        name="Hava Durumu" 
        component={MainScreen}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={[
                styles.tabButton,
                props.accessibilityState.selected 
                  ? [styles.tabButtonActive, { 
                      backgroundColor: getActiveColor(),
                      shadowColor: getActiveShadowColor()
                    }] 
                  : styles.tabButtonInactive
              ]}
            >
              <Ionicons 
                name={props.accessibilityState.selected ? "sunny" : "sunny-outline"} 
                size={28} 
                color={props.accessibilityState.selected ? "#FFFFFF" : "#95a5a6"} 
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen 
        name="Hatırlatıcı" 
        component={ReminderScreen}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={[
                styles.tabButton,
                props.accessibilityState.selected 
                  ? [styles.tabButtonActive, { 
                      backgroundColor: getActiveColor(),
                      shadowColor: getActiveShadowColor()
                    }] 
                  : styles.tabButtonInactive
              ]}
            >
              <Ionicons 
                name={props.accessibilityState.selected ? "notifications" : "notifications-outline"} 
                size={28} 
                color={props.accessibilityState.selected ? "#FFFFFF" : "#95a5a6"} 
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AnimationProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={isFirstLaunch ? "Entry" : "MainTabs"}
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          <Stack.Screen name="Entry" component={EntryScreen} />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="AppTutorial" component={AppTutorialScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AnimationProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    width: 60,
    height: 60,
    marginHorizontal: 30,
  },
  tabButtonActive: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabButtonInactive: {
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  }
});
