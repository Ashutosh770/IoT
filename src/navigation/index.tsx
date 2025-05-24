import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ParamListBase, RouteProp } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import DevicesScreen from '../screens/DevicesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ConnectedDevicesScreen from '../screens/ConnectedDevicesScreen';
import SensorDetailScreen from '../screens/SensorDetailScreen';
import ControlPanelScreen from '../screens/ControlPanelScreen';

// Define stack navigator for device flow
const DeviceStack = createStackNavigator();
function DeviceStackScreen() {
  return (
    <DeviceStack.Navigator screenOptions={{ headerShown: false }}>
      <DeviceStack.Screen name="ConnectedDevices" component={ConnectedDevicesScreen} />
      <DeviceStack.Screen name="SensorDetail" component={SensorDetailScreen} />
      <DeviceStack.Screen name="ControlPanel" component={ControlPanelScreen} />
    </DeviceStack.Navigator>
  );
}

// Main tab navigator
const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Devices"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Devices') {
            iconName = 'hardware-chip-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Devices" component={DeviceStackScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Root stack navigator
const RootStack = createStackNavigator();
export default function Navigation() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeEntry">
        <RootStack.Screen name="HomeEntry" component={HomeScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}