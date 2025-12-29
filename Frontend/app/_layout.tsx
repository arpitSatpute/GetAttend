import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AttendanceProvider } from '@/contexts/AttendanceContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { GeofenceProvider } from '@/contexts/GeofenceContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

function RoleBasedTabs() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'employer') {
    return <Stack.Screen name="(employer)" options={{ headerShown: false }} />;
  }
  if (user.role === 'employee') {
    return <Stack.Screen name="(employee)" options={{ headerShown: false }} />;
  }
  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <GeofenceProvider>
        <AttendanceProvider>
          <NotificationProvider>
            <ThemeProvider value={DefaultTheme}>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="welcome" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                {/* Role-based tab layout */}
                <RoleBasedTabs />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <StatusBar style="dark" />
            </ThemeProvider>
          </NotificationProvider>
        </AttendanceProvider>
      </GeofenceProvider>
    </AuthProvider>
  );
}
