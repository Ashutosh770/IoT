import axios from 'axios';

// Use environment variable with fallback
const API_URL = process.env.EXPO_PUBLIC_API_URL 
  ? `${process.env.EXPO_PUBLIC_API_URL}/api`
  : 'https://iot-backend-dj8u.onrender.com/api';

// Log the API URL for debugging
console.log('Using API URL:', API_URL);

export const fetchLatestData = async () => {
  try {
    console.log('Fetching data from:', `${API_URL}/data/latest`);
    const response = await axios.get(`${API_URL}/data/latest`);
    console.log('Received data:', response.data);
    
    // Handle MongoDB data structure
    if (response.data && typeof response.data === 'object') {
      const data = response.data;
      return {
        success: true,
        data: {
          temperature: parseFloat(data.temperature) || 0,
          humidity: parseFloat(data.humidity) || 0,
          deviceId: data.deviceId || 'ESP32_001',
          timestamp: data.timestamp?.$date || new Date().toISOString()
        }
      };
    }
    return { success: false, data: null };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    if (error.response) {
      console.error("Server responded with:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Is the server running?");
      console.error("Make sure your backend server is running");
    }
    return { success: false, data: null };
  }
};

export const fetchHistoryData = async () => {
  try {
    console.log('Fetching history from:', `${API_URL}/data/history`);
    const response = await axios.get(`${API_URL}/data/history`);
    console.log('Received history:', response.data);
    
    // Handle MongoDB data structure
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(item => ({
        temperature: parseFloat(item.temperature) || 0,
        humidity: parseFloat(item.humidity) || 0,
        deviceId: item.deviceId || 'ESP32_001',
        timestamp: item.timestamp?.$date || new Date().toISOString()
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching history:", error.message);
    if (error.response) {
      console.error("Server responded with:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Is the server running?");
      console.error("Make sure your backend server is running");
    }
    return [];
  }
};