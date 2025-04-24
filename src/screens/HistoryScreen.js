import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { fetchHistoryData } from '../services/api';

export default function HistoryScreen() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchHistoryData();
        if (Array.isArray(data) && data.length > 0) {
          // Sort by timestamp in descending order (newest first)
          const sortedData = [...data].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
          );
          setHistoryData(sortedData);
        } else {
          setError('No historical data available');
        }
      } catch (err) {
        setError('Error loading history data');
        console.error('Error in loadHistory:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
      <View style={styles.dataRow}>
        <Text style={styles.label}>Temperature:</Text>
        <Text style={styles.value}>{item.temperature}°C</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.label}>Humidity:</Text>
        <Text style={styles.value}>{item.humidity}%</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor History</Text>
      
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : historyData.length > 0 ? (
        <FlatList
          data={historyData}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.centerContent}>
          <Text>No history data available</Text>
        </View>
      )}
    </View>
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
    textAlign: 'center'
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  },
  listContainer: {
    paddingBottom: 20
  },
  historyItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  timestamp: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  label: {
    fontSize: 16,
    color: '#666'
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});