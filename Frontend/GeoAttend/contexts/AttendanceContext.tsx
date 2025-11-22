import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export interface AttendanceRecord {
  id: string;
  date: Date;
  checkInTime: Date;
  checkOutTime: Date | null;
  checkInLocation: {
    latitude: number;
    longitude: number;
    accuracy: number | null;
  };
  checkOutLocation: {
    latitude: number;
    longitude: number;
    accuracy: number | null;
  } | null;
  geofenceId: string;
  workingHours: number; // in minutes
  status: 'present' | 'absent' | 'late' | 'half-day' | 'on-leave';
  notes?: string;
}

export interface EmployeeMetrics {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalWorkingHours: number;
  averageDailyHours: number;
  punctualityRate: number; // percentage
  attendanceRate: number; // percentage
  lastCheckIn: Date | null;
  lastCheckOut: Date | null;
}

interface AttendanceContextType {
  records: AttendanceRecord[];
  currentSession: {
    checkInTime: Date | null;
    checkOutTime: Date | null;
    geofenceId: string | null;
  } | null;
  metrics: EmployeeMetrics;
  checkIn: (geofenceId: string, location: { latitude: number; longitude: number; accuracy: number | null }) => void;
  checkOut: (location: { latitude: number; longitude: number; accuracy: number | null }) => void;
  getRecordsForDate: (date: Date) => AttendanceRecord[];
  getRecordsForDateRange: (startDate: Date, endDate: Date) => AttendanceRecord[];
  calculateMetrics: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

// Generate mock attendance records for last 30 days
const generateMockRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();

  for (let i = 0; i < 25; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const checkInTime = new Date(date);
    checkInTime.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);

    const checkOutTime = new Date(date);
    checkOutTime.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);

    const workingMinutes = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60);
    const isLate = checkInTime.getHours() > 9 || (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 0);

    records.push({
      id: `record-${i}`,
      date: date,
      checkInTime,
      checkOutTime,
      checkInLocation: {
        latitude: 21.355897 + (Math.random() - 0.5) * 0.01,
        longitude: 78.980604 + (Math.random() - 0.5) * 0.01,
        accuracy: Math.floor(Math.random() * 20) + 5,
      },
      checkOutLocation: {
        latitude: 21.355897 + (Math.random() - 0.5) * 0.01,
        longitude: 78.980604 + (Math.random() - 0.5) * 0.01,
        accuracy: Math.floor(Math.random() * 20) + 5,
      },
      geofenceId: 'office-main',
      workingHours: workingMinutes,
      status: isLate ? 'late' : 'present',
      notes: isLate ? 'Late arrival' : undefined,
    });
  }

  return records.sort((a, b) => b.date.getTime() - a.date.getTime());
};

interface AttendanceProviderProps {
  children: ReactNode;
}

export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({ children }) => {
  // const { geofenceEvents, activeGeofence } = useGeofence();
  const [records, setRecords] = useState<AttendanceRecord[]>(generateMockRecords());
  const [currentSession, setCurrentSession] = useState<{
    checkInTime: Date | null;
    checkOutTime: Date | null;
    geofenceId: string | null;
  } | null>(null);
  const [metrics, setMetrics] = useState<EmployeeMetrics>({
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    totalWorkingHours: 0,
    averageDailyHours: 0,
    punctualityRate: 0,
    attendanceRate: 0,
    lastCheckIn: null,
    lastCheckOut: null,
  });

  // Check in function
  const checkIn = useCallback((
    geofenceId: string,
    location: { latitude: number; longitude: number; accuracy: number | null }
  ) => {
    setCurrentSession({
      checkInTime: new Date(),
      checkOutTime: null,
      geofenceId,
    });
  }, []);

  // Check out function
  const checkOut = useCallback((
    location: { latitude: number; longitude: number; accuracy: number | null }
  ) => {
    if (!currentSession) return;

    const checkOutTime = new Date();
    const workingMinutes = (checkOutTime.getTime() - (currentSession.checkInTime?.getTime() || 0)) / (1000 * 60);

    const isLate = (currentSession.checkInTime?.getHours() || 0) > 9 ||
      ((currentSession.checkInTime?.getHours() === 9) && (currentSession.checkInTime?.getMinutes() || 0) > 0);

    const record: AttendanceRecord = {
      id: `record-${Date.now()}`,
      date: new Date(),
      checkInTime: currentSession.checkInTime!,
      checkOutTime,
      checkInLocation: {
        latitude: currentSession.checkInTime ? 21.355897 : location.latitude,
        longitude: currentSession.checkInTime ? 78.980604 : location.longitude,
        accuracy: currentSession.checkInTime ? 10 : location.accuracy,
      },
      checkOutLocation: location,
      geofenceId: currentSession.geofenceId || 'unknown',
      workingHours: workingMinutes,
      status: isLate ? 'late' : 'present',
      notes: isLate ? 'Late arrival' : undefined,
    };

    setRecords((prev: AttendanceRecord[]) => [record, ...prev]);
    setCurrentSession(null);
  }, [currentSession]);

  // Get records for a specific date
  const getRecordsForDate = useCallback((date: Date): AttendanceRecord[] => {
    const dateStr = date.toDateString();
    return records.filter((r: AttendanceRecord) => r.date.toDateString() === dateStr);
  }, [records]);

  // Get records for date range
  const getRecordsForDateRange = useCallback((startDate: Date, endDate: Date): AttendanceRecord[] => {
    return records.filter((r: AttendanceRecord) => r.date >= startDate && r.date <= endDate);
  }, [records]);

  // Calculate metrics
  const calculateMetrics = useCallback(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRecords = getRecordsForDateRange(thirtyDaysAgo, new Date());

    const present = recentRecords.filter((r: AttendanceRecord) => r.status === 'present').length;
    const late = recentRecords.filter((r: AttendanceRecord) => r.status === 'late').length;
    const totalWorkingHours = recentRecords.reduce((sum: number, r: AttendanceRecord) => sum + r.workingHours, 0);
    const averageDailyHours = recentRecords.length > 0 ? totalWorkingHours / recentRecords.length : 0;

    // Estimate absent days
    const workingDays = 20; // Approximate working days in 30 days
    const absent = Math.max(0, workingDays - present - late);

    const newMetrics: EmployeeMetrics = {
      totalPresent: present,
      totalAbsent: absent,
      totalLate: late,
      totalWorkingHours,
      averageDailyHours,
      punctualityRate: recentRecords.length > 0 ? (present / recentRecords.length) * 100 : 0,
      attendanceRate: recentRecords.length > 0 ? ((present + late) / workingDays) * 100 : 0,
      lastCheckIn: recentRecords[0]?.checkInTime || null,
      lastCheckOut: recentRecords[0]?.checkOutTime || null,
    };

    setMetrics(newMetrics);
  }, [getRecordsForDateRange]);

  // Recalculate metrics when records change
  useEffect(() => {
    calculateMetrics();
  }, [records, calculateMetrics]);

  const value: AttendanceContextType = {
    records,
    currentSession,
    metrics,
    checkIn,
    checkOut,
    getRecordsForDate,
    getRecordsForDateRange,
    calculateMetrics,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
