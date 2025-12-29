import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmployeeAttendance() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance</Text>
      {/* Add employee-specific attendance view here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
