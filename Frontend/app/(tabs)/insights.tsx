import React, { useMemo } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useAttendance } from '../../contexts/AttendanceContext';

export default function InsightsScreen() {
  const { records, metrics } = useAttendance();

  const insights = useMemo(() => {
    // Calculate insights from records
    const lateCount = records.filter(r => r.status === 'late').length;
    const earlyExitCount = records.filter(r => {
      if (!r.checkOutTime || !r.checkInTime) return false;
      const hours = (r.checkOutTime.getTime() - r.checkInTime.getTime()) / (1000 * 60 * 60);
      return hours < 8;
    }).length;

    const lastWeekRecords = records.filter(r => {
      const daysDiff = (new Date().getTime() - r.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    const lastWeekAvgHours = lastWeekRecords.length > 0
      ? lastWeekRecords.reduce((sum, r) => sum + r.workingHours, 0) / lastWeekRecords.length
      : 0;

    const punctualityTrend = lastWeekRecords.length > 0
      ? (lastWeekRecords.filter(r => r.status === 'present').length / lastWeekRecords.length) * 100
      : 0;

    const consistencyScore = calculateConsistencyScore(records);

    return {
      lateCount,
      earlyExitCount,
      lastWeekAvgHours,
      punctualityTrend,
      consistencyScore,
    };
  }, [records]);

  const getTrendIndicator = (value: number) => {
    if (value >= 80) return { icon: '📈', label: 'Excellent', color: '#4CAF50' };
    if (value >= 60) return { icon: '↗', label: 'Good', color: '#8BC34A' };
    if (value >= 40) return { icon: '→', label: 'Average', color: '#FF9800' };
    return { icon: '↘', label: 'Needs Improvement', color: '#F44336' };
  };

  const trend = getTrendIndicator(insights.consistencyScore);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Performance Insights</ThemedText>
          <ThemedText style={styles.subtitle}>Last 30 days analysis</ThemedText>
        </View>

        {/* Overall Score Card */}
        <ThemedView style={styles.scoreCard}>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{Math.round(insights.consistencyScore)}</Text>
              <ThemedText style={styles.scoreLabel}>/ 100</ThemedText>
            </View>
            <View style={styles.scoreInfo}>
              <ThemedText style={styles.scoreTitle}>Overall Performance</ThemedText>
              <View style={styles.trendBadge}>
                <Text style={styles.trendIcon}>{trend.icon}</Text>
                <ThemedText style={[styles.trendLabel, { color: trend.color }]}>
                  {trend.label}
                </ThemedText>
              </View>
            </View>
          </View>
        </ThemedView>

        {/* Key Metrics */}
        <ThemedView style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Key Metrics</ThemedText>

          <View style={styles.metricGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricIcon}>📊</Text>
              <ThemedText style={styles.metricLabel}>Attendance Rate</ThemedText>
              <ThemedText style={styles.metricValue}>{Math.round(metrics.attendanceRate)}%</ThemedText>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricIcon}>⏰</Text>
              <ThemedText style={styles.metricLabel}>Punctuality</ThemedText>
              <ThemedText style={styles.metricValue}>{Math.round(metrics.punctualityRate)}%</ThemedText>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricIcon}>🕐</Text>
              <ThemedText style={styles.metricLabel}>Avg Daily Hours</ThemedText>
              <ThemedText style={styles.metricValue}>{metrics.averageDailyHours.toFixed(1)}h</ThemedText>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricIcon}>⚠</Text>
              <ThemedText style={styles.metricLabel}>Late Arrivals</ThemedText>
              <ThemedText style={styles.metricValue}>{insights.lateCount}</ThemedText>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricIcon}>🚪</Text>
              <ThemedText style={styles.metricLabel}>Early Exits</ThemedText>
              <ThemedText style={styles.metricValue}>{insights.earlyExitCount}</ThemedText>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricIcon}>📅</Text>
              <ThemedText style={styles.metricLabel}>Total Present</ThemedText>
              <ThemedText style={styles.metricValue}>{metrics.totalPresent}</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Trends & Observations */}
        <ThemedView style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Observations</ThemedText>

          <View style={styles.observationList}>
            {metrics.punctualityRate > 90 && (
              <View style={styles.observation}>
                <Text style={styles.observationIcon}>✓</Text>
                <ThemedText style={styles.observationText}>
                  Excellent punctuality! You're consistently on time.
                </ThemedText>
              </View>
            )}

            {insights.lateCount > 3 && (
              <View style={styles.observation}>
                <Text style={styles.observationIcon}>!</Text>
                <ThemedText style={styles.observationText}>
                  You have {insights.lateCount} late arrivals. Try to arrive earlier.
                </ThemedText>
              </View>
            )}

            {insights.earlyExitCount > 2 && (
              <View style={styles.observation}>
                <Text style={styles.observationIcon}>!</Text>
                <ThemedText style={styles.observationText}>
                  You've left early {insights.earlyExitCount} times. Aim to complete full work days.
                </ThemedText>
              </View>
            )}

            {metrics.averageDailyHours > 9 && (
              <View style={styles.observation}>
                <Text style={styles.observationIcon}>💼</Text>
                <ThemedText style={styles.observationText}>
                  You're working {metrics.averageDailyHours.toFixed(1)}h daily. Remember to take breaks!
                </ThemedText>
              </View>
            )}

            {metrics.averageDailyHours < 7 && (
              <View style={styles.observation}>
                <Text style={styles.observationIcon}>⏱</Text>
                <ThemedText style={styles.observationText}>
                  Your daily hours average {metrics.averageDailyHours.toFixed(1)}h. Consider working closer to 8h.
                </ThemedText>
              </View>
            )}

            {metrics.attendanceRate > 95 && (
              <View style={styles.observation}>
                <Text style={styles.observationIcon}>🎖</Text>
                <ThemedText style={styles.observationText}>
                  Outstanding attendance rate of {Math.round(metrics.attendanceRate)}%!
                </ThemedText>
              </View>
            )}
          </View>
        </ThemedView>

        {/* Weekly Breakdown */}
        <ThemedView style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Weekly Average</ThemedText>
          <View style={styles.weeklyRow}>
            <ThemedText style={styles.weeklyLabel}>Last 7 Days</ThemedText>
            <ThemedText style={styles.weeklyValue}>
              {insights.lastWeekAvgHours.toFixed(1)}h/day
            </ThemedText>
          </View>
          <View style={styles.weeklyRow}>
            <ThemedText style={styles.weeklyLabel}>Punctuality Trend</ThemedText>
            <ThemedText style={styles.weeklyValue}>
              {Math.round(insights.punctualityTrend)}% on time
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

function calculateConsistencyScore(records: any[]): number {
  if (records.length === 0) return 0;

  // Calculate based on multiple factors
  const presentCount = records.filter(r => r.status === 'present').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const totalDays = records.length;

  const attendanceScore = (presentCount / totalDays) * 50; // 50% weight
  const latenessScore = ((totalDays - lateCount) / totalDays) * 30; // 30% weight

  const avgHours = records.reduce((sum, r) => sum + r.workingHours, 0) / totalDays / 60;
  const hoursScore = Math.min(avgHours / 8, 1) * 20; // 20% weight

  return attendanceScore + latenessScore + hoursScore;
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
    fontSize: 13,
    opacity: 0.6,
  },
  scoreCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 4,
    borderColor: '#2196F3',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2196F3',
  },
  scoreLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendIcon: {
    fontSize: 18,
  },
  trendLabel: {
    fontSize: 13,
    fontWeight: '600',
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
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricBox: {
    width: '31%',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    opacity: 0.7,
    marginBottom: 2,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2196F3',
  },
  observationList: {
    gap: 10,
  },
  observation: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  observationIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  observationText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  weeklyLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  weeklyValue: {
    fontSize: 13,
    fontWeight: '600',
  },
});
