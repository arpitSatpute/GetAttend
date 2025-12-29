import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmployeeFence() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map (Geofence)</Text>
      {/* Show employee's allowed geofence and current location here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
