// Device types
export interface Device {
  id: string;
  name: string;
  type: 'switch' | 'sensor';
  state?: boolean;
  value?: number;
  topic?: string;
  lastUpdated?: Date;
}

// Generate a unique ID for new devices
export const generateDeviceId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15);
};

// Format sensor values with appropriate units
export const formatSensorValue = (device: Device): string => {
  if (!device.value) return 'N/A';
  
  switch (device.name.toLowerCase()) {
    case 'temperature':
    case 'temperature sensor':
      return `${device.value}°C`;
    case 'humidity':
    case 'humidity sensor':
      return `${device.value}%`;
    case 'pressure':
    case 'pressure sensor':
      return `${device.value} hPa`;
    case 'light':
    case 'light sensor':
      return `${device.value} lux`;
    default:
      return `${device.value}`;
  }
};

// Parse a message from an MQTT topic
export const parseDeviceMessage = (topic: string, message: string): Partial<Device> => {
  try {
    const data = JSON.parse(message);
    
    // Basic validation
    if (typeof data !== 'object') {
      throw new Error('Invalid message format');
    }
    
    return {
      ...data,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error parsing device message:', error);
    return { lastUpdated: new Date() };
  }
};

// Create a message to send to a device
export const createDeviceMessage = (device: Device, newState?: boolean): string => {
  const payload = {
    id: device.id,
    state: newState !== undefined ? newState : device.state,
    timestamp: new Date().toISOString()
  };
  
  return JSON.stringify(payload);
}; 