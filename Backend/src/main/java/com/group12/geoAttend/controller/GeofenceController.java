package com.group12.geoAttend.controller;

import com.group12.geoAttend.dto.CreateGeofenceDTO;
import com.group12.geoAttend.dto.GeofenceDTO;
import com.group12.geoAttend.dto.UpdateGeofenceDTO;
import com.group12.geoAttend.entity.GeoFence;
import com.group12.geoAttend.services.GeofenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/geofences")
@RequiredArgsConstructor
public class GeofenceController {

    private final GeofenceService geofenceService;
    private final ModelMapper modelMapper;

    /**
     * Create a new geofence (Admin only)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeofenceDTO> createGeofence(@Valid @RequestBody CreateGeofenceDTO dto) {
        GeoFence geofence = geofenceService.createGeofence(
                dto.getName(),
                dto.getCenterLat(),
                dto.getCenterLon(),
                dto.getRadiusMeters(),
                dto.getStartTime(),
                dto.getEndTime(),
                dto.getAllowedDays()
        );

        return new ResponseEntity<>(modelMapper.map(geofence, GeofenceDTO.class), HttpStatus.CREATED);
    }

    /**
     * Get all active geofences
     */
    @GetMapping
    public ResponseEntity<List<GeofenceDTO>> getAllGeofences() {
        List<GeoFence> geofences = geofenceService.getAllActiveGeofences();

        List<GeofenceDTO> dtos = geofences.stream()
                .map(g -> modelMapper.map(g, GeofenceDTO.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /**
     * Get geofence by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<GeofenceDTO> getGeofenceById(@PathVariable String id) {
        GeoFence geofence = geofenceService.getGeofenceById(id);
        return ResponseEntity.ok(modelMapper.map(geofence, GeofenceDTO.class));
    }

    /**
     * Update geofence (Admin only)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeofenceDTO> updateGeofence(
            @PathVariable String id,
            @Valid @RequestBody UpdateGeofenceDTO dto) {

        GeoFence existing = geofenceService.getGeofenceById(id);

        GeoFence updated = geofenceService.updateGeofence(
                id,
                dto.getName() != null ? dto.getName() : existing.getName(),
                dto.getCenterLat() != null ? dto.getCenterLat() : existing.getCenterLat(),
                dto.getCenterLon() != null ? dto.getCenterLon() : existing.getCenterLon(),
                dto.getRadiusMeters() != null ? dto.getRadiusMeters() : existing.getRadiusMeters(),
                dto.getStartTime() != null ? dto.getStartTime() : existing.getStartTime(),
                dto.getEndTime() != null ? dto.getEndTime() : existing.getEndTime(),
                dto.getAllowedDays() != null ? dto.getAllowedDays() : existing.getAllowedDays(),
                dto.getActive() != null ? dto.getActive() : existing.isActive()
        );

        return ResponseEntity.ok(modelMapper.map(updated, GeofenceDTO.class));
    }

    /**
     * Delete geofence (Admin only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteGeofence(@PathVariable String id) {
        geofenceService.deleteGeofence(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Check if coordinates are within a specific geofence
     */
    @GetMapping("/{id}/check")
    public ResponseEntity<Boolean> checkLocation(
            @PathVariable String id,
            @RequestParam double lat,
            @RequestParam double lon) {

        GeoFence geofence = geofenceService.getGeofenceById(id);
        boolean isInside = geofenceService.isWithinGeofence(geofence, lat, lon);

        return ResponseEntity.ok(isInside);
    }
}