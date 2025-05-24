import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ConnectedDevicesScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Connected Devices</Text>
        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <Text style={styles.tabActive}>All</Text>
          <Text style={styles.tab}>Labs</Text>
          <Text style={styles.tab}>Classrooms</Text>
          <Text style={styles.tab}>Workshop</Text>
        </View>
        {/* Devices List */}
        <TouchableOpacity style={styles.deviceCard} onPress={() => navigation.navigate('SensorDetail')}>
          <View style={styles.deviceHeader}>
            <Text style={styles.deviceName}>SensorKit A - Lab 1</Text>
            <Text style={styles.statusOnline}>Online</Text>
          </View>
          <View style={styles.deviceRow}>
            <Text>Temperature <Text style={styles.bold}>28°C</Text></Text>
            <Text>Humidity <Text style={styles.bold}>65%</Text></Text>
          </View>
          <Text style={styles.lastActive}>Last active: 2 mins ago</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deviceCard}>
          <View style={styles.deviceHeader}>
            <Text style={styles.deviceName}>SensorKit B - Workshop</Text>
            <Text style={styles.statusOffline}>Offline</Text>
          </View>
          <View style={styles.deviceRow}>
            <Text>Gas Level <Text style={styles.bold}>Normal</Text></Text>
            <Text>Pulse <Text style={styles.bold}>--</Text></Text>
          </View>
          <Text style={styles.lastActive}>Last active: 2 hours ago</Text>
        </TouchableOpacity>
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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  filterTabs: { flexDirection: 'row', marginBottom: 12 },
  tab: { marginRight: 10, color: '#888', padding: 6, borderRadius: 8 },
  tabActive: { marginRight: 10, color: '#fff', backgroundColor: '#3b82f6', padding: 6, borderRadius: 8 },
  deviceCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4 },
  deviceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  deviceName: { fontWeight: 'bold', fontSize: 16 },
  statusOnline: { color: '#22c55e', fontWeight: 'bold' },
  statusOffline: { color: '#ef4444', fontWeight: 'bold' },
  deviceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  bold: { fontWeight: 'bold' },
  lastActive: { color: '#888', fontSize: 12 },
});

export default ConnectedDevicesScreen;
