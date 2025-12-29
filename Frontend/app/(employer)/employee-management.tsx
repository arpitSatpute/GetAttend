import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock employee data (10 employees)
const mockEmployees = [
  {
    id: 'emp1',
    name: 'Alice Johnson',
    dob: '1990-03-12',
    dept: 'Engineering',
    email: 'alice@company.com',
    totalHours: 42,
    status: 'Checked In',
    location: 'Office HQ',
    analytics: {
      punctuality: '98%',
      avgHours: 8.2,
      attendance: '95%',
    },
  },
  {
    id: 'emp2',
    name: 'Bob Smith',
    dob: '1988-07-22',
    dept: 'Sales',
    email: 'bob@company.com',
    totalHours: 38,
    status: 'Checked Out',
    location: 'Remote',
    analytics: {
      punctuality: '92%',
      avgHours: 7.6,
      attendance: '90%',
    },
  },
  {
    id: 'emp3',
    name: 'Carol Lee',
    dob: '1992-11-05',
    dept: 'HR',
    email: 'carol@company.com',
    totalHours: 40,
    status: 'Checked In',
    location: 'Branch Office',
    analytics: {
      punctuality: '96%',
      avgHours: 8.0,
      attendance: '93%',
    },
  },
  {
    id: 'emp4',
    name: 'David Kim',
    dob: '1995-01-18',
    dept: 'Engineering',
    email: 'david@company.com',
    totalHours: 44,
    status: 'Checked In',
    location: 'Office HQ',
    analytics: {
      punctuality: '99%',
      avgHours: 8.5,
      attendance: '97%',
    },
  },
  {
    id: 'emp5',
    name: 'Eva Green',
    dob: '1991-09-30',
    dept: 'Marketing',
    email: 'eva@company.com',
    totalHours: 36,
    status: 'Checked Out',
    location: 'Remote',
    analytics: {
      punctuality: '90%',
      avgHours: 7.2,
      attendance: '88%',
    },
  },
  {
    id: 'emp6',
    name: 'Frank Moore',
    dob: '1987-05-14',
    dept: 'Finance',
    email: 'frank@company.com',
    totalHours: 39,
    status: 'Checked In',
    location: 'Branch Office',
    analytics: {
      punctuality: '94%',
      avgHours: 7.8,
      attendance: '91%',
    },
  },
  {
    id: 'emp7',
    name: 'Grace Hall',
    dob: '1993-12-25',
    dept: 'Engineering',
    email: 'grace@company.com',
    totalHours: 41,
    status: 'Checked In',
    location: 'Office HQ',
    analytics: {
      punctuality: '97%',
      avgHours: 8.1,
      attendance: '94%',
    },
  },
  {
    id: 'emp8',
    name: 'Henry Adams',
    dob: '1989-04-08',
    dept: 'Sales',
    email: 'henry@company.com',
    totalHours: 37,
    status: 'Checked Out',
    location: 'Remote',
    analytics: {
      punctuality: '91%',
      avgHours: 7.4,
      attendance: '89%',
    },
  },
  {
    id: 'emp9',
    name: 'Ivy Brown',
    dob: '1994-06-17',
    dept: 'HR',
    email: 'ivy@company.com',
    totalHours: 43,
    status: 'Checked In',
    location: 'Office HQ',
    analytics: {
      punctuality: '98%',
      avgHours: 8.3,
      attendance: '96%',
    },
  },
  {
    id: 'emp10',
    name: 'Jack White',
    dob: '1996-02-27',
    dept: 'Finance',
    email: 'jack@company.com',
    totalHours: 35,
    status: 'Checked Out',
    location: 'Branch Office',
    analytics: {
      punctuality: '89%',
      avgHours: 7.0,
      attendance: '87%',
    },
  },
];

export default function EmployeeManagementScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  if (selected) {
    const emp = mockEmployees.find(e => e.id === selected);
    if (!emp) return null;
    // INS fallback logic
    const [insLocation, setInsLocation] = useState<GeolocationCoordinates | null>(null);
    const [checking, setChecking] = useState(false);
    const [checkStatus, setCheckStatus] = useState(emp.status);
    const [lastLocation, setLastLocation] = useState<GeolocationCoordinates | null>(null);
    const { useInertialNavigation } = require('../../utils/inertialNavigation');
    const [gpsError, setGpsError] = useState(false);

    const handleCheck = async () => {
      setChecking(true);
      setGpsError(false);
      let location = null;
      try {
        // Try GPS first
        const loc = await new Promise<GeolocationCoordinates>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            pos => resolve(pos.coords),
            err => reject(err),
            { enableHighAccuracy: true, timeout: 3000 }
          );
        });
        location = loc;
        setLastLocation(loc);
      } catch (e) {
        setGpsError(true);
        // Use INS fallback
        const ins = useInertialNavigation(lastLocation || {
          latitude: 21.355897,
          longitude: 78.980604,
          accuracy: 20,
          timestamp: Date.now(),
        });
        setInsLocation(ins);
        location = ins;
      }
      setCheckStatus(s => (s === 'Checked In' ? 'Checked Out' : 'Checked In'));
      setChecking(false);
      // Here you would update backend with location and check-in/out status
    };

    return (
      <View style={styles.detailContainer}>
        <TouchableOpacity onPress={() => setSelected(null)} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#4285F4" />
        </TouchableOpacity>
        <Text style={styles.name}>{emp.name}</Text>
        <Text style={styles.email}>{emp.email}</Text>
        <Text style={styles.label}>Current Status: <Text style={styles.value}>{checkStatus}</Text></Text>
        <Text style={styles.label}>Location: <Text style={styles.value}>{gpsError && insLocation ? `INS: ${insLocation.latitude.toFixed(5)}, ${insLocation.longitude.toFixed(5)}` : emp.location}</Text></Text>
        <Text style={styles.label}>Total Login Hours: <Text style={styles.value}>{emp.totalHours} hrs</Text></Text>
        <TouchableOpacity onPress={handleCheck} style={[styles.card, { backgroundColor: '#4285F4', marginTop: 16 }]}
          disabled={checking}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{checkStatus === 'Checked In' ? 'Check Out' : 'Check In'}</Text>
        </TouchableOpacity>
        {gpsError && <Text style={{ color: 'red', marginTop: 8 }}>GPS not available, using INS fallback.</Text>}
        <Text style={styles.section}>Analytics</Text>
        <Text style={styles.label}>Punctuality: <Text style={styles.value}>{emp.analytics.punctuality}</Text></Text>
        <Text style={styles.label}>Avg. Daily Hours: <Text style={styles.value}>{emp.analytics.avgHours}</Text></Text>
        <Text style={styles.label}>Attendance: <Text style={styles.value}>{emp.analytics.attendance}</Text></Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employees</Text>
      <FlatList
        data={mockEmployees}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelected(item.id)}>
            <Ionicons name="person-circle" size={40} color="#4285F4" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.status}>{item.status} • {item.location}</Text>
              <Text style={styles.detail}>Dept: {item.dept}</Text>
              <Text style={styles.detail}>DOB: {item.dob}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f6fc', borderRadius: 12, padding: 16, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#666' },
  status: { fontSize: 14, color: '#4285F4', marginTop: 4 },
  detail: { fontSize: 13, color: '#888', marginTop: 2 },
  detailContainer: { flex: 1, padding: 24, backgroundColor: '#fff' },
  backBtn: { marginBottom: 16 },
  label: { fontSize: 16, marginTop: 10 },
  value: { fontWeight: 'bold', color: '#4285F4' },
  section: { fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 8 },
});
