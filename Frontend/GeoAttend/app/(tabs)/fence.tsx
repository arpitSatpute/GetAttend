import React, { useState, useEffect } from 'react';
import MapView, { Circle, Marker } from 'react-native-maps';
import { StyleSheet, View, Alert, Text, TouchableOpacity, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

interface Coordinate {
  latitude: number;
  longitude: number;
}

export default function GeofenceScreen() {
  // Current location for fence center
  const [fenceCenter, setFenceCenter] = useState<Coordinate>({
    latitude: 21.355897,
    longitude: 78.980604
  });

  // User's pointer location (starts at current location)
  const [pointerLocation, setPointerLocation] = useState<Coordinate>({
    latitude: 21.355897,
    longitude: 78.980604
  });

  const [isInsideFence, setIsInsideFence] = useState<boolean>(true);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSettingFence, setIsSettingFence] = useState<boolean>(false);
  const [fenceRadius, setFenceRadius] = useState<number>(200); // Default 200m
  const [alertHistory, setAlertHistory] = useState<Array<{
    time: string;
    status: string;
    distance: number;
  }>>([]);

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Send alert (using vibration and visual feedback instead of push notifications)
  const sendAlert = (title: string, body: string, isInside: boolean) => {
    // Vibration pattern for alerts
    const vibrationPattern = isInside 
      ? [100, 200, 100] // Short vibration for entering
      : [200, 100, 200, 100, 200]; // Longer vibration for exiting

    Vibration.vibrate(vibrationPattern);

    // Add to alert history
    const newAlert = {
      time: new Date().toLocaleTimeString(),
      status: isInside ? 'ENTERED' : 'EXITED',
      distance: Math.round(calculateDistance(fenceCenter, pointerLocation))
    };

    setAlertHistory(prev => [newAlert, ...prev.slice(0, 4)]); // Keep last 5 alerts

    // Show visual alert
    Alert.alert(
      title,
      body,
      [{ text: 'OK', style: isInside ? 'default' : 'destructive' }]
    );
  };

  const getCurrentLocation = async () => {
    try {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location permissions to use geofencing.');
        setLocationPermission(false);
        setIsLoading(false);
        return;
      }

      setLocationPermission(true);

      // Get current position
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const currentCoordinate: Coordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Set both fence center and pointer to current location
      setFenceCenter(currentCoordinate);
      setPointerLocation(currentCoordinate);
      setIsLoading(false);

    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get your current location. Using default location.');
      setIsLoading(false);
    }
  };

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (point1: Coordinate, point2: Coordinate): number => {
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = (point1.latitude * Math.PI) / 180;
    const lat2Rad = (point2.latitude * Math.PI) / 180;
    const deltaLatRad = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const deltaLngRad = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLngRad / 2) *
        Math.sin(deltaLngRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Handle map press - either set fence center or move pointer
  const handleMapPress = (coordinate: Coordinate) => {
    if (isSettingFence) {
      setFenceCenter(coordinate);
      setIsSettingFence(false);
      Alert.alert('Fence Set!', `Geofence center has been set to the selected location.`);
      // Recalculate if pointer is inside new fence
      const distance = calculateDistance(coordinate, pointerLocation);
      setIsInsideFence(distance <= fenceRadius);
    } else {
      handlePointerMove(coordinate);
    }
  };

  // Handle pointer movement
  const handlePointerMove = (coordinate: Coordinate) => {
    setPointerLocation(coordinate);
    
    const distance = calculateDistance(fenceCenter, coordinate);
    const wasInside = isInsideFence;
    const nowInside = distance <= fenceRadius;

    setIsInsideFence(nowInside);

    // Show alert and send feedback when status changes
    if (wasInside !== nowInside) {
      if (nowInside) {
        sendAlert(
          '✅ Entered Geofence',
          `You have entered the geofenced area. Distance: ${Math.round(distance)}m`,
          true
        );
      } else {
        sendAlert(
          '🚫 Exited Geofence',
          `You have left the geofenced area. Distance: ${Math.round(distance)}m`,
          false
        );
      }
    }
  };

  // Function to refresh current location
  const refreshLocation = async () => {
    setIsLoading(true);
    await getCurrentLocation();
  };

  // Toggle fence setting mode
  const toggleFenceSettingMode = () => {
    setIsSettingFence(!isSettingFence);
  };

  // Set fence to current location
  const setFenceToCurrentLocation = async () => {
    setIsLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const currentCoordinate: Coordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setFenceCenter(currentCoordinate);
      Alert.alert('Fence Updated!', 'Geofence center has been set to your current location.');
      
      // Recalculate if pointer is inside new fence
      const distance = calculateDistance(currentCoordinate, pointerLocation);
      setIsInsideFence(distance <= fenceRadius);
      
    } catch (error) {
      Alert.alert('Error', 'Unable to get your current location.');
    }
    setIsLoading(false);
  };

  // Test alert function
  const testAlert = () => {
    sendAlert(
      '🧪 Test Alert',
      'This is a test geofence alert with vibration!',
      isInsideFence
    );
  };

  // Clear alert history
  const clearAlertHistory = () => {
    setAlertHistory([]);
    Alert.alert('Cleared!', 'Alert history has been cleared.');
  };

  const currentDistance = calculateDistance(fenceCenter, pointerLocation);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Getting your current location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, { color: isInsideFence ? '#4CAF50' : '#F44336' }]}>
          Status: {isInsideFence ? 'INSIDE' : 'OUTSIDE'} fence
        </Text>
        <Text style={styles.distanceText}>
          Distance: {Math.round(currentDistance)}m from center
        </Text>
        
        {/* Alert Status */}
        <Text style={styles.notificationStatus}>
          📳 Alerts: Vibration + Visual (Expo Go Compatible)
        </Text>
        
        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          <TouchableOpacity 
            style={[styles.controlButton, isSettingFence && styles.activeButton]} 
            onPress={toggleFenceSettingMode}
          >
            <Text style={[styles.controlButtonText, isSettingFence && styles.activeButtonText]}>
              {isSettingFence ? '📍 Tap Map to Set Fence' : '⚙️ Set Fence Location'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={setFenceToCurrentLocation}
          >
            <Text style={styles.controlButtonText}>📍 Use Current Location</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testAlert}
          >
            <Text style={styles.controlButtonText}>🧪 Test Alert</Text>
          </TouchableOpacity>
        </View>

        {/* Radius Controls */}
        <View style={styles.radiusControls}>
          <Text style={styles.radiusLabel}>Fence Radius: {fenceRadius}m</Text>
          <View style={styles.radiusButtons}>
            <TouchableOpacity 
              style={styles.radiusButton} 
              onPress={() => {
                const newRadius = Math.max(50, fenceRadius - 50);
                setFenceRadius(newRadius);
                const distance = calculateDistance(fenceCenter, pointerLocation);
                setIsInsideFence(distance <= newRadius);
              }}
            >
              <Text style={styles.radiusButtonText}>-50m</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.radiusButton} 
              onPress={() => {
                const newRadius = Math.min(1000, fenceRadius + 50);
                setFenceRadius(newRadius);
                const distance = calculateDistance(fenceCenter, pointerLocation);
                setIsInsideFence(distance <= newRadius);
              }}
            >
              <Text style={styles.radiusButtonText}>+50m</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Alert History */}
        {alertHistory.length > 0 && (
          <View style={styles.alertHistory}>
            <View style={styles.alertHistoryHeader}>
              <Text style={styles.alertHistoryTitle}>Recent Alerts</Text>
              <TouchableOpacity onPress={clearAlertHistory}>
                <Text style={styles.clearButton}>Clear</Text>
              </TouchableOpacity>
            </View>
            {alertHistory.map((alert, index) => (
              <View key={index} style={styles.alertItem}>
                <Text style={[styles.alertStatus, { 
                  color: alert.status === 'ENTERED' ? '#4CAF50' : '#F44336' 
                }]}>
                  {alert.status === 'ENTERED' ? '✅' : '🚫'} {alert.status}
                </Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
                <Text style={styles.alertDistance}>{alert.distance}m</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <MapView
      provider='google'
        style={styles.map}
        initialRegion={{
          latitude: fenceCenter.latitude,
          longitude: fenceCenter.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={(event) => {
          handleMapPress(event.nativeEvent.coordinate);
        }}
      >
        {/* Geofence Circle */}
        <Circle
          center={fenceCenter}
          radius={fenceRadius}
          strokeWidth={2}
          strokeColor="#4285F4"
          fillColor="rgba(66, 133, 244, 0.1)"
        />

        {/* Fence Center Marker */}
        <Marker
          coordinate={fenceCenter}
          title="Fence Center"
          description={`${fenceRadius}m radius geofence center`}
          pinColor="#4285F4"
          draggable={true}
          onDragEnd={(event) => {
            setFenceCenter(event.nativeEvent.coordinate);
            const distance = calculateDistance(event.nativeEvent.coordinate, pointerLocation);
            setIsInsideFence(distance <= fenceRadius);
            Alert.alert('Fence Moved!', 'Geofence center has been updated.');
            Vibration.vibrate(100); // Short vibration feedback
          }}
        />

        {/* User Pointer */}
        <Marker
          coordinate={pointerLocation}
          title={isInsideFence ? "Inside Fence" : "Outside Fence"}
          description={`Distance: ${Math.round(currentDistance)}m`}
          pinColor={isInsideFence ? "#4CAF50" : "#F44336"}
          draggable={true}
          onDragEnd={(event) => {
            handlePointerMove(event.nativeEvent.coordinate);
          }}
        />
      </MapView>

      {/* <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          {isSettingFence 
            ? "🎯 Tap anywhere on the map to set fence center" 
            : "📍 Drag markers or tap map to test geofencing"
          }
        </Text>
        <Text style={styles.instructionText}>
          🔵 Blue marker = Fence center | 🔴/🟢 Red/Green marker = Test pointer
        </Text>
        <Text style={styles.instructionText}>
          📳 Alerts use vibration + visual feedback (works in Expo Go)
        </Text>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  statusContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
  },
  notificationStatus: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  controlButtons: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  controlButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#FF9800',
  },
  testButton: {
    backgroundColor: '#9C27B0',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  activeButtonText: {
    color: 'white',
  },
  radiusControls: {
    alignItems: 'center',
    marginBottom: 12,
  },
  radiusLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  radiusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  radiusButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  alertHistory: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  alertHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertHistoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    fontSize: 12,
    color: '#FF5722',
    textDecorationLine: 'underline',
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  alertStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  alertTime: {
    fontSize: 10,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  alertDistance: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
  },
  map: {
    flex: 1,
  },
  instructionContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  instructionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
});