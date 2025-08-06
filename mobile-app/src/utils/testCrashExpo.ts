/**
 * Test utility to verify crash detection works in Expo environment
 * Use this to confirm the system is working without native exception handler
 */

import crashDetectionService from '../services/crashDetectionService';

export const testExpoCompatibility = {
  /**
   * Test initialization and basic functionality
   */
  testInitialization: async () => {
    try {
      await crashDetectionService.initialize();
      console.log('✅ Crash detection service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize crash detection service:', error);
      return false;
    }
  },

  /**
   * Test manual error reporting
   */
  testManualReporting: async () => {
    try {
      await crashDetectionService.reportError(
        new Error('Test error for Expo compatibility'),
        { 
          test: true, 
          environment: 'expo',
          timestamp: new Date().toISOString()
        }
      );
      console.log('✅ Manual error reporting works');
      return true;
    } catch (error) {
      console.error('❌ Manual error reporting failed:', error);
      return false;
    }
  },

  /**
   * Test screen tracking
   */
  testScreenTracking: () => {
    try {
      crashDetectionService.setCurrentScreen('TestScreen');
      console.log('✅ Screen tracking works');
      return true;
    } catch (error) {
      console.error('❌ Screen tracking failed:', error);
      return false;
    }
  },

  /**
   * Test crash stats retrieval
   */
  testStatsRetrieval: async () => {
    try {
      const stats = await crashDetectionService.getCrashStats();
      console.log('✅ Crash stats retrieval works:', stats);
      return true;
    } catch (error) {
      console.error('❌ Crash stats retrieval failed:', error);
      return false;
    }
  },

  /**
   * Run all compatibility tests
   */
  runAllTests: async () => {
    console.log('🧪 Running Expo compatibility tests...');
    
    const results = {
      initialization: await testExpoCompatibility.testInitialization(),
      manualReporting: await testExpoCompatibility.testManualReporting(),
      screenTracking: testExpoCompatibility.testScreenTracking(),
      statsRetrieval: await testExpoCompatibility.testStatsRetrieval(),
    };

    const allPassed = Object.values(results).every(result => result === true);
    
    console.log('📊 Test Results:', results);
    console.log(allPassed ? '✅ All tests passed!' : '❌ Some tests failed');
    
    return { results, allPassed };
  },
};

export default testExpoCompatibility;