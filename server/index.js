const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for sensor data
let sensorData = [];
const MAX_HISTORY = 100; // Keep last 100 readings

// Helper function to add new data
const addSensorData = (data) => {
  sensorData.unshift({
    ...data,
    timestamp: new Date().toISOString()
  });
  
  // Keep only the last MAX_HISTORY readings
  if (sensorData.length > MAX_HISTORY) {
    sensorData = sensorData.slice(0, MAX_HISTORY);
  }
};

// Generate test data
const generateTestData = () => {
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const timestamp = new Date(now.getTime() - (i * 1000)); // One reading per second
    addSensorData({
      temperature: 25 + Math.random() * 5, // Random temperature between 25-30
      humidity: 55 + Math.random() * 10,   // Random humidity between 55-65
      deviceId: 'ESP32_D15',
      timestamp: timestamp.toISOString()
    });
  }
};

// Generate initial test data
generateTestData();

// Endpoint to receive new sensor data
app.post('/api/data', (req, res) => {
  const { temperature, humidity, deviceId } = req.body;
  
  if (typeof temperature === 'undefined' || typeof humidity === 'undefined') {
    return res.status(400).json({ error: 'Temperature and humidity are required' });
  }

  const newData = {
    temperature: parseFloat(temperature),
    humidity: parseFloat(humidity),
    deviceId: deviceId || 'ESP32_D15'
  };

  addSensorData(newData);
  res.json({ success: true, data: newData });
});

// Endpoint to get latest data
app.get('/api/data/latest', (req, res) => {
  if (sensorData.length === 0) {
    return res.json({
      temperature: 0,
      humidity: 0,
      deviceId: 'ESP32_D15',
      timestamp: new Date().toISOString()
    });
  }
  res.json(sensorData[0]);
});

// Endpoint to get history
app.get('/api/data/history', (req, res) => {
  res.json(sensorData);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  POST /api/data - Add new sensor data');
  console.log('  GET  /api/data/latest - Get latest sensor data');
  console.log('  GET  /api/data/history - Get sensor data history');
  console.log('\nTest data generated with 30 readings');
}); 