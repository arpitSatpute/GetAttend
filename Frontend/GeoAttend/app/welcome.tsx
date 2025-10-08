import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

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
      {/* Background Elements */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      <View style={styles.backgroundCircle3} />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name="location" size={50} color="white" />
            </View>
          </View>
          <Text style={styles.title}>GeoAttend</Text>
          <Text style={styles.subtitle}>
            Smart Attendance, Anywhere
          </Text>
          <Text style={styles.description}>
            Transform your attendance tracking with precision geolocation technology
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Ionicons name="location-outline" size={32} color="#4285F4" />
            <Text style={styles.featureText}>Location-based tracking</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="shield-checkmark-outline" size={32} color="#4285F4" />
            <Text style={styles.featureText}>Secure & reliable</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="time-outline" size={32} color="#4285F4" />
            <Text style={styles.featureText}>Real-time updates</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="log-in-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push('/(auth)/signup' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add-outline" size={20} color="#4285F4" style={styles.buttonIcon} />
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backgroundCircle1: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: '#4285F4',
    opacity: 0.03,
    top: -width * 0.4,
    right: -width * 0.4,
  },
  backgroundCircle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: '#34A853',
    opacity: 0.04,
    bottom: -width * 0.2,
    left: -width * 0.3,
  },
  backgroundCircle3: {
    position: 'absolute',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: '#EA4335',
    opacity: 0.03,
    top: height * 0.3,
    left: -width * 0.1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  logoContainer: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    color: '#4285F4',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    marginVertical: 40,
  },
  feature: {
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 20,
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  signupButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#4285F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  signupButtonText: {
    color: '#4285F4',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonIcon: {
    marginRight: 10,
  },
});