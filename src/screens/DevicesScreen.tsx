import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Switch } from 'react-native';

// Define types for device objects
interface Device {
  id: string;
  name: string;
  type: 'switch' | 'sensor';
  state?: boolean;
  value?: number;
}

// Mock data for devices
const mockDevices: Device[] = [
  { id: '1', name: 'Living Room Light', type: 'switch', state: true },
  { id: '2', name: 'Temperature Sensor', type: 'sensor', value: 22.5 },
  { id: '3', name: 'Garage Door', type: 'switch', state: false },
];

// Device Card Component
const DeviceCard: React.FC<{ device: Device }> = ({ device }) => {
  const [isEnabled, setIsEnabled] = React.useState(device.state || false);
  
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    // Here you would send the command to your IoT device
    console.log(`Turning ${device.name} ${!isEnabled ? 'ON' : 'OFF'}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.deviceName}>{device.name}</Text>
        {device.type === 'switch' ? (
          <Switch
            value={isEnabled}
            onValueChange={toggleSwitch}
          />
        ) : (
          <Text style={styles.sensorValue}>{device.value}°C</Text>
        )}
      </View>
      <Text style={styles.deviceType}>{device.type}</Text>
    </View>
  );
};

export default function DevicesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Devices</Text>
      <FlatList
        data={mockDevices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DeviceCard device={item} />}
        style={styles.list}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add device')}>
        <Text style={styles.addButtonText}>+ Add Device</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceType: {
    fontSize: 14,
    color: '#777',
    textTransform: 'capitalize',
  },
  sensorValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 