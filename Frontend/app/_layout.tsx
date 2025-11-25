import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AttendanceProvider } from '@/contexts/AttendanceContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { GeofenceProvider } from '@/contexts/GeofenceContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

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
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
