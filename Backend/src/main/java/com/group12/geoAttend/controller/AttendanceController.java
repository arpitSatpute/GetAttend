package com.group12.geoAttend.controller;

import com.group12.geoAttend.dto.CheckinRequestDTO;
import com.group12.geoAttend.dto.CheckinResponseDTO;
import com.group12.geoAttend.entity.Attendence;
import com.group12.geoAttend.entity.User;
import com.group12.geoAttend.services.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    /**
     * Check-in endpoint
     */
    @PostMapping("/checkin")
    public ResponseEntity<CheckinResponseDTO> checkIn(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CheckinRequestDTO request) {

        CheckinResponseDTO response = attendanceService.checkIn(user.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get current user's attendance history
     */
    @GetMapping("/my-history")
    public ResponseEntity<List<Attendence>> getMyAttendanceHistory(@AuthenticationPrincipal User user) {
        List<Attendence> records = attendanceService.getUserAttendanceHistory(user.getId());
        return ResponseEntity.ok(records);
    }

    /**
     * Get specific attendance record
     */
    @GetMapping("/{id}")
    public ResponseEntity<Attendence> getAttendanceById(@PathVariable String id) {
        Attendence attendance = attendanceService.getAttendanceById(id);
        return ResponseEntity.ok(attendance);
    }

    /**
     * Get all attendance records (Admin only)
     */
    @GetMapping("/all")
    public ResponseEntity<List<Attendence>> getAllAttendance() {
        List<Attendence> records = attendanceService.getAllAttendance();
        return ResponseEntity.ok(records);
    }

    /**
     * Get attendance history for a specific user (Admin only)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Attendence>> getUserAttendance(@PathVariable String userId) {
        List<Attendence> records = attendanceService.getUserAttendanceHistory(userId);
        return ResponseEntity.ok(records);
    }
}