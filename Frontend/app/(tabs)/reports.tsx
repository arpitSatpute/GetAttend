import React, { useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useAttendance } from '../../contexts/AttendanceContext';

interface ReportPeriod {
  label: string;
  key: 'week' | 'month' | 'quarter' | 'year';
}

const REPORT_PERIODS: ReportPeriod[] = [
  { label: 'Last 7 Days', key: 'week' },
  { label: 'Last 30 Days', key: 'month' },
  { label: 'Last 90 Days', key: 'quarter' },
  { label: 'This Year', key: 'year' },
];

export default function ReportsScreen() {
  const { records, metrics } = useAttendance();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const reportData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const periodRecords = records.filter(r => r.date >= startDate);

    const stats = {
      totalDays: periodRecords.length,
      presentDays: periodRecords.filter(r => r.status === 'present').length,
      lateDays: periodRecords.filter(r => r.status === 'late').length,
      absentDays: periodRecords.filter(r => r.status === 'absent').length,
      totalHours: periodRecords.reduce((sum, r) => sum + r.workingHours, 0),
      averageHours: periodRecords.length > 0 ? periodRecords.reduce((sum, r) => sum + r.workingHours, 0) / periodRecords.length : 0,
      attendancePercentage: periodRecords.length > 0 ? (periodRecords.filter(r => r.status === 'present' || r.status === 'late').length / periodRecords.length) * 100 : 0,
      earlyExits: periodRecords.filter(r => {
        if (!r.checkOutTime || !r.checkInTime) return false;
        const hours = (r.checkOutTime.getTime() - r.checkInTime.getTime()) / (1000 * 60 * 60);
        return hours < 8;
      }).length,
    };

    return stats;
  }, [records, selectedPeriod]);

  const generateTextReport = () => {
    const now = new Date();
    const report = `
GeoAttend - Attendance Report
Generated: ${now.toLocaleString()}
Period: ${REPORT_PERIODS.find(p => p.key === selectedPeriod)?.label}

=== SUMMARY ===
Total Working Days: ${reportData.totalDays}
Present Days: ${reportData.presentDays}
Late Arrivals: ${reportData.lateDays}
Absent Days: ${reportData.absentDays}

=== HOURS ===
Total Hours: ${(reportData.totalHours / 60).toFixed(2)}h
Average Daily: ${(reportData.averageHours / 60).toFixed(2)}h
Early Exits: ${reportData.earlyExits}

=== PERCENTAGES ===
Attendance Rate: ${reportData.attendancePercentage.toFixed(1)}%
Punctuality Rate: ${reportData.presentDays > 0 ? ((reportData.presentDays / (reportData.presentDays + reportData.lateDays)) * 100).toFixed(1) : 0}%

=== OVERALL METRICS ===
Total Present (30 days): ${metrics.totalPresent}
Total Late (30 days): ${metrics.totalLate}
Total Absent (30 days): ${metrics.totalAbsent}
Overall Attendance Rate: ${metrics.attendanceRate.toFixed(1)}%
Overall Punctuality Rate: ${metrics.punctualityRate.toFixed(1)}%
    `;
    return report;
  };

  const handleShareReport = async () => {
    try {
      await Share.share({
        message: generateTextReport(),
        title: 'GeoAttend - Attendance Report',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share report');
    }
  };

  const handleDownloadReport = () => {
    Alert.alert(
      'Download Report',
      'Report content:\n\n' + generateTextReport().substring(0, 300) + '...\n\nFull report would be downloaded as PDF or Excel in production.'
    );
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 75) return '#8BC34A';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Reports & Analytics</ThemedText>
          <ThemedText style={styles.subtitle}>Detailed attendance analysis</ThemedText>
        </View>

        {/* Period Selector */}
        <ThemedView style={styles.periodSelector}>
          <ThemedText style={styles.periodTitle}>Select Period</ThemedText>
          <View style={styles.periodButtons}>
            {REPORT_PERIODS.map(period => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <ThemedText
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period.key && styles.periodButtonTextActive,
                  ]}
                >
                  {period.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        {/* Summary Stats */}
        <ThemedView style={styles.summaryCard}>
          <ThemedText style={styles.cardTitle}>Period Summary</ThemedText>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <ThemedText style={styles.statLabel}>Total Days</ThemedText>
              <ThemedText style={styles.statNumber}>{reportData.totalDays}</ThemedText>
            </View>
            <View style={styles.statBox}>
              <ThemedText style={styles.statLabel}>Present</ThemedText>
              <ThemedText style={[styles.statNumber, { color: '#4CAF50' }]}>
                {reportData.presentDays}
              </ThemedText>
            </View>
            <View style={styles.statBox}>
              <ThemedText style={styles.statLabel}>Late</ThemedText>
              <ThemedText style={[styles.statNumber, { color: '#FF9800' }]}>
                {reportData.lateDays}
              </ThemedText>
            </View>
            <View style={styles.statBox}>
              <ThemedText style={styles.statLabel}>Absent</ThemedText>
              <ThemedText style={[styles.statNumber, { color: '#F44336' }]}>
                {reportData.absentDays}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Hours Report */}
        <ThemedView style={styles.reportCard}>
          <ThemedText style={styles.cardTitle}>Working Hours</ThemedText>

          <View style={styles.reportRow}>
            <ThemedText style={styles.reportLabel}>Total Hours</ThemedText>
            <ThemedText style={styles.reportValue}>
              {(reportData.totalHours / 60).toFixed(2)}h
            </ThemedText>
          </View>

          <View style={styles.reportRow}>
            <ThemedText style={styles.reportLabel}>Average Daily</ThemedText>
            <ThemedText style={styles.reportValue}>
              {(reportData.averageHours / 60).toFixed(2)}h
            </ThemedText>
          </View>

          <View style={styles.reportRow}>
            <ThemedText style={styles.reportLabel}>Early Exits</ThemedText>
            <ThemedText style={styles.reportValue}>{reportData.earlyExits}</ThemedText>
          </View>
        </ThemedView>

        {/* Attendance Report */}
        <ThemedView style={styles.reportCard}>
          <ThemedText style={styles.cardTitle}>Attendance Metrics</ThemedText>

          <View style={styles.metricRow}>
            <View style={styles.metricInfo}>
              <ThemedText style={styles.metricLabel}>Attendance Rate</ThemedText>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${reportData.attendancePercentage}%`,
                      backgroundColor: getPercentageColor(reportData.attendancePercentage),
                    },
                  ]}
                />
              </View>
            </View>
            <ThemedText
              style={[
                styles.metricValue,
                { color: getPercentageColor(reportData.attendancePercentage) },
              ]}
            >
              {reportData.attendancePercentage.toFixed(1)}%
            </ThemedText>
          </View>

          <View style={styles.metricRow}>
            <View style={styles.metricInfo}>
              <ThemedText style={styles.metricLabel}>Punctuality Rate</ThemedText>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${reportData.presentDays > 0 ? ((reportData.presentDays / (reportData.presentDays + reportData.lateDays)) * 100) : 0}%`,
                      backgroundColor: '#2196F3',
                    },
                  ]}
                />
              </View>
            </View>
            <ThemedText style={[styles.metricValue, { color: '#2196F3' }]}>
              {reportData.presentDays > 0 ? ((reportData.presentDays / (reportData.presentDays + reportData.lateDays)) * 100).toFixed(1) : 0}%
            </ThemedText>
          </View>
        </ThemedView>

        {/* Overall Metrics */}
        <ThemedView style={styles.reportCard}>
          <ThemedText style={styles.cardTitle}>Overall Metrics (30 Days)</ThemedText>

          <View style={styles.reportRow}>
            <ThemedText style={styles.reportLabel}>Total Present</ThemedText>
            <ThemedText style={styles.reportValue}>{metrics.totalPresent}</ThemedText>
          </View>

          <View style={styles.reportRow}>
            <ThemedText style={styles.reportLabel}>Total Late</ThemedText>
            <ThemedText style={styles.reportValue}>{metrics.totalLate}</ThemedText>
          </View>

          <View style={styles.reportRow}>
            <ThemedText style={styles.reportLabel}>Total Absent</ThemedText>
            <ThemedText style={styles.reportValue}>{metrics.totalAbsent}</ThemedText>
          </View>

          <View style={styles.reportRow}>
            <ThemedText style={styles.reportLabel}>Attendance Rate</ThemedText>
            <ThemedText style={styles.reportValue}>{metrics.attendanceRate.toFixed(1)}%</ThemedText>
          </View>

          <View style={styles.reportRow}>
            <ThemedText style={styles.reportLabel}>Punctuality Rate</ThemedText>
            <ThemedText style={styles.reportValue}>{metrics.punctualityRate.toFixed(1)}%</ThemedText>
          </View>
        </ThemedView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button} onPress={handleShareReport}>
            <Text style={styles.buttonIcon}>📤</Text>
            <ThemedText style={styles.buttonText}>Share Report</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleDownloadReport}>
            <Text style={styles.buttonIcon}>📥</Text>
            <ThemedText style={styles.buttonText}>Download PDF</ThemedText>
          </TouchableOpacity>
        </View>
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
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  periodSelector: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  periodTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: 'white',
  },
  periodButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statBox: {
    width: '48%',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
  },
  reportCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reportLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  reportValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  metricInfo: {
    flex: 1,
    marginRight: 12,
  },
  metricLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginVertical: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});
