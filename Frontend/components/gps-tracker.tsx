import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useGeofence } from '../contexts/GeofenceContext';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface GPSTrackerProps {
  showDebugInfo?: boolean;
}

export const GPSTracker: React.FC<GPSTrackerProps> = ({ showDebugInfo = false }) => {
  const { currentLocation, isTracking, locationPermission, startTracking } = useGeofence();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isTracking && locationPermission) {
      startTracking();
    }
  }, [isTracking, locationPermission, startTracking]);

  const onRefresh = async () => {
    setRefreshing(true);
    await startTracking();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatCoordinate = (value: number): string => {
    return value.toFixed(6);
  };

  const getAccuracyLevel = (accuracy: number | null): string => {
    if (!accuracy) return 'Unknown';
    if (accuracy < 10) return 'Excellent';
    if (accuracy < 25) return 'Good';
    if (accuracy < 50) return 'Fair';
    if (accuracy < 100) return 'Poor';
    return 'Very Poor';
  };

  const getAccuracyColor = (accuracy: number | null): string => {
    if (!accuracy) return '#999999';
    if (accuracy < 10) return '#00AA00';
    if (accuracy < 25) return '#44BB00';
    if (accuracy < 50) return '#FFBB00';
    if (accuracy < 100) return '#FF6600';
    return '#CC0000';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.card}>
        <ThemedText style={styles.title}>GPS Location Tracker</ThemedText>

        {/* Status Indicators */}
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: isTracking ? '#00AA00' : '#CC0000' }]} />
            <ThemedText style={styles.statusText}>
              {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
            </ThemedText>
          </View>

          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: locationPermission ? '#00AA00' : '#CC0000' }]} />
            <ThemedText style={styles.statusText}>
              {locationPermission ? 'Permission Granted' : 'Permission Denied'}
            </ThemedText>
          </View>
        </View>

        {/* Location Data */}
        {currentLocation ? (
          <View style={styles.dataSection}>
            <View style={styles.dataRow}>
              <ThemedText style={styles.label}>Latitude:</ThemedText>
              <ThemedText style={styles.value}>
                {formatCoordinate(currentLocation.latitude)}
              </ThemedText>
            </View>

            <View style={styles.dataRow}>
              <ThemedText style={styles.label}>Longitude:</ThemedText>
              <ThemedText style={styles.value}>
                {formatCoordinate(currentLocation.longitude)}
              </ThemedText>
            </View>

            <View style={styles.accuracyRow}>
              <ThemedText style={styles.label}>Accuracy:</ThemedText>
              <View style={[styles.accuracyBadge, { borderColor: getAccuracyColor(currentLocation.accuracy) }]}>
                <ThemedText style={[styles.accuracyText, { color: getAccuracyColor(currentLocation.accuracy) }]}>
                  {getAccuracyLevel(currentLocation.accuracy)}
                </ThemedText>
              </View>
              {currentLocation.accuracy && (
                <ThemedText style={styles.value}>
                  ±{Math.round(currentLocation.accuracy)}m
                </ThemedText>
              )}
            </View>

            {showDebugInfo && (
              <>
                {currentLocation.altitude !== null && (
                  <View style={styles.dataRow}>
                    <ThemedText style={styles.label}>Altitude:</ThemedText>
                    <ThemedText style={styles.value}>
                      {Math.round(currentLocation.altitude)}m
                    </ThemedText>
                  </View>
                )}

                {currentLocation.speed !== null && (
                  <View style={styles.dataRow}>
                    <ThemedText style={styles.label}>Speed:</ThemedText>
                    <ThemedText style={styles.value}>
                      {(currentLocation.speed * 3.6).toFixed(2)} km/h
                    </ThemedText>
                  </View>
                )}

                {currentLocation.heading !== null && (
                  <View style={styles.dataRow}>
                    <ThemedText style={styles.label}>Heading:</ThemedText>
                    <ThemedText style={styles.value}>
                      {Math.round(currentLocation.heading)}°
                    </ThemedText>
                  </View>
                )}

                <View style={styles.dataRow}>
                  <ThemedText style={styles.label}>Last Updated:</ThemedText>
                  <ThemedText style={styles.value}>
                    {new Date(currentLocation.timestamp).toLocaleTimeString()}
                  </ThemedText>
                </View>
              </>
            )}
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <ThemedText style={styles.noDataText}>
              Waiting for location data...
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dataSection: {
    gap: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  accuracyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  accuracyBadge: {
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 8,
  },
  accuracyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  noDataContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
  },
});
