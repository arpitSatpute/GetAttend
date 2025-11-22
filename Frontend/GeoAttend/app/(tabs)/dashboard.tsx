
import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AttendanceCard } from '../../components/attendance-card';
import { GPSTracker } from '../../components/gps-tracker';
import { NotificationCenter } from '../../components/notification-center';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useAttendance } from '../../contexts/AttendanceContext';
import { useGeofence } from '../../contexts/GeofenceContext';
import { useNotification } from '../../contexts/NotificationContext';

export default function EmployeeDashboard() {
  const { metrics, records } = useAttendance();
  const { startTracking, setActiveGeofence, geofences, currentLocation } = useGeofence();
  const { addNotification } = useNotification();
  const [refreshing, setRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Set the first geofence as active by default
    if (geofences.length > 0 && !showDetails) {
      setActiveGeofence(geofences[0]);
    }
  }, [geofences, setActiveGeofence, showDetails]);

  const onRefresh = async () => {
    setRefreshing(true);
    await startTracking();
    addNotification({
      type: 'info',
      title: 'Data Refreshed',
      message: 'Location and attendance data has been updated',
    });
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleGeofenceChange = (geofenceId: string) => {
    const selected = geofences.find(g => g.id === geofenceId);
    if (selected) {
      setActiveGeofence(selected);
      addNotification({
        type: 'info',
        title: 'Geofence Changed',
        message: `Now tracking ${selected.name}`,
      });
    }
  };

  const todayRecords = records.filter(r => r.date.toDateString() === new Date().toDateString());
  const todayStatus = todayRecords.length > 0 ? todayRecords[0].status : 'absent';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Dashboard</ThemedText>
          <View style={[styles.statusIndicator, { backgroundColor: getTodayStatusColor(todayStatus) }]}>
            <Text style={styles.statusIndicatorText}>{todayStatus.toUpperCase()}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{metrics.totalPresent}</ThemedText>
            <ThemedText style={styles.statLabel}>Present</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{metrics.totalLate}</ThemedText>
            <ThemedText style={styles.statLabel}>Late</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{metrics.totalAbsent}</ThemedText>
            <ThemedText style={styles.statLabel}>Absent</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{Math.round(metrics.attendanceRate)}%</ThemedText>
            <ThemedText style={styles.statLabel}>Rate</ThemedText>
          </View>
        </View>

        {/* Geofence Selection */}
        <ThemedView style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Select Geofence</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.geofenceScroll}>
            {geofences.map(geofence => (
              <TouchableOpacity
                key={geofence.id}
                style={[styles.geofenceTag]}
                onPress={() => handleGeofenceChange(geofence.id)}
              >
                <Text style={styles.geofenceTagText}>{geofence.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>

        {/* Attendance Card */}
        <AttendanceCard
          onCheckInPress={() => {
            setShowDetails(false);
          }}
          onCheckOutPress={() => {
            setShowDetails(false);
          }}
        />

        {/* GPS Tracker */}
        <ThemedView style={styles.sectionCard}>
          <GPSTracker showDebugInfo={false} />
        </ThemedView>

        {/* Notifications */}
        <ThemedView style={styles.sectionCard}>
          <NotificationCenter maxDisplay={5} />
        </ThemedView>

        {/* Today's Details */}
        {todayRecords.length > 0 && (
          <ThemedView style={styles.sectionCard}>
            <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
              <ThemedText style={styles.sectionTitle}>
                Today's Details {showDetails ? '▼' : '▶'}
              </ThemedText>
            </TouchableOpacity>
            {showDetails && (
              <View style={styles.detailsContainer}>
                {todayRecords.map(record => (
                  <View key={record.id} style={styles.detailRow}>
                    <View style={styles.detailLabel}>
                      <ThemedText>Check-In:</ThemedText>
                      <ThemedText style={styles.detailValue}>
                        {record.checkInTime.toLocaleTimeString()}
                      </ThemedText>
                    </View>
                    <View style={styles.detailLabel}>
                      <ThemedText>Check-Out:</ThemedText>
                      <ThemedText style={styles.detailValue}>
                        {record.checkOutTime?.toLocaleTimeString() || '--:--'}
                      </ThemedText>
                    </View>
                    <View style={styles.detailLabel}>
                      <ThemedText>Hours:</ThemedText>
                      <ThemedText style={styles.detailValue}>
                        {(record.workingHours / 60).toFixed(2)}h
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ThemedView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getTodayStatusColor(status: string): string {
  switch (status) {
    case 'present':
      return '#4CAF50';
    case 'late':
      return '#FF9800';
    case 'absent':
      return '#F44336';
    case 'half-day':
      return '#2196F3';
    default:
      return '#9E9E9E';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusIndicatorText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginTop: 4,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  geofenceScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  geofenceTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
    borderRadius: 16,
    marginRight: 8,
  },
  geofenceTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  detailRow: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    marginVertical: 4,
  },
  detailValue: {
    fontWeight: '600',
    marginTop: 2,
  },
});
