import React, { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import crashDetectionService, { CrashReport, CrashStats } from '../services/crashDetectionService';

interface CrashReportingContextType {
  reportError: (error: Error, context?: Record<string, any>) => Promise<void>;
  setCurrentScreen: (screenName: string) => void;
  getCrashReports: () => Promise<CrashReport[]>;
  getCrashStats: () => Promise<CrashStats>;
  markCrashResolved: (crashId: string) => Promise<void>;
  clearResolvedCrashes: () => Promise<void>;
  clearAllCrashes: () => Promise<void>;
}

const CrashReportingContext = createContext<CrashReportingContextType>({
  reportError: async () => {},
  setCurrentScreen: () => {},
  getCrashReports: async () => [],
  getCrashStats: async () => ({
    totalCrashes: 0,
    resolvedCrashes: 0,
    adminCrashes: 0,
    memberCrashes: 0,
    crashesByScreen: {},
    recentCrashes: [],
  }),
  markCrashResolved: async () => {},
  clearResolvedCrashes: async () => {},
  clearAllCrashes: async () => {},
});

export const useCrashReporting = () => {
  const context = useContext(CrashReportingContext);
  if (!context) {
    throw new Error('useCrashReporting must be used within a CrashReportingProvider');
  }
  return context;
};

interface CrashReportingProviderProps {
  children: ReactNode;
}

export const CrashReportingProvider: React.FC<CrashReportingProviderProps> = ({ children }) => {
  const { authData } = useAuth();

  // Initialize crash detection service
  useEffect(() => {
    const initializeCrashDetection = async () => {
      try {
        await crashDetectionService.initialize();
      } catch (error) {
        console.error('Failed to initialize crash detection:', error);
      }
    };

    initializeCrashDetection();
  }, []);

  // Update user context when auth data changes
  useEffect(() => {
    if (authData?.user) {
      crashDetectionService.setCurrentUser({
        id: authData.user.id,
        role: authData.user.role as 'admin' | 'member',
      });
    } else {
      crashDetectionService.setCurrentUser(null);
    }
  }, [authData]);

  const reportError = useCallback(async (error: Error, context?: Record<string, any>) => {
    try {
      await crashDetectionService.reportError(error, context);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }, []);

  const setCurrentScreen = useCallback((screenName: string) => {
    crashDetectionService.setCurrentScreen(screenName);
  }, []);

  const getCrashReports = useCallback(async () => {
    try {
      return await crashDetectionService.getCrashReports();
    } catch (error) {
      console.error('Failed to get crash reports:', error);
      return [];
    }
  }, []);

  const getCrashStats = useCallback(async () => {
    try {
      return await crashDetectionService.getCrashStats();
    } catch (error) {
      console.error('Failed to get crash stats:', error);
      return {
        totalCrashes: 0,
        resolvedCrashes: 0,
        adminCrashes: 0,
        memberCrashes: 0,
        crashesByScreen: {},
        recentCrashes: [],
      };
    }
  }, []);

  const markCrashResolved = useCallback(async (crashId: string) => {
    try {
      await crashDetectionService.markCrashResolved(crashId);
    } catch (error) {
      console.error('Failed to mark crash as resolved:', error);
    }
  }, []);

  const clearResolvedCrashes = useCallback(async () => {
    try {
      await crashDetectionService.clearResolvedCrashes();
    } catch (error) {
      console.error('Failed to clear resolved crashes:', error);
    }
  }, []);

  const clearAllCrashes = useCallback(async () => {
    try {
      await crashDetectionService.clearAllCrashes();
    } catch (error) {
      console.error('Failed to clear all crashes:', error);
    }
  }, []);

  const value: CrashReportingContextType = {
    reportError,
    setCurrentScreen,
    getCrashReports,
    getCrashStats,
    markCrashResolved,
    clearResolvedCrashes,
    clearAllCrashes,
  };

  return (
    <CrashReportingContext.Provider value={value}>
      {children}
    </CrashReportingContext.Provider>
  );
};

// Custom hook for screen tracking
export const useScreenTracking = (screenName: string) => {
  const { setCurrentScreen } = useCrashReporting();

  useEffect(() => {
    setCurrentScreen(screenName);
  }, [screenName, setCurrentScreen]);
};

// Custom hook for safe async operations with error reporting
export const useSafeAsyncOperation = () => {
  const { reportError } = useCrashReporting();

  return useCallback(
    async <T>(
      operation: () => Promise<T>,
      context?: Record<string, any>
    ): Promise<T | null> => {
      try {
        return await operation();
      } catch (error) {
        if (error instanceof Error) {
          await reportError(error, context);
        } else {
          await reportError(new Error(String(error)), context);
        }
        return null;
      }
    },
    [reportError]
  );
};