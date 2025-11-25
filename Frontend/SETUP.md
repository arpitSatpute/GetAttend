# GeoAttend Setup & Running Guide

## Prerequisites
- Node.js 16+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Physical device with Expo Go app (for real device testing)

## Installation

1. **Install dependencies:**
```bash
cd /path/to/GeoAttend
npm install
```

2. **Install Expo-specific packages:**
```bash
npx expo install expo-location expo-notifications expo-router
```

## Running the App

### Option 1: iOS Simulator (macOS)
```bash
npm run ios
# or
npx expo start --ios
```

### Option 2: Android Emulator
```bash
npm run android
# or
npx expo start --android
```

### Option 3: Physical Device with Expo Go
```bash
npx expo start
# Scan QR code with Expo Go app (iOS) or Camera app (Android)
```

### Option 4: Web Preview (Limited functionality)
```bash
npx expo start --web
```

## Project Structure

```
GeoAttend/
├── app/
│   ├── _layout.tsx              # Root layout with all providers
│   ├── index.tsx                # Home screen
│   ├── welcome.tsx              # Welcome screen
│   ├── (auth)/                  # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── (tabs)/                  # Tab navigation screens
│       ├── dashboard.tsx        # Main dashboard
│       ├── attendance.tsx       # Attendance history
│       ├── insights.tsx         # Performance analytics
│       ├── reports.tsx          # Reports & sharing
│       ├── geofence-management.tsx  # Geofence CRUD
│       └── fence.tsx            # Map view
├── contexts/
│   ├── AuthContext.tsx          # Authentication state
│   ├── GeofenceContext.tsx      # Location & geofence tracking
│   ├── AttendanceContext.tsx    # Attendance records
│   └── NotificationContext.tsx  # Real-time notifications
├── components/
│   ├── attendance-card.tsx      # Check-in/out UI
│   ├── gps-tracker.tsx          # GPS location display
│   ├── notification-center.tsx  # Notifications UI
│   └── ui/                      # Themed components
├── utils/
│   └── helpers.ts               # 50+ utility functions
├── constants/
│   └── theme.ts                 # Color & styling constants
└── FEATURES.md                  # Feature documentation
```

## Key Features Implemented

✅ **GPS-Only Location Tracking**
- Real-time location updates using expo-location
- Haversine distance calculation
- Entry/exit detection for geofences

✅ **Attendance Management**
- Check-in/check-out functionality
- 25 days of mock attendance records
- Daily metrics (avg hours, punctuality, attendance rate)

✅ **Geofence Management**
- Create, read, update, delete geofences
- 3 default mock geofences (offices)
- Location-based status

✅ **Real-Time Notifications**
- Auto-dismiss notifications
- Type-based categories (check-in, check-out, alert, info, warning)
- Unread count tracking

✅ **Analytics & Insights**
- Performance scoring (0-100)
- Trend indicators
- Smart observations engine
- 6 key metrics tracking

✅ **Reports & Export**
- Period-based reporting (week/month/quarter/year)
- Summary statistics with progress bars
- Share functionality

## Available Scripts

```bash
# Development
npm start              # Start Expo development server
npm run ios           # Run iOS simulator
npm run android       # Run Android emulator
npm run web           # Run web preview

# Testing
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript type checking

# Building (requires Expo account)
npm run build         # Build for all platforms
npm run build:ios     # Build for iOS
npm run build:android # Build for Android
```

## Mock Data

The app uses mock data throughout to allow testing without a backend:

**Mock Geofences:**
- Main Office: 19.0760°N, 72.8777°E
- Branch West: 19.0800°N, 72.8600°E
- Branch East: 19.0700°N, 72.9000°E

**Mock Attendance:**
- 25 days of records with realistic check-in/out times
- Random working hours (6-10 hours per day)
- Various status types (present, late, absent)

## GPS & Location Permissions

The app requires location permissions to function:

**iOS:** Add to `app.json`:
```json
"ios": {
  "infoPlist": {
    "NSLocationWhenInUseUsageDescription": "We need your location for attendance tracking",
    "NSLocationAlwaysAndWhenInUseUsageDescription": "We need your location for attendance tracking"
  }
}
```

**Android:** Add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

## Backend Integration (Next Steps)

To connect to a real backend, replace mock data in these files:
- `contexts/AttendanceContext.tsx`: Replace `generateMockRecords()` with API calls
- `contexts/GeofenceContext.tsx`: Replace `MOCK_GEOFENCES` with API data
- `contexts/AuthContext.tsx`: Implement real JWT/OAuth2 authentication
- `contexts/NotificationContext.tsx`: Connect to WebSocket for real-time updates

## Troubleshooting

**Issue: GPS not updating**
- Ensure location services are enabled on device
- Grant location permissions in app settings
- For simulator: Use the location mock in Xcode/Android Studio

**Issue: App crashes on startup**
- Clear cache: `npx expo start --clear`
- Delete node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

**Issue: Notifications not appearing**
- Ensure NotificationProvider is in app/_layout.tsx
- Check notification permissions on device
- Verify notification type is valid

## Performance Optimization

- Geofence check runs every 30 seconds (configurable)
- Attendance metrics calculated on-demand with useMemo
- Navigation lazy-loads screens
- Mock data generated once at context creation

## Security Considerations

⚠️ **Current State (Mock Data):**
- No authentication required
- Location always accessible
- No data encryption

**Before Production:**
1. Implement JWT/OAuth2 authentication
2. Encrypt GPS coordinates in transit
3. Add facial recognition for proxy prevention
4. Implement end-to-end encryption for attendance records
5. Add rate limiting for API calls
6. Implement certificate pinning

## Support & Documentation

- `FEATURES.md`: Complete feature list with descriptions
- `IMPLEMENTATION_SUMMARY.md`: Implementation status for all 20 features
- TypeScript types in each context file

## License

Proprietary - GeoAttend Development Team
