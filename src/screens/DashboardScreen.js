import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchLatestData } from '../services/api';

const CustomGauge = ({ value, maxValue, color, unit, label }) => {
  const percentage = Math.min(100, (value / maxValue) * 100);
  const size = 150;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <View style={styles.gaugeWrapper}>
      <Text style={styles.gaugeLabel}>{label}</Text>
      <View style={[styles.gaugeContainer, { width: size, height: size }]}>
        {/* Background circle */}
        <View style={[styles.gaugeBackground, { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: '#f5f5f5'
        }]} />
        
        {/* Progress arc */}
        <View style={[styles.gaugeProgress, { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          borderLeftColor: 'transparent',
          borderBottomColor: 'transparent',
          transform: [{ rotate: `${(percentage / 100) * 360}deg` }]
        }]} />
        
        {/* Center value */}
        <View style={styles.gaugeValueContainer}>
          <Text style={[styles.gaugeValue, { color }]}>{value.toFixed(1)}</Text>
          <Text style={[styles.gaugeUnit, { color }]}>{unit}</Text>
        </View>
      </View>
    </View>
  );
};

export default function DashboardScreen({ navigation }) {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchLatestData();
        console.log('API Response:', response);
        if (response && response.success && response.data) {
          console.log('Setting sensor data:', response.data);
          setSensorData(response.data);
        } else {
          console.log('Failed to get valid data from API');
          setError('Failed to fetch data. Please check:\n1. Backend server is running\n2. Connected to same network as ESP32\n3. ESP32 is sending data');
        }
      } catch (err) {
        console.error('Error in loadData:', err);
        setError('Error connecting to server. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Refresh every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  console.log('Current sensor data:', sensorData);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>IoT Dashboard</Text>
        
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Connecting to server...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.helpText}>Server: 192.168.2.71:3000</Text>
            <Text style={styles.helpText}>Device ID: ESP32_D15</Text>
            <Button title="Retry" onPress={() => setLoading(true)} />
          </View>
        ) : sensorData ? (
          <View style={styles.dataContainer}>
            <Text style={styles.deviceId}>Device: {sensorData.deviceId || 'ESP32_D15'}</Text>
            
            <View style={styles.gaugesContainer}>
              <CustomGauge
                value={sensorData.temperature}
                maxValue={50}
                color="#FF5252"
                unit="°C"
                label="Temperature"
              />
              <CustomGauge
                value={sensorData.humidity}
                maxValue={100}
                color="#4CAF50"
                unit="%"
                label="Humidity"
              />
            </View>
            
            {sensorData.timestamp && (
              <View style={styles.timestampContainer}>
                <Text style={styles.timestampLabel}>Last Updated:</Text>
                <Text style={styles.timestamp}>{new Date(sensorData.timestamp).toLocaleString()}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text>No data available</Text>
        )}
        
        <Button
          title="View History"
          onPress={() => navigation.navigate('History')}
          style={styles.historyButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#fff'
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  dataContainer: { 
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  },
  helpText: {
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 14
  },
  deviceId: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  gaugesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  gaugeWrapper: {
    alignItems: 'center'
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  gaugeBackground: {
    position: 'absolute',
    backgroundColor: 'transparent'
  },
  gaugeProgress: {
    position: 'absolute',
    backgroundColor: 'transparent'
  },
  gaugeValueContainer: {
    position: 'absolute',
    alignItems: 'center'
  },
  gaugeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  gaugeValue: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  gaugeUnit: {
    fontSize: 16,
    marginTop: 5
  },
  timestampContainer: {
    alignItems: 'center',
    marginTop: 20
  },
  timestampLabel: {
    fontSize: 14,
    color: '#666'
  },
  timestamp: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  historyButton: {
    marginTop: 20
  }
});