import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useGeofence } from '../../contexts/GeofenceContext';

interface NewGeofence {
  name: string;
  latitude: string;
  longitude: string;
  radius: string;
  type: 'office' | 'branch' | 'field';
}

export default function GeofenceManagementScreen() {
  const { geofences, activeGeofence, setActiveGeofence, addGeofence, removeGeofence, updateGeofence, currentLocation } = useGeofence();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newGeofence, setNewGeofence] = useState<NewGeofence>({
    name: '',
    latitude: currentLocation?.latitude.toString() || '21.355897',
    longitude: currentLocation?.longitude.toString() || '78.980604',
    radius: '500',
    type: 'office',
  });

  const handleAddGeofence = () => {
    if (!newGeofence.name || !newGeofence.latitude || !newGeofence.longitude || !newGeofence.radius) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const geofenceData = {
      id: editingId || `geo-${Date.now()}`,
      name: newGeofence.name,
      latitude: parseFloat(newGeofence.latitude),
      longitude: parseFloat(newGeofence.longitude),
      radius: parseInt(newGeofence.radius),
      type: newGeofence.type,
      createdAt: new Date(),
      address: `${newGeofence.latitude}, ${newGeofence.longitude}`,
    };

    if (editingId) {
      updateGeofence(editingId, geofenceData);
      Alert.alert('Success', 'Geofence updated successfully');
    } else {
      addGeofence(geofenceData);
      Alert.alert('Success', 'Geofence created successfully');
    }

    setShowModal(false);
    setEditingId(null);
    setNewGeofence({
      name: '',
      latitude: currentLocation?.latitude.toString() || '21.355897',
      longitude: currentLocation?.longitude.toString() || '78.980604',
      radius: '500',
      type: 'office',
    });
  };

  const handleEditGeofence = (id: string) => {
    const geofence = geofences.find((g: any) => g.id === id);
    if (geofence) {
      setNewGeofence({
        name: geofence.name,
        latitude: geofence.latitude.toString(),
        longitude: geofence.longitude.toString(),
        radius: geofence.radius.toString(),
        type: geofence.type,
      });
      setEditingId(id);
      setShowModal(true);
    }
  };

  const handleDeleteGeofence = (id: string) => {
    Alert.alert('Delete Geofence', 'Are you sure you want to delete this geofence?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeGeofence(id);
          Alert.alert('Success', 'Geofence deleted successfully');
        },
      },
    ]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'office':
        return '#2196F3';
      case 'branch':
        return '#4CAF50';
      case 'field':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.title}>Geofence Management</ThemedText>
            <ThemedText style={styles.subtitle}>{geofences.length} active geofences</ThemedText>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingId(null);
              setNewGeofence({
                name: '',
                latitude: currentLocation?.latitude.toString() || '21.355897',
                longitude: currentLocation?.longitude.toString() || '78.980604',
                radius: '500',
                type: 'office',
              });
              setShowModal(true);
            }}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Geofence List */}
        {geofences.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No geofences created yet</ThemedText>
          </View>
        ) : (
          geofences.map((geofence: any) => (
            <TouchableOpacity
              key={geofence.id}
              style={[
                styles.geofenceCard,
                activeGeofence?.id === geofence.id && styles.geofenceCardActive,
              ]}
              onPress={() => setActiveGeofence(geofence)}
            >
              <View style={styles.geofenceHeader}>
                <View style={styles.geofenceInfo}>
                  <View style={[styles.typeBadge, { backgroundColor: getTypeColor(geofence.type) }]}>
                    <Text style={styles.typeBadgeText}>{geofence.type.substring(0, 1).toUpperCase()}</Text>
                  </View>
                  <View style={styles.geofenceTexts}>
                    <ThemedText style={styles.geofenceName}>{geofence.name}</ThemedText>
                    <ThemedText style={styles.geofenceType}>{geofence.type.toUpperCase()}</ThemedText>
                  </View>
                </View>
                {activeGeofence?.id === geofence.id && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>ACTIVE</Text>
                  </View>
                )}
              </View>

              <View style={styles.geofenceDetails}>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Coordinates</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {geofence.latitude.toFixed(4)}, {geofence.longitude.toFixed(4)}
                  </ThemedText>
                </View>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Radius</ThemedText>
                  <ThemedText style={styles.detailValue}>{geofence.radius}m</ThemedText>
                </View>
                {geofence.address && (
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Address</ThemedText>
                    <ThemedText style={styles.detailValue} numberOfLines={1}>
                      {geofence.address}
                    </ThemedText>
                  </View>
                )}
              </View>

              <View style={styles.geofenceActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditGeofence(geofence.id)}
                >
                  <Text style={styles.actionButtonText}>✏ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteGeofence(geofence.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑 Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Current Location Info */}
        {currentLocation && (
          <ThemedView style={styles.locationCard}>
            <ThemedText style={styles.locationTitle}>Current Location</ThemedText>
            <View style={styles.locationDetails}>
              <View style={styles.locationRow}>
                <ThemedText style={styles.locationLabel}>Latitude:</ThemedText>
                <ThemedText style={styles.locationValue}>{currentLocation.latitude.toFixed(6)}</ThemedText>
              </View>
              <View style={styles.locationRow}>
                <ThemedText style={styles.locationLabel}>Longitude:</ThemedText>
                <ThemedText style={styles.locationValue}>{currentLocation.longitude.toFixed(6)}</ThemedText>
              </View>
              <View style={styles.locationRow}>
                <ThemedText style={styles.locationLabel}>Accuracy:</ThemedText>
                <ThemedText style={styles.locationValue}>
                  ±{Math.round(currentLocation.accuracy || 0)}m
                </ThemedText>
              </View>
            </View>
          </ThemedView>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                {editingId ? 'Edit Geofence' : 'Add New Geofence'}
              </ThemedText>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <ThemedText style={styles.formLabel}>Name</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter geofence name"
                  value={newGeofence.name}
                  onChangeText={(text) => setNewGeofence({ ...newGeofence, name: text })}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText style={styles.formLabel}>Latitude</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 21.355897"
                  value={newGeofence.latitude}
                  onChangeText={(text) => setNewGeofence({ ...newGeofence, latitude: text })}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText style={styles.formLabel}>Longitude</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 78.980604"
                  value={newGeofence.longitude}
                  onChangeText={(text) => setNewGeofence({ ...newGeofence, longitude: text })}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText style={styles.formLabel}>Radius (meters)</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 500"
                  value={newGeofence.radius}
                  onChangeText={(text) => setNewGeofence({ ...newGeofence, radius: text })}
                  keyboardType="number-pad"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <ThemedText style={styles.formLabel}>Type</ThemedText>
                <View style={styles.typeButtons}>
                  {(['office', 'branch', 'field'] as const).map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        newGeofence.type === type && styles.typeButtonActive,
                      ]}
                      onPress={() => setNewGeofence({ ...newGeofence, type })}
                    >
                      <ThemedText
                        style={[
                          styles.typeButtonText,
                          newGeofence.type === type && styles.typeButtonTextActive,
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddGeofence}
              >
                <Text style={styles.saveButtonText}>
                  {editingId ? 'Update Geofence' : 'Create Geofence'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  geofenceCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E0E0E0',
  },
  geofenceCardActive: {
    borderLeftColor: '#2196F3',
    backgroundColor: '#F0F7FF',
  },
  geofenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  geofenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  typeBadgeText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  geofenceTexts: {
    flex: 1,
  },
  geofenceName: {
    fontSize: 14,
    fontWeight: '600',
  },
  geofenceType: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 2,
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  activeBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  geofenceDetails: {
    gap: 6,
    marginBottom: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomColor: '#F0F0F0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 11,
    opacity: 0.6,
  },
  detailValue: {
    fontSize: 11,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  geofenceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FFE5E5',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F44336',
  },
  locationCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  locationDetails: {
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  locationValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 100,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseButton: {
    fontSize: 24,
  },
  modalForm: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  saveButton: {
    marginVertical: 20,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});
