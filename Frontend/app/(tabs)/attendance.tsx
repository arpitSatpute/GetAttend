import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useAttendance } from '../../contexts/AttendanceContext';

interface FilterState {
  status: 'all' | 'present' | 'late' | 'absent';
  dateRange: 'week' | 'month' | 'all';
}

export default function AttendanceHistory() {
  const { records, metrics } = useAttendance();
  const [filter, setFilter] = useState<FilterState>({ status: 'all', dateRange: 'month' });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    let filtered = [...records];

    // Status filter
    if (filter.status !== 'all') {
      filtered = filtered.filter(r => r.status === filter.status);
    }

    // Date range filter
    const now = new Date();
    let startDate = new Date();

    switch (filter.dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'all':
        startDate = new Date(0);
        break;
    }

    filtered = filtered.filter(r => r.date >= startDate);
    return filtered;
  }, [records, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#4CAF50';
      case 'late':
        return '#FF9800';
      case 'absent':
        return '#F44336';
      case 'half-day':
        return '#2196F3';
      case 'on-leave':
        return '#9C27B0';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return '✓';
      case 'late':
        return '⏱';
      case 'absent':
        return '✕';
      case 'half-day':
        return '◐';
      case 'on-leave':
        return '✈';
      default:
        return '?';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const groupedRecords = useMemo(() => {
    const groups: Record<string, typeof filteredRecords> = {};
    filteredRecords.forEach(record => {
      const monthKey = record.date.toLocaleString('default', { year: 'numeric', month: 'long' });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(record);
    });
    return groups;
  }, [filteredRecords]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Attendance History</ThemedText>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.stat}>
            <ThemedText style={styles.statValue}>{filteredRecords.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Days</ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={styles.statValue}>
              {filteredRecords.reduce((sum, r) => sum + r.workingHours, 0).toFixed(0)}h
            </ThemedText>
            <ThemedText style={styles.statLabel}>Total Hours</ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={styles.statValue}>
              {(metrics.averageDailyHours).toFixed(1)}h
            </ThemedText>
            <ThemedText style={styles.statLabel}>Avg Daily</ThemedText>
          </View>
        </View>

        {/* Filters */}
        <ThemedView style={styles.filterSection}>
          <ThemedText style={styles.filterTitle}>Filter by Status</ThemedText>
          <View style={styles.filterButtons}>
            {(['all', 'present', 'late', 'absent'] as const).map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filter.status === status && styles.filterButtonActive,
                ]}
                onPress={() => setFilter({ ...filter, status })}
              >
                <ThemedText
                  style={[
                    styles.filterButtonText,
                    filter.status === status && styles.filterButtonTextActive,
                  ]}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <ThemedText style={styles.filterTitle}>Filter by Date Range</ThemedText>
          <View style={styles.filterButtons}>
            {(['week', 'month', 'all'] as const).map(range => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.filterButton,
                  filter.dateRange === range && styles.filterButtonActive,
                ]}
                onPress={() => setFilter({ ...filter, dateRange: range })}
              >
                <ThemedText
                  style={[
                    styles.filterButtonText,
                    filter.dateRange === range && styles.filterButtonTextActive,
                  ]}
                >
                  {range === 'week' ? 'Last Week' : range === 'month' ? 'Last Month' : 'All Time'}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        {/* Records */}
        {Object.entries(groupedRecords).length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No attendance records found</ThemedText>
          </View>
        ) : (
          Object.entries(groupedRecords).map(([monthKey, monthRecords]) => (
            <View key={monthKey} style={styles.monthGroup}>
              <ThemedText style={styles.monthTitle}>{monthKey}</ThemedText>
              {monthRecords.map(record => (
                <TouchableOpacity
                  key={record.id}
                  style={styles.recordCard}
                  onPress={() => setExpandedId(expandedId === record.id ? null : record.id)}
                >
                  <View style={styles.recordHeader}>
                    <View style={styles.recordInfo}>
                      <View style={[styles.statusIcon, { backgroundColor: getStatusColor(record.status) }]}>
                        <Text style={styles.statusIconText}>{getStatusIcon(record.status)}</Text>
                      </View>
                      <View style={styles.recordTexts}>
                        <ThemedText style={styles.recordDate}>
                          {record.date.toLocaleDateString('default', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </ThemedText>
                        <ThemedText style={styles.recordStatus}>
                          {record.status.toUpperCase()}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.recordTime}>
                      <ThemedText style={styles.recordTimeText}>
                        {formatDuration(record.workingHours)}
                      </ThemedText>
                      <Text style={styles.expandIcon}>{expandedId === record.id ? '▼' : '▶'}</Text>
                    </View>
                  </View>

                  {expandedId === record.id && (
                    <View style={styles.recordDetails}>
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Check-In Time</ThemedText>
                        <ThemedText style={styles.detailValue}>
                          {record.checkInTime.toLocaleTimeString()}
                        </ThemedText>
                      </View>

                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Check-Out Time</ThemedText>
                        <ThemedText style={styles.detailValue}>
                          {record.checkOutTime?.toLocaleTimeString() || 'Not checked out'}
                        </ThemedText>
                      </View>

                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Check-In Location</ThemedText>
                        <ThemedText style={styles.detailValue}>
                          {record.checkInLocation.latitude.toFixed(6)}, {record.checkInLocation.longitude.toFixed(6)}
                        </ThemedText>
                      </View>

                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Check-In Accuracy</ThemedText>
                        <ThemedText style={styles.detailValue}>
                          ±{Math.round(record.checkInLocation.accuracy || 0)}m
                        </ThemedText>
                      </View>

                      {record.notes && (
                        <View style={styles.detailRow}>
                          <ThemedText style={styles.detailLabel}>Notes</ThemedText>
                          <ThemedText style={styles.detailValue}>{record.notes}</ThemedText>
                        </View>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  stat: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginTop: 4,
  },
  filterSection: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  filterTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: 'white',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  monthGroup: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    opacity: 0.7,
  },
  recordCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  recordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusIconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordTexts: {
    flex: 1,
  },
  recordDate: {
    fontSize: 13,
    fontWeight: '600',
  },
  recordStatus: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 2,
  },
  recordTime: {
    alignItems: 'flex-end',
  },
  recordTimeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 12,
    marginTop: 4,
  },
  recordDetails: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9F9F9',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '60%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.5,
  },
});
