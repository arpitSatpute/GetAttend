// Utility functions for GeoAttend application

/**
 * Calculate distance between two geographic coordinates using Haversine formula
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Check if a point is inside a circle (geofence)
 */
export const isPointInGeofence = (
  userLat: number,
  userLon: number,
  centerLat: number,
  centerLon: number,
  radius: number
): boolean => {
  const distance = calculateDistance(userLat, userLon, centerLat, centerLon);
  return distance <= radius;
};

/**
 * Format time duration in hours and minutes
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date, format: 'short' | 'long' = 'short'): string => {
  if (format === 'short') {
    return date.toLocaleDateString('default', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time to HH:MM format
 */
export const formatTime = (date: Date | null): string => {
  if (!date) return '--:--';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Get human-readable time difference (e.g., "5 minutes ago")
 */
export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
};

/**
 * Calculate attendance percentage
 */
export const calculateAttendancePercentage = (present: number, total: number): number => {
  if (total === 0) return 0;
  return (present / total) * 100;
};

/**
 * Calculate punctuality percentage
 */
export const calculatePunctualityPercentage = (onTime: number, total: number): number => {
  if (total === 0) return 0;
  return (onTime / total) * 100;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate coordinates (latitude, longitude)
 */
export const isValidCoordinates = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

/**
 * Get accuracy level description based on GPS accuracy
 */
export const getAccuracyLevel = (accuracy: number | null): string => {
  if (!accuracy) return 'Unknown';
  if (accuracy < 10) return 'Excellent';
  if (accuracy < 25) return 'Good';
  if (accuracy < 50) return 'Fair';
  if (accuracy < 100) return 'Poor';
  return 'Very Poor';
};

/**
 * Get color based on accuracy
 */
export const getAccuracyColor = (accuracy: number | null): string => {
  if (!accuracy) return '#999999';
  if (accuracy < 10) return '#00AA00';
  if (accuracy < 25) return '#44BB00';
  if (accuracy < 50) return '#FFBB00';
  if (accuracy < 100) return '#FF6600';
  return '#CC0000';
};

/**
 * Get status color
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'present':
      return '#4CAF50';
    case 'late':
      return '#FF9800';
    case 'absent':
      return '#F44336';
    case 'half-day':
      return '#2196F3';
    case 'on-leave':
      return '#9C27B0';
    default:
      return '#9E9E9E';
  }
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Get start of day
 */
export const getStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Get end of day
 */
export const getEndOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Round number to decimal places
 */
export const roundTo = (value: number, decimals: number): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Generate unique ID
 */
export const generateId = (prefix: string = ''): string => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate geofence radius
 */
export const isValidRadius = (radius: number): boolean => {
  return radius > 0 && radius <= 5000; // Max 5km radius
};

/**
 * Convert seconds to time string
 */
export const secondsToTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Calculate working hours between two times
 */
export const calculateWorkingHours = (startTime: Date, endTime: Date): number => {
  const diff = endTime.getTime() - startTime.getTime();
  return diff / (1000 * 60); // Return in minutes
};

/**
 * Check if time is within working hours (9 AM to 6 PM)
 */
export const isWorkingHours = (date: Date): boolean => {
  const hours = date.getHours();
  return hours >= 9 && hours < 18;
};

/**
 * Batch calculate statistics from records
 */
export const calculateStats = (records: any[]): any => {
  if (records.length === 0) {
    return {
      total: 0,
      present: 0,
      late: 0,
      absent: 0,
      totalHours: 0,
      averageHours: 0,
    };
  }

  const present = records.filter((r: any) => r.status === 'present').length;
  const late = records.filter((r: any) => r.status === 'late').length;
  const absent = records.filter((r: any) => r.status === 'absent').length;
  const totalHours = records.reduce((sum: number, r: any) => sum + r.workingHours, 0);

  return {
    total: records.length,
    present,
    late,
    absent,
    totalHours,
    averageHours: totalHours / records.length,
  };
};
