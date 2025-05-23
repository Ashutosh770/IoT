import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  RefreshControl,
  Animated,
  Dimensions,
  Modal,
  FlatList,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, G, Text as SvgText } from 'react-native-svg';
import { LineChart } from 'react-native-chart-kit';
import { fetchLatestData, fetchHistoryData } from '../services/api';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Component for data visualization bar
const DataBar = ({ value, maxValue, color, label }: { value: number, maxValue: number, color: string, label: string }) => {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  
  return (
    <View style={styles.barContainer}>
      <View style={styles.barLabelContainer}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>{value.toFixed(1)}</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

// Temperature Dial Component
const TemperatureDial = ({ temperature }: { temperature: number }) => {
  // Calculate the angle for the temperature (0-50°C maps to 135° to -135°)
  const getTemperatureColor = (temp: number) => {
    if (temp < 10) return '#4dabf7'; // cold - blue
    if (temp < 20) return '#51cf66'; // cool - green
    if (temp < 30) return '#fcc419'; // warm - yellow
    return '#ff6b6b';  // hot - red
  };
  
  // Convert temperature to angle (0-50°C maps to 135° to -135°)
  const tempAngle = 135 - (temperature / 50) * 270;
  
  // Generate the arc path for the dial
  const generateArc = (radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(radius, startAngle);
    const end = polarToCartesian(radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };
  
  // Convert polar coordinates to cartesian
  const polarToCartesian = (radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: 100 + (radius * Math.cos(angleInRadians)),
      y: 100 + (radius * Math.sin(angleInRadians))
    };
  };
  
  // Generate tick marks
  const generateTicks = () => {
    const ticks = [];
    const radius = 80;
    const tickLength = 10;
    
    for (let angle = 135; angle >= -135; angle -= 15) {
      const outer = polarToCartesian(radius, angle);
      const inner = polarToCartesian(radius - tickLength, angle);
      
      // Determine color based on position
      let tickColor;
      if (angle > 90) tickColor = '#4dabf7'; // blue
      else if (angle > 0) tickColor = '#51cf66'; // green
      else if (angle > -90) tickColor = '#fcc419'; // yellow
      else tickColor = '#ff6b6b'; // red
      
      ticks.push(
        <Path
          key={`tick-${angle}`}
          d={`M ${outer.x} ${outer.y} L ${inner.x} ${inner.y}`}
          stroke={tickColor}
          strokeWidth="2"
        />
      );
    }
    return ticks;
  };
  
  // Calculate needle position
  const needlePoint = polarToCartesian(60, tempAngle);
  
  return (
    <View style={styles.dialContainer}>
      <Svg height="200" width="200" viewBox="0 0 200 200">
        {/* Background Circle */}
        <Circle cx="100" cy="100" r="85" fill="#f8f9fb" stroke="#e9ecef" strokeWidth="2" />
        
        {/* Colored Arc */}
        <Path
          d={generateArc(80, 135, -135)}
          stroke="#e9ecef"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Tick Marks */}
        <G>
          {generateTicks()}
        </G>
        
        {/* Temperature Needle */}
        <G>
          <Path
            d={`M 100 100 L ${needlePoint.x} ${needlePoint.y}`}
            stroke={getTemperatureColor(temperature)}
            strokeWidth="3"
            fill="none"
          />
          <Circle cx="100" cy="100" r="8" fill={getTemperatureColor(temperature)} />
        </G>
        
        {/* Temperature Text */}
        <G>
          <SvgText
            x="100"
            y="85"
            fontSize="28"
            fontWeight="bold"
            fill="#4a5568"
            textAnchor="middle"
          >
            {temperature.toFixed(1)}
          </SvgText>
          <SvgText
            x="130"
            y="80"
            fontSize="16"
            fill="#4a5568"
            textAnchor="middle"
          >
            °C
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

// History Graph Component
const HistoryGraph = ({ historyData }: { historyData: any[] }) => {
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Process data for chart
  const processChartData = () => {
    if (!currentData || currentData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            data: [0],
            color: () => '#ff6b6b',
            strokeWidth: 2
          },
          {
            data: [0],
            color: () => '#4dabf7',
            strokeWidth: 2
          }
        ],
        legend: ['Temperature', 'Humidity']
      };
    }

    // Format timestamps for labels (HH:MM:SS format)
    const labels = currentData.map(item => {
      const date = new Date(item.timestamp);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    });
    
    // Extract temperature and humidity values
    const temperatureData = currentData.map(item => parseFloat(item.temperature) || 0);
    const humidityData = currentData.map(item => parseFloat(item.humidity) || 0);
    
    return {
      labels,
      datasets: [
        {
          data: temperatureData,
          color: () => '#ff6b6b', // red
          strokeWidth: 2
        },
        {
          data: humidityData,
          color: () => '#4dabf7', // blue
          strokeWidth: 2
        }
      ],
      legend: ['Temperature', 'Humidity']
    };
  };

  // Update data every second
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Get the last 30 seconds of data
      const thirtySecondsAgo = new Date(currentTime.getTime() - 30000);
      
      // Filter and sort data
      const recentData = historyData
        .filter(item => new Date(item.timestamp) >= thirtySecondsAgo)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      // Only update if we have new data
      if (recentData.length > 0) {
        setCurrentData(recentData);
      }
    }, 1000); // Update every second

    return () => clearInterval(updateInterval);
  }, [historyData, currentTime]);

  const chartData = processChartData();
  
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '2',
      strokeWidth: '1',
    },
    // Add animation configuration
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphTitle}>Real-time Monitoring</Text>
      {currentData && currentData.length > 0 ? (
        <LineChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={true}
          withShadow={false}
          fromZero={false}
          yAxisSuffix="°"
          yAxisInterval={1}
          segments={5}
          renderDotContent={({ x, y, index, indexData }) => {
            // Only show dots for every 5th point to avoid overcrowding
            if (index % 5 !== 0) return null;
            return (
              <SvgText
                key={`dot-${index}`}
                x={x}
                y={y - 10}
                fill="#333"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {indexData.toFixed(1)}
              </SvgText>
            );
          }}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      )}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#ff6b6b' }]} />
          <Text style={styles.legendText}>Temperature (°C)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4dabf7' }]} />
          <Text style={styles.legendText}>Humidity (%)</Text>
        </View>
      </View>
    </View>
  );
};

// Hamburger Icon Component
const HamburgerIcon = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.hamburgerButton} onPress={onPress}>
    <View style={styles.hamburgerLine} />
    <View style={styles.hamburgerLine} />
    <View style={styles.hamburgerLine} />
  </TouchableOpacity>
);

// Widget Configuration Type
type WidgetConfig = {
  id: string;
  title: string;
  enabled: boolean;
  component: 'gauge' | 'cards' | 'bars' | 'graph';
};

const SensorDetailScreen = ({ navigation }: any) => {
  const [sensorData, setSensorData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Widget configurations
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: '1', title: 'Temperature Gauge', enabled: true, component: 'gauge' },
    { id: '2', title: 'Temperature & Humidity Cards', enabled: true, component: 'cards' },
    { id: '3', title: 'Data Visualization Bars', enabled: true, component: 'bars' },
    { id: '4', title: 'History Graph', enabled: true, component: 'graph' },
  ]);

  // Animation value for menu
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const loadData = async () => {
    setLoading(true);
    
    // Load current sensor data
    const result = await fetchLatestData();
    if (result.success) {
      setSensorData(result.data);
      setLastUpdated(new Date());
    }
    
    // Load history data for graph
    const history = await fetchHistoryData();
    if (history && history.length > 0) {
      setHistoryData(history);
    }
    
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh interval
    const refreshInterval = setInterval(() => {
      loadData();
    }, 30000); // 30 seconds
    
    return () => clearInterval(refreshInterval);
  }, []);

  // For debugging
  useEffect(() => {
    console.log("Sensor data updated:", sensorData);
  }, [sensorData]);

  // Toggle menu visibility
  const toggleMenu = () => {
    if (menuVisible) {
      // Hide menu
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      // Show menu
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Toggle widget visibility
  const toggleWidget = (id: string) => {
    setWidgets(
      widgets.map(widget => 
        widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
      )
    );
  };

  // Check if a component should be shown
  const shouldShowComponent = (component: 'gauge' | 'cards' | 'bars' | 'graph') => {
    return widgets.some(widget => widget.component === component && widget.enabled);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Main Content */}
      <View style={styles.mainContainer}>
        <View style={styles.headerRow}>
          <HamburgerIcon onPress={toggleMenu} />
          <Text style={styles.title}>Living Room Sensor</Text>
          {sensorData ? (
            <Text style={styles.statusOnline}>Online</Text>
          ) : (
            <Text style={styles.statusOffline}>Offline</Text>
          )}
        </View>

        <ScrollView 
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading sensor data...</Text>
            </View>
          ) : (
            <>
              {/* Temperature Dial */}
              {sensorData && shouldShowComponent('gauge') && (
                <View style={styles.dialWrapper}>
                  <TemperatureDial temperature={parseFloat(sensorData.temperature) || 0} />
                </View>
              )}
            
              {/* Temperature and Humidity Cards */}
              {shouldShowComponent('cards') && (
                <View style={styles.row}>
                  <View style={styles.card}>
                    <Text style={styles.label}>Temperature</Text>
                    <Text style={styles.value}>{sensorData?.temperature || '--'}°C</Text>
                  </View>
                  <View style={styles.card}>
                    <Text style={styles.label}>Humidity</Text>
                    <Text style={styles.value}>{sensorData?.humidity || '--'}%</Text>
                  </View>
                </View>
              )}
            </>
          )}
          
          {/* Data visualization bars */}
          {sensorData && !loading && shouldShowComponent('bars') && (
            <View style={styles.barsContainer}>
              <DataBar 
                value={parseFloat(sensorData.temperature) || 0} 
                maxValue={50} 
                color="#ff6b6b" 
                label="Temperature (°C)" 
              />
              <DataBar 
                value={parseFloat(sensorData.humidity) || 0} 
                maxValue={100} 
                color="#4dabf7" 
                label="Humidity (%)" 
              />
            </View>
          )}
          
          {/* History Graph */}
          {!loading && shouldShowComponent('graph') && (
            <HistoryGraph historyData={historyData} />
          )}
          
          <View style={styles.historyHeader}>
            <Text style={styles.subtitle}>Device Info</Text>
            <Text style={styles.autoRefresh}>Auto-refresh: 30s</Text>
          </View>
          
          <View style={styles.historyBox}>
            {sensorData ? (
              <View style={styles.dataInfo}>
                <Text style={styles.deviceId}>Device ID: {sensorData.deviceId}</Text>
                <Text style={styles.timestamp}>Last updated: {lastUpdated?.toLocaleTimeString()}</Text>
              </View>
            ) : (
              <Text style={{color:'#bbb'}}>No data available</Text>
            )}
          </View>
          
          <TouchableOpacity style={styles.controlBtn} onPress={() => navigation.navigate('ControlPanel')}>
            <Text style={styles.controlBtnText}>Go to Control Panel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Slide-in Menu */}
      {menuVisible && (
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.sideMenu,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Widget Settings</Text>
              <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={widgets}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  <Switch
                    value={item.enabled}
                    onValueChange={() => toggleWidget(item.id)}
                    trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
                    thumbColor={item.enabled ? '#3b82f6' : '#f4f3f4'}
                  />
                </View>
              )}
              contentContainerStyle={styles.menuList}
            />
            
            <View style={styles.menuFooter}>
              <TouchableOpacity 
                style={styles.applyButton} 
                onPress={toggleMenu}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fb',
    padding: 16,
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  statusOnline: { color: '#22c55e', fontWeight: 'bold' },
  statusOffline: { color: '#ef4444', fontWeight: 'bold' },
  battery: { color: '#888', fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, marginHorizontal: 4, alignItems: 'center' },
  label: { color: '#888', fontSize: 14 },
  value: { fontWeight: 'bold', fontSize: 18 },
  subtitle: { fontWeight: 'bold', fontSize: 16 },
  autoRefresh: { color: '#bbb', fontSize: 12 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 8 },
  historyBox: { backgroundColor: '#fff', borderRadius: 12, minHeight: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 20, padding: 12 },
  controlBtn: { backgroundColor: '#3b82f6', borderRadius: 10, padding: 12, alignItems: 'center' },
  controlBtnText: { color: '#fff', fontWeight: 'bold' },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: '#666' },
  dataInfo: { width: '100%' },
  deviceId: { fontSize: 14, color: '#666' },
  timestamp: { fontSize: 12, color: '#888', marginTop: 4 },
  // Bar styles
  barsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  barContainer: {
    marginBottom: 12,
  },
  barLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
  },
  barValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#444',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  // Dial styles
  dialWrapper: {
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  dialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Graph styles
  graphContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4b5563',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#4b5563',
  },
  // Hamburger menu styles
  hamburgerButton: {
    width: 24,
    height: 24,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  hamburgerLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#f3f4f6',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#4b5563',
  },
  menuList: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemText: {
    fontSize: 16,
    color: '#4b5563',
  },
  menuFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  applyButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#bbb',
    fontSize: 16,
  },
});

export default SensorDetailScreen;
