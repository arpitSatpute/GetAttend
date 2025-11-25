package com.group12.geoAttend.services;

import com.group12.geoAttend.dto.CheckinRequestDTO;
import com.group12.geoAttend.dto.CheckinResponseDTO;
import com.group12.geoAttend.entity.Attendence;
import com.group12.geoAttend.entity.GeoFence;
import com.group12.geoAttend.entity.User;
import com.group12.geoAttend.exceptions.RuntimeConflictException;
import com.group12.geoAttend.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final GeofenceService geofenceService;
    private final UserService userService;

    /**
     * Process check-in request
     */
    public CheckinResponseDTO checkIn(String userId, CheckinRequestDTO request) {
        User user = userService.getUserById(userId);

        // Validate that user hasn't already checked in today
        if (hasCheckedInToday(userId)) {
            throw new RuntimeConflictException("Already checked in today");
        }

        // Find all active geofences
        List<GeoFence> activeGeofences = geofenceService.getAllActiveGeofences();

        // Find matching geofence
        GeoFence matchedGeofence = null;
        for (GeoFence geofence : activeGeofences) {
            if (geofenceService.isWithinGeofence(geofence, request.getLat(), request.getLon())) {
                matchedGeofence = geofence;
                break;
            }
        }

        // Build attendance record
        Attendence attendance = Attendence.builder()
                .user(user)
                .geofence(matchedGeofence)
                .lat(request.getLat())
                .lon(request.getLon())
                .accuracyMeters(request.getAccuracy())
                .deviceTimestamp(request.getDeviceTime())
                .serverReceivedAt(Instant.now())
                .method(request.getMethod() != null ? request.getMethod() : "CLIENT_CHECK")
                .rawPayload(request.getRawPayload())
                .build();

        // Determine status
        if (matchedGeofence == null) {
            attendance.setStatus("OUTSIDE");
            attendance.setReason("Location is outside all defined geofences");
        } else if (!geofenceService.isAllowedDay(matchedGeofence)) {
            attendance.setStatus("REJECTED");
            attendance.setReason("Check-in not allowed on this day");
        } else if (!geofenceService.isWithinAllowedTime(matchedGeofence)) {
            attendance.setStatus("FLAGGED");
            attendance.setReason("Check-in outside allowed time window");
        } else {
            attendance.setStatus("ACCEPTED");
            attendance.setReason("Check-in successful");
        }

        // Generate hash of raw payload if present
        if (request.getRawPayload() != null) {
            attendance.setRawPayloadHash(generateSHA256(request.getRawPayload()));
        }

        // Save attendance
        Attendence saved = attendanceRepository.save(attendance);

        return new CheckinResponseDTO(
                saved.getStatus(),
                saved.getId(),
                saved.getReason()
        );
    }

    /**
     * Get user's attendance history
     */
    public List<Attendence> getUserAttendanceHistory(String userId) {
        return attendanceRepository.findByUser_IdOrderByServerReceivedAtDesc(userId);
    }

    /**
     * Check if user has already checked in today
     */
    private boolean hasCheckedInToday(String userId) {
        List<Attendence> todayRecords = attendanceRepository.findByUser_IdOrderByServerReceivedAtDesc(userId)
                .stream()
                .filter(a -> {
                    LocalDate recordDate = a.getServerReceivedAt()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();
                    return recordDate.equals(LocalDate.now());
                })
                .toList();

        return !todayRecords.isEmpty();
    }

    /**
     * Generate SHA-256 hash for payload integrity
     */
    private String generateSHA256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return null;
        }
    }

    /**
     * Get attendance by ID
     */
    public Attendence getAttendanceById(String id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));
    }

    /**
     * Get all attendance records
     */
    public List<Attendence> getAllAttendance() {
        return attendanceRepository.findAll();
    }
}