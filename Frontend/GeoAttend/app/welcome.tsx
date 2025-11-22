import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoBackground}>
              <View style={styles.logoIcon}>
                <Ionicons name="location" size={60} color="#1e88e5" />
              </View>
            </View>
            <Text style={styles.appTitle}>GeoAttend</Text>
            <Text style={styles.tagline}>Smart Attendance Tracking</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.mainDescription}>
              Transform your attendance management with precision GPS-based geofencing technology
            </Text>
          </View>

          {/* Key Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Why GeoAttend?</Text>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="map" size={24} color="#1e88e5" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Precise Location Tracking</Text>
                <Text style={styles.featureDesc}>GPS-based geofencing with real-time updates</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="time" size={24} color="#43a047" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Instant Check-In/Out</Text>
                <Text style={styles.featureDesc}>Automatic detection when entering/leaving premises</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="bar-chart" size={24} color="#fb8c00" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Analytics & Reports</Text>
                <Text style={styles.featureDesc}>Comprehensive attendance insights and performance metrics</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="lock-closed" size={24} color="#e53935" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Secure & Reliable</Text>
                <Text style={styles.featureDesc}>Enterprise-grade security with offline support</Text>
              </View>
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>20+</Text>
              <Text style={styles.statLabel}>Features</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>GPS Accuracy</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(auth)/login' as any)}
              activeOpacity={0.85}
            >
              <Ionicons name="log-in" size={20} color="white" style={{ marginRight: 10 }} />
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/(auth)/signup' as any)}
              activeOpacity={0.85}
            >
              <Ionicons name="person-add" size={20} color="#1e88e5" style={{ marginRight: 10 }} />
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logoSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logoBackground: {
    marginBottom: 20,
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    color: '#1e88e5',
    fontWeight: '600',
    marginBottom: 16,
  },
  descriptionSection: {
    marginVertical: 24,
  },
  mainDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  featuresSection: {
    marginVertical: 24,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#999999',
    lineHeight: 18,
  },
  statsSection: {
    flexDirection: 'row',
    marginVertical: 28,
    justifyContent: 'space-around',
    backgroundColor: '#ecf0f5',
    paddingVertical: 24,
    borderRadius: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e88e5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  buttonSection: {
    marginTop: 32,
    marginBottom: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#1e88e5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#1e88e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonText: {
    color: '#1e88e5',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

