package com.group12.geoAttend.services;

import com.group12.geoAttend.entity.GeoFence;
import com.group12.geoAttend.exceptions.ResourceNotFoundException;
import com.group12.geoAttend.repository.GeofenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class GeofenceService {

    private final GeofenceRepository geofenceRepository;

    /**
     * Create a new geofence
     */
    public GeoFence createGeofence(String name, double centerLat, double centerLon,
                                   int radiusMeters, LocalTime startTime, LocalTime endTime,
                                   Set<DayOfWeek> allowedDays) {
        GeoFence geofence = GeoFence.builder()
                .name(name)
                .centerLat(centerLat)
                .centerLon(centerLon)
                .radiusMeters(radiusMeters)
                .startTime(startTime)
                .endTime(endTime)
                .allowedDays(allowedDays)
                .active(true)
                .priority(0)
                .build();

        return geofenceRepository.save(geofence);
    }

    /**
     * Get all active geofences
     */
    public List<GeoFence> getAllActiveGeofences() {
        return geofenceRepository.findByActiveTrue();
    }

    /**
     * Get geofence by ID
     */
    public GeoFence getGeofenceById(String id) {
        return geofenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Geofence not found with id: " + id));
    }

    /**
     * Update geofence
     */
    public GeoFence updateGeofence(String id, String name, double centerLat, double centerLon,
                                   int radiusMeters, LocalTime startTime, LocalTime endTime,
                                   Set<DayOfWeek> allowedDays, boolean active) {
        GeoFence geofence = getGeofenceById(id);

        geofence.setName(name);
        geofence.setCenterLat(centerLat);
        geofence.setCenterLon(centerLon);
        geofence.setRadiusMeters(radiusMeters);
        geofence.setStartTime(startTime);
        geofence.setEndTime(endTime);
        geofence.setAllowedDays(allowedDays);
        geofence.setActive(active);

        return geofenceRepository.save(geofence);
    }

    /**
     * Delete geofence
     */
    public void deleteGeofence(String id) {
        GeoFence geofence = getGeofenceById(id);
        geofenceRepository.delete(geofence);
    }

    /**
     * Check if coordinates are within geofence using Haversine formula
     */
    public boolean isWithinGeofence(GeoFence geofence, double lat, double lon) {
        double distance = calculateDistance(
                geofence.getCenterLat(),
                geofence.getCenterLon(),
                lat,
                lon
        );
        return distance <= geofence.getRadiusMeters();
    }

    /**
     * Calculate distance between two coordinates in meters using Haversine formula
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371000; // meters

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    /**
     * Find the closest geofence to given coordinates
     */
    public GeoFence findClosestGeofence(double lat, double lon) {
        List<GeoFence> geofences = getAllActiveGeofences();

        GeoFence closest = null;
        double minDistance = Double.MAX_VALUE;

        for (GeoFence geofence : geofences) {
            double distance = calculateDistance(
                    geofence.getCenterLat(),
                    geofence.getCenterLon(),
                    lat,
                    lon
            );

            if (distance < minDistance) {
                minDistance = distance;
                closest = geofence;
            }
        }

        return closest;
    }

    /**
     * Check if current time is within geofence allowed time
     */
    public boolean isWithinAllowedTime(GeoFence geofence) {
        LocalTime now = LocalTime.now();
        return !now.isBefore(geofence.getStartTime()) && !now.isAfter(geofence.getEndTime());
    }

    /**
     * Check if today is an allowed day for the geofence
     */
    public boolean isAllowedDay(GeoFence geofence) {
        DayOfWeek today = DayOfWeek.from(java.time.LocalDate.now());
        return geofence.getAllowedDays().contains(today);
    }
}