import { Image } from 'expo-image';
import { Platform, ScrollView, StyleSheet, TouchableOpacity , Text} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    
    <SafeAreaView>
      <ScrollView>
      <ThemedView style={styles.heroContainer}>
        <ThemedView style={styles.headerContainer}>
          <Ionicons name="location" size={80} color="white" />
          <ThemedText style={styles.headerTitle}>GeoAttend</ThemedText>
        </ThemedView>
      
      </ThemedView>
      
      {/* Hero Section */}
      <ThemedView style={styles.heroContainer}>
        <ThemedText type="title" style={styles.heroTitle}>
          <Text>
            Smart Attendance, Anywhere
          </Text>
        </ThemedText>
        <ThemedText style={styles.heroSubtitle}>
          <Text>
            Track attendance with precision using geolocation technology. Simple, secure, and reliable.
          </Text>
        </ThemedText>
      </ThemedView>

      {/* Features Section */}
      <ThemedView style={styles.featuresContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Key Features</ThemedText>
        
        <ThemedView style={styles.featureItem}>
          <Ionicons name="location-outline" size={24} color="#4285F4" />
          <ThemedView style={styles.featureText}>
            <ThemedText type="defaultSemiBold">Location-Based Tracking</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Automatic attendance marking when you arrive at designated locations
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.featureItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#4285F4" />
          <ThemedView style={styles.featureText}>
            <ThemedText type="defaultSemiBold">Secure & Private</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Your location data is encrypted and stored securely
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.featureItem}>
          <Ionicons name="analytics-outline" size={24} color="#4285F4" />
          <ThemedView style={styles.featureText}>
            <ThemedText type="defaultSemiBold">Real-time Reports</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Get instant attendance reports and analytics
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.featureItem}>
          <Ionicons name="people-outline" size={24} color="#4285F4" />
          <ThemedView style={styles.featureText}>
            <ThemedText type="defaultSemiBold">Team Management</ThemedText>
            <ThemedText style={styles.featureDescription}>
              Manage multiple teams and locations from one dashboard
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* CTA Section */}
      <ThemedView style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaButton}>
          <ThemedText style={styles.ctaButtonText}>Get Started</ThemedText>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <ThemedText style={styles.secondaryButtonText}>Learn More</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* How it Works Section */}
      <ThemedView style={styles.howItWorksContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>How It Works</ThemedText>
        
        <ThemedView style={styles.stepItem}>
          <ThemedView style={styles.stepNumber}>
            <ThemedText style={styles.stepNumberText}>1</ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContent}>
            <ThemedText type="defaultSemiBold">Set Up Locations</ThemedText>
            <ThemedText style={styles.stepDescription}>
              Define your workplace or event locations with precise coordinates
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.stepItem}>
          <ThemedView style={styles.stepNumber}>
            <ThemedText style={styles.stepNumberText}>2</ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContent}>
            <ThemedText type="defaultSemiBold">Invite Your Team</ThemedText>
            <ThemedText style={styles.stepDescription}>
              Add team members and assign them to specific locations
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.stepItem}>
          <ThemedView style={styles.stepNumber}>
            <ThemedText style={styles.stepNumberText}>3</ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContent}>
            <ThemedText type="defaultSemiBold">Automatic Tracking</ThemedText>
            <ThemedText style={styles.stepDescription}>
              Attendance is automatically recorded when team members arrive
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    paddingTop: 10,
  },
  heroContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  heroTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 28,
  },
  heroSubtitle: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  featureText: {
    flex: 1,
    marginLeft: 16,
  },
  featureDescription: {
    marginTop: 4,
    opacity: 0.7,
    lineHeight: 20,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#4285F4',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: '600',
  },
  howItWorksContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  stepNumber: {
    backgroundColor: '#4285F4',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
    marginLeft: 16,
  },
  stepDescription: {
    marginTop: 4,
    opacity: 0.7,
  },
});