import AsyncStorage from '@react-native-async-storage/async-storage';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';

export interface CrashReport {
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

export interface CrashStats {
  totalCrashes: number;
  resolvedCrashes: number;
  adminCrashes: number;
  memberCrashes: number;
  crashesByScreen: Record<string, number>;
  recentCrashes: CrashReport[];
}

class CrashDetectionService {
  private static instance: CrashDetectionService;
  private currentUser: { id: string; role: 'admin' | 'member' } | null = null;
  private currentScreen: string | null = null;
  private crashReports: CrashReport[] = [];
  private isInitialized = false;
  private errorCount = 0;
  private lastErrorTime = 0;
  private readonly ERROR_THRESHOLD = 5;
  private readonly ERROR_WINDOW_MS = 1000; // 1 second
  private isHandlingError = false;

  public static getInstance(): CrashDetectionService {
    if (!CrashDetectionService.instance) {
      CrashDetectionService.instance = new CrashDetectionService();
    }
    return CrashDetectionService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load existing crash reports from storage
      await this.loadCrashReports();

      // Set up JS exception handler
      setJSExceptionHandler((error, isFatal) => {
        this.handleJSError(error, isFatal);
      }, true);

      // Set up native exception handler
      setNativeExceptionHandler((errorString) => {
        this.handleNativeError(errorString);
      });

      // Set up unhandled promise rejection handler
      this.setupUnhandledPromiseHandler();

      this.isInitialized = true;
      console.log('CrashDetectionService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize CrashDetectionService:', error);
    }
  }

  public setCurrentUser(user: { id: string; role: 'admin' | 'member' } | null): void {
    this.currentUser = user;
  }

  public setCurrentScreen(screenName: string): void {
    // Prevent unnecessary updates and potential loops
    if (this.currentScreen !== screenName && screenName && typeof screenName === 'string') {
      this.currentScreen = screenName;
    }
  }

  private async handleJSError(error: Error, isFatal: boolean): Promise<void> {
    // Prevent reentrancy
    if (this.isHandlingError) {
      console.warn('Already handling an error, skipping to prevent infinite loop');
      return;
    }

    this.isHandlingError = true;

    try {
      // Circuit breaker pattern - prevent too many errors in a short time
      const now = Date.now();
      if (now - this.lastErrorTime < this.ERROR_WINDOW_MS) {
        this.errorCount++;
        if (this.errorCount > this.ERROR_THRESHOLD) {
          console.warn('Circuit breaker activated - too many errors in short time, skipping error handling');
          return;
        }
      } else {
        this.errorCount = 1;
      }
      this.lastErrorTime = now;

      // Prevent infinite loops by checking if we're already handling a crash report error
      if (this.currentScreen === 'CrashReports' && !error?.message) {
        console.warn('Skipping undefined error in CrashReports to prevent infinite loop');
        return;
      }

      // Ensure we have a valid error object
      if (!error || (!error.message && !error.stack)) {
        console.warn('Skipping invalid error object:', error);
        return;
      }

    const crashReport: CrashReport = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      type: 'js_error',
      error: error.message || error.toString() || 'Unknown JavaScript error',
      stackTrace: error.stack,
      userRole: this.currentUser?.role,
      userId: this.currentUser?.id,
      screen: this.currentScreen || 'Unknown',
      appVersion: '1.0.0', // This should come from your app config
      platform: 'mobile',
      resolved: false,
      metadata: {
        isFatal,
        errorName: error.name || 'Error',
      },
    };

           try {
         await this.saveCrashReport(crashReport);
         
         // Log to console for development
         console.error('JS Error captured:', {
           error: error.message || error.toString(),
           screen: this.currentScreen,
           user: this.currentUser?.role,
           isFatal,
         });
       } catch (saveError) {
         // Don't let saving errors create more errors
         console.warn('Failed to save crash report, but not reporting this error to prevent loops:', saveError);
       }
     } finally {
       this.isHandlingError = false;
     }
  }

  private async handleNativeError(errorString: string): Promise<void> {
    const crashReport: CrashReport = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      type: 'native_crash',
      error: errorString,
      userRole: this.currentUser?.role,
      userId: this.currentUser?.id,
      screen: this.currentScreen || 'Unknown',
      appVersion: '1.0.0',
      platform: 'mobile',
      resolved: false,
      metadata: {
        nativeCrash: true,
      },
    };

    await this.saveCrashReport(crashReport);
    
    console.error('Native crash captured:', {
      error: errorString,
      screen: this.currentScreen,
      user: this.currentUser?.role,
    });
  }

  private setupUnhandledPromiseHandler(): void {
    const originalHandler = global.onunhandledrejection;
    
    global.onunhandledrejection = (event) => {
      this.handleUnhandledPromise(event.reason);
      
      // Call original handler if it exists
      if (originalHandler) {
        originalHandler(event);
      }
    };
  }

  private async handleUnhandledPromise(reason: any): Promise<void> {
    const errorMessage = reason instanceof Error ? reason.message : String(reason);
    const stackTrace = reason instanceof Error ? reason.stack : undefined;

    const crashReport: CrashReport = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      type: 'unhandled_promise',
      error: errorMessage,
      stackTrace,
      userRole: this.currentUser?.role,
      userId: this.currentUser?.id,
      screen: this.currentScreen || 'Unknown',
      appVersion: '1.0.0',
      platform: 'mobile',
      resolved: false,
      metadata: {
        unhandledPromise: true,
      },
    };

    await this.saveCrashReport(crashReport);
    
    console.error('Unhandled promise rejection captured:', {
      error: errorMessage,
      screen: this.currentScreen,
      user: this.currentUser?.role,
    });
  }

  public async reportError(error: Error, context?: Record<string, any>): Promise<void> {
    const crashReport: CrashReport = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      type: 'js_error',
      error: error.message || 'Manual error report',
      stackTrace: error.stack,
      userRole: this.currentUser?.role,
      userId: this.currentUser?.id,
      screen: this.currentScreen || 'Unknown',
      appVersion: '1.0.0',
      platform: 'mobile',
      resolved: false,
      metadata: {
        manual: true,
        context,
      },
    };

    await this.saveCrashReport(crashReport);
  }

  private async saveCrashReport(crashReport: CrashReport): Promise<void> {
    try {
      this.crashReports.push(crashReport);
      
      // Keep only the last 100 crash reports in memory
      if (this.crashReports.length > 100) {
        this.crashReports = this.crashReports.slice(-100);
      }

      // Save to AsyncStorage with timeout to prevent hanging
      const savePromise = AsyncStorage.setItem(
        'crashReports',
        JSON.stringify(this.crashReports)
      );
      
      // Timeout after 5 seconds to prevent blocking
      await Promise.race([
        savePromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AsyncStorage timeout')), 5000)
        )
      ]);

      // You could also send to a remote crash reporting service here
      // await this.sendToRemoteService(crashReport);
    } catch (error) {
      // Don't throw here to prevent infinite loops
      console.warn('Failed to save crash report:', error);
    }
  }

  private async loadCrashReports(): Promise<void> {
    try {
      // Add timeout to prevent hanging on load
      const loadPromise = AsyncStorage.getItem('crashReports');
      const stored = await Promise.race([
        loadPromise,
        new Promise<string | null>((_, reject) => 
          setTimeout(() => reject(new Error('AsyncStorage load timeout')), 5000)
        )
      ]);
      
      if (stored) {
        this.crashReports = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load crash reports, starting with empty array:', error);
      this.crashReports = [];
    }
  }

  public async getCrashReports(): Promise<CrashReport[]> {
    return [...this.crashReports].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public async getCrashStats(): Promise<CrashStats> {
    const reports = await this.getCrashReports();
    
    const stats: CrashStats = {
      totalCrashes: reports.length,
      resolvedCrashes: reports.filter(r => r.resolved).length,
      adminCrashes: reports.filter(r => r.userRole === 'admin').length,
      memberCrashes: reports.filter(r => r.userRole === 'member').length,
      crashesByScreen: {},
      recentCrashes: reports.slice(0, 10),
    };

    // Count crashes by screen
    reports.forEach(report => {
      const screen = report.screen || 'Unknown';
      stats.crashesByScreen[screen] = (stats.crashesByScreen[screen] || 0) + 1;
    });

    return stats;
  }

  public async markCrashResolved(crashId: string): Promise<void> {
    const index = this.crashReports.findIndex(r => r.id === crashId);
    if (index !== -1) {
      this.crashReports[index].resolved = true;
      await AsyncStorage.setItem(
        'crashReports',
        JSON.stringify(this.crashReports)
      );
    }
  }

  public async clearResolvedCrashes(): Promise<void> {
    this.crashReports = this.crashReports.filter(r => !r.resolved);
    await AsyncStorage.setItem(
      'crashReports',
      JSON.stringify(this.crashReports)
    );
  }

  public async clearAllCrashes(): Promise<void> {
    this.crashReports = [];
    await AsyncStorage.removeItem('crashReports');
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}

export default CrashDetectionService.getInstance();