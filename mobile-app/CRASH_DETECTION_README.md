# Crash Detection and Tracking System

This document describes the comprehensive crash detection, tracking, and resolution system implemented for the React Native app to provide stability and reliability for both admin and member users.

## Features

### ✅ Automatic Crash Detection
- **JavaScript Errors**: Catches unhandled JavaScript exceptions
- **Native Crashes**: Detects native iOS/Android crashes
- **Unhandled Promise Rejections**: Captures async operation failures
- **React Component Errors**: Error boundaries catch component render errors

### ✅ Comprehensive Tracking
- **User Context**: Associates crashes with admin/member roles
- **Screen Tracking**: Identifies which screen the crash occurred on
- **Stack Traces**: Captures detailed error information for debugging
- **Metadata**: Stores additional context (timestamp, app version, platform)

### ✅ Crash Management Dashboard
- **Admin-Only Access**: Dedicated crash reports tab in admin dashboard
- **Statistics Overview**: Total, resolved, and role-specific crash counts
- **Filtering**: View all crashes or only unresolved ones
- **Detailed Views**: Full crash reports with stack traces
- **Resolution Tracking**: Mark crashes as resolved and track progress

## Installation

### 1. Install Dependencies
```bash
cd mobile-app
npm install
```

The following dependencies have been added to `package.json`:
- `@react-native-async-storage/async-storage`: For local crash report storage
- `react-native-exception-handler`: For native crash detection

### 2. Platform-Specific Setup

#### iOS
No additional setup required for Expo projects.

#### Android
No additional setup required for Expo projects.

## Architecture

### Core Components

#### 1. CrashDetectionService (`src/services/crashDetectionService.ts`)
- Singleton service managing all crash detection
- Handles JS errors, native crashes, and promise rejections
- Stores crash reports locally using AsyncStorage
- Provides methods for querying and managing crash data

#### 2. ErrorBoundary (`src/components/ErrorBoundary.tsx`)
- React component catching JavaScript errors in component trees
- Provides fallback UI with retry functionality
- Automatically reports errors to CrashDetectionService
- Shows debug information in development mode

#### 3. CrashReportingContext (`src/context/CrashReportingContext.tsx`)
- React context for centralized crash management
- Provides hooks for screen tracking and safe async operations
- Integrates with authentication to track user roles
- Manages crash service initialization

#### 4. CrashReportsScreen (`src/screens/CrashReportsScreen.tsx`)
- Admin dashboard for viewing and managing crashes
- Statistics overview and detailed crash reports
- Filtering, resolution tracking, and bulk operations
- Modal views for detailed crash analysis

## Usage

### Basic Integration (Already Implemented)

The crash detection system is automatically active throughout the app:

1. **App-Level Protection**: The main `App.tsx` is wrapped with `ErrorBoundary`
2. **Screen-Level Protection**: All screens in `AppNavigator` have individual error boundaries
3. **Automatic Tracking**: User context and screen names are tracked automatically
4. **Context Integration**: `CrashReportingProvider` is integrated at the app level

### Screen Tracking

Screens automatically track their names using the `useScreenTracking` hook:

```typescript
import { useScreenTracking } from '../context/CrashReportingContext';

const MyScreen = () => {
  useScreenTracking('MyScreen');
  // Component logic...
};
```

### Safe Async Operations

Use the `useSafeAsyncOperation` hook for automatic error reporting:

```typescript
import { useSafeAsyncOperation } from '../context/CrashReportingContext';

const MyComponent = () => {
  const safeAsyncOperation = useSafeAsyncOperation();

  const handleApiCall = async () => {
    const result = await safeAsyncOperation(
      () => apiService.getData(),
      { context: 'user_data_fetch' }
    );
    
    if (result) {
      // Handle success
    }
    // Errors are automatically reported
  };
};
```

### Manual Error Reporting

Report errors manually when needed:

```typescript
import { useCrashReporting } from '../context/CrashReportingContext';

const MyComponent = () => {
  const { reportError } = useCrashReporting();

  const handleError = (error: Error) => {
    reportError(error, { 
      customContext: 'user_action',
      additionalData: 'relevant_info' 
    });
  };
};
```

## Admin Dashboard

### Accessing Crash Reports

1. Log in as an admin user
2. Navigate to Admin Dashboard
3. Select the "Crash Reports" tab
4. View crash statistics and reports

### Managing Crashes

- **View Details**: Tap any crash report for full details
- **Mark Resolved**: Mark crashes as resolved after fixing
- **Filter Views**: Toggle between "All" and "Unresolved" crashes
- **Bulk Operations**: Clear resolved crashes or all crashes

### Statistics Available

- Total crashes across the app
- Resolved vs unresolved crashes
- Crashes by user role (admin/member)
- Crashes by screen/component
- Recent crash reports

## Data Structure

### CrashReport Interface
```typescript
interface CrashReport {
  id: string;
  timestamp: string;
  type: 'js_error' | 'native_crash' | 'unhandled_promise';
  error: string;
  stackTrace?: string;
  userRole?: 'admin' | 'member';
  userId?: string;
  screen?: string;
  appVersion: string;
  platform: string;
  resolved: boolean;
  metadata?: Record<string, any>;
}
```

## Testing the System

### 1. Test JavaScript Errors

Add a test button to throw an error:

```typescript
const TestButton = () => (
  <Button 
    title="Test JS Error" 
    onPress={() => {
      throw new Error('Test JavaScript error');
    }} 
  />
);
```

### 2. Test Promise Rejections

```typescript
const TestAsyncButton = () => (
  <Button 
    title="Test Async Error" 
    onPress={async () => {
      await Promise.reject(new Error('Test async error'));
    }} 
  />
);
```

### 3. Test Component Errors

Create a component that throws during render:

```typescript
const CrashyComponent = ({ shouldCrash }: { shouldCrash: boolean }) => {
  if (shouldCrash) {
    throw new Error('Component render error');
  }
  return <Text>Normal component</Text>;
};
```

## Storage and Privacy

- **Local Storage**: Crash reports are stored locally using AsyncStorage
- **Data Retention**: Only the last 100 crash reports are kept in memory
- **No External Services**: By default, crashes are not sent to external services
- **Privacy-First**: Only necessary debugging information is collected

## Extending the System

### Adding Remote Crash Reporting

To send crashes to a remote service, modify the `saveCrashReport` method in `CrashDetectionService`:

```typescript
private async saveCrashReport(crashReport: CrashReport): Promise<void> {
  // ... existing local storage code ...
  
  // Add remote reporting
  try {
    await remoteCrashService.sendReport(crashReport);
  } catch (error) {
    console.warn('Failed to send crash report to remote service:', error);
  }
}
```

### Custom Error Boundaries

Create specialized error boundaries for specific components:

```typescript
const SpecializedErrorBoundary: React.FC<{children: ReactNode}> = ({ children }) => (
  <ErrorBoundary
    fallbackComponent={CustomFallbackComponent}
    onError={(error, errorInfo) => {
      // Custom error handling logic
      console.log('Specialized boundary caught error:', error);
    }}
  >
    {children}
  </ErrorBoundary>
);
```

## Best Practices

1. **Error Boundaries**: Place error boundaries at strategic component levels
2. **Screen Tracking**: Always use `useScreenTracking` in screen components
3. **Safe Operations**: Use `useSafeAsyncOperation` for API calls and async operations
4. **Context Preservation**: Include relevant context when manually reporting errors
5. **Resolution Tracking**: Regularly review and resolve crashes in the admin dashboard
6. **Testing**: Regularly test crash scenarios during development

## Troubleshooting

### Common Issues

1. **Crashes Not Appearing**: Ensure `CrashReportingProvider` is properly wrapped around your app
2. **Missing Screen Context**: Verify `useScreenTracking` is called at the top of screen components
3. **Storage Issues**: Check AsyncStorage permissions and available storage space

### Debug Mode

In development, additional debug information is shown:
- Console logs for all captured errors
- Debug information in error boundary fallback UI
- Detailed error context in crash reports

## Future Enhancements

- **Performance Monitoring**: Track app performance metrics alongside crashes
- **User Feedback**: Allow users to provide feedback when crashes occur
- **Crash Trends**: Analyze crash patterns over time
- **Automated Alerts**: Notify developers when crash rates exceed thresholds
- **Integration**: Connect with external monitoring services (Sentry, Bugsnag, etc.)

---

For questions or issues with the crash detection system, refer to the implementation files or contact the development team.