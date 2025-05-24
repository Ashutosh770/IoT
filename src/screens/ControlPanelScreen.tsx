import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';

const ControlPanelScreen = () => {
  const [heaterOn, setHeaterOn] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(50);
  const [buzzerActive, setBuzzerActive] = useState(false);
  const [temp, setTemp] = useState('25');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Control Panel</Text>
        <View style={styles.card}>
          <Text style={styles.label}>SensorKit A</Text>
          <Text style={styles.id}>ID: SK:2025-01</Text>
          <Text style={styles.lastUpdated}>Last updated: Just now</Text>
          <View style={styles.tempRow}>
            <Text style={styles.label}>Temperature Control</Text>
            <Text style={styles.currentTemp}>Current: 24°C</Text>
          </View>
          <View style={styles.tempInputRow}>
            <TextInput
              style={styles.tempInput}
              value={temp}
              onChangeText={setTemp}
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={styles.tempUnit}>°C</Text>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Heater</Text>
            <Switch value={heaterOn} onValueChange={setHeaterOn} />
          </View>
          <View style={styles.fanRow}>
            <Text style={styles.label}>Fan Speed</Text>
            <Slider
              style={{ flex: 1, marginLeft: 10 }}
              minimumValue={0}
              maximumValue={100}
              value={fanSpeed}
              onValueChange={setFanSpeed}
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#eee"
            />
            <Text style={styles.fanValue}>{fanSpeed}%</Text>
          </View>
          <View style={styles.buzzerRow}>
            <Text style={styles.label}>Buzzer</Text>
            <TouchableOpacity
              style={[styles.buzzerBtn, buzzerActive && styles.buzzerBtnActive]}
              onPress={() => setBuzzerActive(!buzzerActive)}
            >
              <Text style={styles.buzzerBtnText}>Activate Buzzer</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.sendBtn}>
            <Text style={styles.sendBtnText}>Send Commands</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#888',
  },
  id: {
    color: '#888',
    fontSize: 12,
  },
  lastUpdated: {
    color: '#bbb',
    fontSize: 12,
    marginBottom: 10,
  },
  tempRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  currentTemp: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  tempInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tempInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 8,
    width: 50,
    textAlign: 'center',
    marginRight: 4,
  },
  tempUnit: {
    color: '#888',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  fanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fanValue: {
    marginLeft: 8,
    width: 40,
    textAlign: 'right',
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  buzzerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  buzzerBtn: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  buzzerBtnActive: {
    backgroundColor: '#ef4444',
  },
  buzzerBtnText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  sendBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ControlPanelScreen;
