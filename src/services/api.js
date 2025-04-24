import axios from 'axios';

// Match the ESP32's server URL
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api`;

export const fetchLatestData = async () => {
  try {
    console.log('Fetching data from:', `${API_URL}/data/latest`);
    const response = await axios.get(`${API_URL}/data/latest`);
    console.log('Received data:', response.data);
    
    // Ensure the response has the correct structure
    if (response.data && typeof response.data === 'object') {
      return {
        success: true,
        data: {
          temperature: parseFloat(response.data.temperature) || 0,
          humidity: parseFloat(response.data.humidity) || 0,
          deviceId: response.data.deviceId || 'ESP32_D15',
          timestamp: response.data.timestamp || new Date().toISOString()
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
      console.error("Make sure your backend server is running on port 3000");
      console.error("And that you're connected to the same network as the ESP32");
    }
    return { success: false, data: null };
  }
};

export const fetchHistoryData = async () => {
  try {
    console.log('Fetching history from:', `${API_URL}/data`);
    const response = await axios.get(`${API_URL}/data`);
    console.log('Received history:', response.data);
    
    // Check if response has data array
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching history:", error.message);
    if (error.response) {
      console.error("Server responded with:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Is the server running?");
      console.error("Make sure your backend server is running on port 3000");
      console.error("And that you're connected to the same network as the ESP32");
    }
    return [];
  }
};