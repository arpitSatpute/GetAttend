
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAttendance } from '../contexts/AttendanceContext';
import { useGeofence } from '../contexts/GeofenceContext';
import { useNotification } from '../contexts/NotificationContext';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface AttendanceCardProps {
  onCheckInPress?: () => void;
  onCheckOutPress?: () => void;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ onCheckInPress, onCheckOutPress }) => {
  const { checkIn, checkOut, currentSession, metrics } = useAttendance();
  const { currentLocation, activeGeofence, isInsideGeofence } = useGeofence();
  const { addNotification } = useNotification();

  const handleCheckIn = () => {
    if (!currentLocation || !activeGeofence) {
      addNotification({
        type: 'alert',
        title: 'Check In Failed',
        message: 'Location or geofence not available. Please ensure GPS is enabled and a geofence is active.',
      });
      return;
    }

    checkIn(activeGeofence.id, {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      accuracy: currentLocation.accuracy,
    });

    addNotification({
      type: 'check-in',
      title: 'Checked In',
      message: `Successfully checked in at ${activeGeofence.name} at ${new Date().toLocaleTimeString()}`,
    });

    onCheckInPress?.();
  };

  const handleCheckOut = () => {
    if (!currentLocation) {
      addNotification({
        type: 'alert',
        title: 'Check Out Failed',
        message: 'Location data not available. Please ensure GPS is enabled.',
      });
      return;
    }

    checkOut({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      accuracy: currentLocation.accuracy,
    });

    addNotification({
      type: 'check-out',
      title: 'Checked Out',
      message: `Successfully checked out at ${new Date().toLocaleTimeString()}`,
    });

    onCheckOutPress?.();
  };

  const isCheckedIn = currentSession && currentSession.checkInTime !== null;

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = () => {
    if (!isCheckedIn) return '#9E9E9E';
    if (isInsideGeofence) return '#4CAF50';
    return '#FF9800';
  };

  const getStatusText = () => {
    if (!isCheckedIn) return 'Not Checked In';
    if (isInsideGeofence) return 'Checked In (On Premises)';
    return 'Checked In (Off Premises)';
  };

  return (
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Attendance Check-In/Out</ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <ThemedText style={styles.statusText}>{getStatusText()}</ThemedText>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeBox}>
          <ThemedText style={styles.timeLabel}>Check-In Time</ThemedText>
          <ThemedText style={styles.timeValue}>{formatTime(currentSession?.checkInTime || null)}</ThemedText>
        </View>

        <View style={styles.timeBox}>
          <ThemedText style={styles.timeLabel}>Check-Out Time</ThemedText>
          <ThemedText style={styles.timeValue}>{formatTime(currentSession?.checkOutTime || null)}</ThemedText>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricBox}>
          <ThemedText style={styles.metricLabel}>Avg Daily Hours</ThemedText>
          <ThemedText style={styles.metricValue}>{metrics.averageDailyHours.toFixed(1)}h</ThemedText>
        </View>

        <View style={styles.metricBox}>
          <ThemedText style={styles.metricLabel}>Punctuality</ThemedText>
          <ThemedText style={styles.metricValue}>{Math.round(metrics.punctualityRate)}%</ThemedText>
        </View>

        <View style={styles.metricBox}>
          <ThemedText style={styles.metricLabel}>Attendance</ThemedText>
          <ThemedText style={styles.metricValue}>{Math.round(metrics.attendanceRate)}%</ThemedText>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.checkInButton, isCheckedIn && styles.buttonDisabled]}
          onPress={handleCheckIn}
          disabled={!!isCheckedIn}
        >
          <ThemedText style={[styles.buttonText, isCheckedIn && styles.buttonTextDisabled]}>
            Check In
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.checkOutButton, !isCheckedIn && styles.buttonDisabled]}
          onPress={handleCheckOut}
          disabled={!isCheckedIn}
        >
          <ThemedText style={[styles.buttonText, !isCheckedIn && styles.buttonTextDisabled]}>
            Check Out
          </ThemedText>
        </TouchableOpacity>
      </View>

      {activeGeofence && (
        <View style={styles.geofenceInfo}>
          <ThemedText style={styles.geofenceLabel}>Active Geofence:</ThemedText>
          <ThemedText style={styles.geofenceName}>{activeGeofence.name}</ThemedText>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  timeBox: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metricBox: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    opacity: 0.7,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInButton: {
    backgroundColor: '#4CAF50',
  },
  checkOutButton: {
    backgroundColor: '#2196F3',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  buttonTextDisabled: {
    color: '#999',
  },
  geofenceInfo: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  geofenceLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginBottom: 4,
  },
  geofenceName: {
    fontSize: 13,
    fontWeight: '600',
  },
});
