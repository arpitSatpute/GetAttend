# GeoAttend - Geofencing Attendance Tracking System

A comprehensive React Native + Expo mobile application for automated attendance tracking using GPS-based geofencing. Built with TypeScript and includes real-time notifications, performance analytics, and detailed reporting.

## 🎯 Features Implemented

### 1. **Automated Attendance Tracking** ✅
- Auto-marks attendance when entering/exiting geofenced areas
- GPS-based location tracking with accuracy indicators
- Real-time check-in/check-out logging
- Automatic session management

### 2. **Geofencing-Based Attendance** ✅
- Create and manage multiple virtual boundaries (offices, branches, field locations)
- Interactive geofence management UI with CRUD operations
- Support for 3 geofence types: Office, Branch, Field
- Real-time geofence entry/exit detection
- Visual geofence editing with coordinates and radius

### 3. **Real-Time GPS Tracking** ✅
- Continuous background location updates every 2 seconds
- Accuracy indicators (Excellent/Good/Fair/Poor/Very Poor)
- Distance in meters (±Xm)
- Altitude, speed, and heading data
- Location permission handling

### 4. **Employee Dashboard** ✅
- Quick statistics: Present, Late, Absent, Attendance Rate
- Today's attendance status indicator
- Active geofence display
- Attendance records for today
- Real-time notifications center
- GPS tracker integration

### 5. **Attendance History** ✅
- Detailed record of all attendance entries
- Filter by status (Present/Late/Absent)
- Filter by date range (Week/Month/All Time)
- Expandable records showing detailed information
- Check-in/out times with GPS coordinates and accuracy
- Working hours calculation

### 6. **Performance Insights** ✅
- Overall performance score (0-100)
- Trend indicators with visual feedback
- Key metrics dashboard:
  - Attendance Rate
  - Punctuality Rate
  - Average Daily Hours
  - Late Arrivals
  - Early Exits
  - Total Present Days
- Smart observations and recommendations
- Weekly average analysis

### 7. **Advanced Reports & Analytics** ✅
- Period-based reports (Last 7 Days, 30 Days, 90 Days, Year)
- Summary statistics with visual indicators
- Working hours breakdown
- Attendance metrics with progress bars
- Overall 30-day metrics
- Report sharing functionality
- PDF download capability (mock)

### 8. **Geofence Management** ✅
- View all active geofences
- Add new geofences with custom coordinates
- Edit existing geofences
- Delete geofences with confirmation
- Set active geofence for tracking
- Current location display
- Geofence details: coordinates, radius, address

### 9. **Real-Time Notifications** ✅
- Check-in confirmations
- Check-out confirmations
- Alert notifications
- Info notifications
- Notification center with unread count
- Mark as read functionality
- Auto-dismiss for transient notifications
- Notification history (last 50 notifications)

### 10. **Mock Data System** ✅
- Pre-loaded geofences (Main Office, Branch West, Branch East)
- 25 days of mock attendance records
- Realistic daily working hours simulation
- Mock GPS location variations
- Calculated metrics from mock data

### 11. **User Authentication Context** ✅
- Login/Signup functionality
- User session management
- Authentication state tracking
- Mock API integration ready

### 12. **Multi-Tab Navigation** ✅
- Home (index)
- Dashboard
- Attendance History
- Performance Insights
- Reports & Analytics
- Geofence Management
- Map/Fence View
- Easy tab-based navigation

## 📁 Project Structure

```
GeoAttend/
├── app/
│   ├── _layout.tsx                 # Root layout with all providers
│   ├── index.tsx                   # Home screen
│   ├── welcome.tsx                 # Welcome screen
│   ├── modal.tsx                   # Modal screen
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── (tabs)/
│       ├── _layout.tsx             # Tab navigation
│       ├── index.tsx               # Home tab
│       ├── dashboard.tsx           # Dashboard screen
│       ├── attendance.tsx          # Attendance history
│       ├── insights.tsx            # Performance insights
│       ├── reports.tsx             # Reports & analytics
│       ├── geofence-management.tsx # Geofence management
│       └── fence.tsx               # Map view
├── components/
│   ├── attendance-card.tsx         # Check-in/out card
│   ├── gps-tracker.tsx            # GPS tracking display
│   ├── notification-center.tsx     # Notifications UI
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ... (other UI components)
├── contexts/
│   ├── AuthContext.tsx             # Authentication context
│   ├── GeofenceContext.tsx         # Geofencing context
│   ├── AttendanceContext.tsx       # Attendance tracking context
│   └── NotificationContext.tsx     # Notifications context
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
├── constants/
│   └── theme.ts
└── package.json

```

## 🔧 Installed Dependencies

### Core
- `expo` ~54.0.1
- `react` 19.1.0
- `react-native` 0.81.4
- `expo-router` ~6.0.0

### Location & Maps
- `expo-location` ~19.0.7
- `react-native-maps` 1.20.1

### UI & Navigation
- `@react-navigation/native` ^7.1.8
- `@react-navigation/bottom-tabs` ^7.4.0
- `react-native-safe-area-context` ~5.6.0
- `react-native-screens` ~4.16.0

### Icons & Assets
- `@expo/vector-icons` ^15.0.2
- `expo-symbols` ~1.0.6

### Notifications
- `expo-notifications` ~0.32.11
- `expo-device` ~8.0.7

### Camera (for future facial recognition)
- `expo-camera` ~17.0.9

### Other
- `expo-constants` ~18.0.8
- `expo-font` ~14.0.7
- `expo-haptics` ~15.0.6
- `expo-image` ~3.0.7
- `expo-splash-screen` ~31.0.8
- `expo-status-bar` ~3.0.7
- `expo-web-browser` ~15.0.6

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- Expo CLI installed (`npm install -g expo-cli`)
- iOS or Android development environment

### Installation

```bash
# Navigate to project directory
cd GeoAttend

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## 📱 Key Screens

### 1. Dashboard
- Overview of attendance status
- Quick statistics
- Geofence selector
- Attendance card with check-in/out buttons
- GPS tracker
- Notifications center

### 2. Attendance History
- All past attendance records
- Filter by status and date range
- Detailed record expansion
- Working hours calculation

### 3. Insights
- Performance score (0-100)
- Trend indicators
- Key metrics with percentages
- AI-powered observations
- Weekly breakdown

### 4. Reports
- Period-based analytics
- Working hours summary
- Attendance metrics with progress bars
- Report sharing and download

### 5. Geofence Management
- View active geofences
- Create new geofences
- Edit/Delete geofences
- Set active geofence
- Current location display

### 6. Map View
- Interactive map with geofences
- Current location marker
- Geofence circles
- Real-time updates

## 🎨 UI Components

### Attendance Card
- Check-in/out buttons with time display
- Current session status
- Metrics: Avg Daily Hours, Punctuality, Attendance Rate
- Active geofence information

### GPS Tracker
- Real-time location display
- Accuracy indicator with color coding
- GPS status indicators
- Debug info (altitude, speed, heading)
- Pull-to-refresh functionality

### Notification Center
- Notification list with icons
- Unread count badge
- Auto-dismiss for transient notifications
- Mark as read functionality
- Clear all option

### Performance Metrics
- Visual progress bars
- Percentage indicators
- Color-coded status
- Trending information

## 🔐 Security Features

### Proxy Attendance Prevention
- GPS-based location verification
- Timestamp validation
- Location accuracy checking
- Geofence boundary detection
- Real-time position tracking

### Data Privacy
- Local state management
- No sensitive data in logs
- Location permission requests
- Privacy-first architecture

## 📊 Mock Data

### Geofences
1. **Main Office** - 21.355897, 78.980604 (500m radius)
2. **Branch Office - West** - 21.315897, 78.940604 (400m radius)
3. **Branch Office - East** - 21.375897, 79.020604 (350m radius)

### Attendance Records
- 25 days of simulated records
- Random working hours (7-9 hours)
- 20% late arrivals probability
- Realistic GPS variations

## 🔄 Context APIs

### GeofenceContext
- `geofences`: Array of geofence objects
- `currentLocation`: Real-time GPS data
- `activeGeofence`: Currently tracking geofence
- `isInsideGeofence`: Boolean status
- `geofenceEvents`: Array of entry/exit events
- Methods: `addGeofence`, `removeGeofence`, `updateGeofence`, `startTracking`, `stopTracking`

### AttendanceContext
- `records`: Array of attendance records
- `currentSession`: Current check-in session
- `metrics`: Calculated employee metrics
- Methods: `checkIn`, `checkOut`, `getRecordsForDate`, `getRecordsForDateRange`, `calculateMetrics`

### NotificationContext
- `notifications`: Array of notifications
- `unreadCount`: Count of unread notifications
- Methods: `addNotification`, `markAsRead`, `markAllAsRead`, `removeNotification`, `clearAllNotifications`

### AuthContext
- `user`: Current user object
- `isAuthenticated`: Authentication state
- Methods: `login`, `signup`, `logout`

## 🎯 Future Enhancements

1. **Facial Recognition** - TensorFlow + OpenCV integration
2. **Backend Integration** - Replace mock data with API calls
3. **MTCNN Implementation** - Real-time face detection
4. **WebSocket Support** - Real-time admin notifications
5. **Salary Calculation** - Integrated payroll system
6. **PDF Report Generation** - Actual PDF exports
7. **Multi-language Support** - i18n integration
8. **Dark Mode** - Theme switching
9. **Offline Support** - SQLite local storage
10. **Performance Optimization** - Redux state management

## 📝 API Integration Points

Ready for backend integration at:
- `contexts/AuthContext.tsx` - Login/Signup API calls
- `contexts/GeofenceContext.tsx` - Geofence CRUD operations
- `contexts/AttendanceContext.tsx` - Attendance record sync
- `contexts/NotificationContext.tsx` - Real-time notification streaming

## 🧪 Testing

Current state includes:
- Mock data for all features
- Sample geofences with realistic coordinates
- 30 days of simulated attendance
- Realistic GPS accuracy variations

## 📄 License

MIT License - Free for educational and commercial use

## 👥 Development Team

Built as part of Group 12 Project Work for GeoAttend Application

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Status**: Production Ready (Frontend)
