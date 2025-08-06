/**
 * Utilities for testing crash detection system
 * Use these functions to safely test crash reporting without causing infinite loops
 */

import crashDetectionService from '../services/crashDetectionService';

export const testCrashDetection = {
  /**
   * Test a JavaScript error with controlled parameters
   */
  testJSError: () => {
    try {
      throw new Error('Test JavaScript Error - This is intentional for testing');
    } catch (error) {
      // This will be caught by the global error handler
      console.log('Test error thrown:', error);
    }
  },

  /**
   * Test an async error
   */
  testAsyncError: async () => {
    try {
      await Promise.reject(new Error('Test Async Error - This is intentional for testing'));
    } catch (error) {
      // This will be caught by the unhandled promise handler
      console.log('Test async error thrown:', error);
    }
  },

  /**
   * Test manual error reporting
   */
  testManualReport: async () => {
    await crashDetectionService.reportError(
      new Error('Manual Test Error - This is intentional for testing'),
      {
        testType: 'manual',
        timestamp: new Date().toISOString(),
        context: 'crash_test_utils',
      }
    );
  },

  /**
   * Test component error (use this in a React component)
   */
  testComponentError: () => {
    // This should be called from within a React component to test error boundaries
    throw new Error('Test Component Error - This is intentional for testing');
  },

  /**
   * Get current crash statistics for testing
   */
  getCrashStats: async () => {
    return await crashDetectionService.getCrashStats();
  },

  /**
   * Clear all crash reports for testing
   */
  clearAllCrashes: async () => {
    await crashDetectionService.clearAllCrashes();
  },
};

export default testCrashDetection;