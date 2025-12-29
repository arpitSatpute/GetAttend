import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';


// Mock analytics for demonstration
const mockAnalytics = {
  punctuality: '97%',
  avgHours: 8.0,
  attendance: '94%',
};

export default function EmployeeReportsScreen() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Attendance Report</Text>
      <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.label}>Role: <Text style={styles.value}>{user.role}</Text></Text>
      {/* Add more personal stats here if available */}
      <Text style={styles.section}>Analytics</Text>
      <Text style={styles.label}>Punctuality: <Text style={styles.value}>{mockAnalytics.punctuality}</Text></Text>
      <Text style={styles.label}>Avg. Daily Hours: <Text style={styles.value}>{mockAnalytics.avgHours}</Text></Text>
      <Text style={styles.label}>Attendance: <Text style={styles.value}>{mockAnalytics.attendance}</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 14, color: '#666', marginBottom: 8 },
  label: { fontSize: 16, marginTop: 10 },
  value: { fontWeight: 'bold', color: '#4285F4' },
  section: { fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 8 },
});
