import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useCrashReporting, useScreenTracking } from '../context/CrashReportingContext';
import { CrashReport, CrashStats } from '../services/crashDetectionService';

const CrashReportsScreen = () => {
  useScreenTracking('CrashReports');
  
  const {
    getCrashReports,
    getCrashStats,
    markCrashResolved,
    clearResolvedCrashes,
    clearAllCrashes,
  } = useCrashReporting();

  const [crashReports, setCrashReports] = useState<CrashReport[]>([]);
  const [crashStats, setCrashStats] = useState<CrashStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCrash, setSelectedCrash] = useState<CrashReport | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'unresolved'>('unresolved');

  const loadCrashData = useCallback(async () => {
    setLoading(true);
    try {
      // Load data with timeout and error handling
      const reportsPromise = getCrashReports().catch((err) => {
        console.warn('Failed to load crash reports:', err);
        return [];
      });
      
      const statsPromise = getCrashStats().catch((err) => {
        console.warn('Failed to load crash stats:', err);
        return {
          totalCrashes: 0,
          resolvedCrashes: 0,
          adminCrashes: 0,
          memberCrashes: 0,
          crashesByScreen: {},
          recentCrashes: [],
        };
      });

      const [reports, stats] = await Promise.all([reportsPromise, statsPromise]);
      
      setCrashReports(Array.isArray(reports) ? reports : []);
      setCrashStats(stats || {
        totalCrashes: 0,
        resolvedCrashes: 0,
        adminCrashes: 0,
        memberCrashes: 0,
        crashesByScreen: {},
        recentCrashes: [],
      });
    } catch (error) {
      console.warn('Failed to load crash data:', error);
      // Set safe defaults
      setCrashReports([]);
      setCrashStats({
        totalCrashes: 0,
        resolvedCrashes: 0,
        adminCrashes: 0,
        memberCrashes: 0,
        crashesByScreen: {},
        recentCrashes: [],
      });
    } finally {
      setLoading(false);
    }
  }, [getCrashReports, getCrashStats]);

  useEffect(() => {
    loadCrashData();
  }, [loadCrashData]);

  const filteredReports = (crashReports || []).filter(report => {
    if (filterType === 'unresolved') {
      return !report.resolved;
    }
    return true;
  });

  const handleMarkResolved = async (crashId: string) => {
    try {
      await markCrashResolved(crashId);
      await loadCrashData(); // Refresh data
      setSelectedCrash(null);
    } catch (error) {
      console.error('Failed to mark crash as resolved:', error);
    }
  };

  const handleClearResolved = () => {
    Alert.alert(
      'Clear Resolved Crashes',
      'Are you sure you want to permanently delete all resolved crash reports?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearResolvedCrashes();
              await loadCrashData();
            } catch (error) {
              console.error('Failed to clear resolved crashes:', error);
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Crashes',
      'Are you sure you want to permanently delete ALL crash reports? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllCrashes();
              await loadCrashData();
            } catch (error) {
              console.error('Failed to clear all crashes:', error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTypeColor = (type: CrashReport['type']) => {
    switch (type) {
      case 'js_error':
        return '#e74c3c';
      case 'native_crash':
        return '#c0392b';
      case 'unhandled_promise':
        return '#f39c12';
      default:
        return '#7f8c8d';
    }
  };

  const renderStatsCard = () => {
    if (!crashStats) return null;

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Crash Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{crashStats?.totalCrashes || 0}</Text>
            <Text style={styles.statLabel}>Total Crashes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#27ae60' }]}>
              {crashStats?.resolvedCrashes || 0}
            </Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#e74c3c' }]}>
              {(crashStats?.totalCrashes || 0) - (crashStats?.resolvedCrashes || 0)}
            </Text>
            <Text style={styles.statLabel}>Unresolved</Text>
          </View>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{crashStats?.adminCrashes || 0}</Text>
            <Text style={styles.statLabel}>Admin View</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{crashStats?.memberCrashes || 0}</Text>
            <Text style={styles.statLabel}>Member View</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCrashItem = ({ item }: { item: CrashReport }) => (
    <TouchableOpacity
      style={[styles.crashItem, item.resolved && styles.resolvedCrash]}
      onPress={() => setSelectedCrash(item)}
    >
      <View style={styles.crashHeader}>
        <View style={styles.crashInfo}>
          <Text style={styles.crashError} numberOfLines={2}>
            {item.error}
          </Text>
          <Text style={styles.crashMeta}>
            {formatDate(item.timestamp)} • {item.screen} • {item.userRole || 'Unknown'}
          </Text>
        </View>
        <View style={[styles.typeTag, { backgroundColor: getTypeColor(item.type) }]}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>
      {item.resolved && (
        <View style={styles.resolvedTag}>
          <Text style={styles.resolvedText}>✓ Resolved</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderCrashDetail = () => {
    if (!selectedCrash) return null;

    return (
      <Modal
        visible={!!selectedCrash}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Crash Details</Text>
            <TouchableOpacity onPress={() => setSelectedCrash(null)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Error Message:</Text>
              <Text style={styles.detailValue}>{selectedCrash.error}</Text>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={[styles.detailValue, { color: getTypeColor(selectedCrash.type) }]}>
                {selectedCrash.type}
              </Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Timestamp:</Text>
              <Text style={styles.detailValue}>{formatDate(selectedCrash.timestamp)}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Screen:</Text>
              <Text style={styles.detailValue}>{selectedCrash.screen}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>User Role:</Text>
              <Text style={styles.detailValue}>{selectedCrash.userRole || 'Unknown'}</Text>
            </View>

            {selectedCrash.stackTrace && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Stack Trace:</Text>
                <ScrollView style={styles.stackTraceContainer}>
                  <Text style={styles.stackTrace}>{selectedCrash.stackTrace}</Text>
                </ScrollView>
              </View>
            )}

            {selectedCrash.metadata && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Additional Info:</Text>
                <Text style={styles.detailValue}>
                  {JSON.stringify(selectedCrash.metadata, null, 2)}
                </Text>
              </View>
            )}
          </ScrollView>
          
          {!selectedCrash.resolved && (
            <TouchableOpacity
              style={styles.resolveButton}
              onPress={() => handleMarkResolved(selectedCrash.id)}
            >
              <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {renderStatsCard()}
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'unresolved' && styles.activeFilter]}
          onPress={() => setFilterType('unresolved')}
        >
          <Text style={[styles.filterText, filterType === 'unresolved' && styles.activeFilterText]}>
            Unresolved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'all' && styles.activeFilter]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterText, filterType === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleClearResolved}>
          <Text style={styles.actionButtonText}>Clear Resolved</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.dangerButton]} 
          onPress={handleClearAll}
        >
          <Text style={styles.actionButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredReports}
        renderItem={renderCrashItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadCrashData} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filterType === 'unresolved' ? 'No unresolved crashes' : 'No crash reports'}
            </Text>
          </View>
        }
      />

      {renderCrashDetail()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    marginRight: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#3498db',
  },
  filterText: {
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },
  actionContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#95a5a6',
    marginRight: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  crashItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resolvedCrash: {
    opacity: 0.7,
  },
  crashHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  crashInfo: {
    flex: 1,
    marginRight: 12,
  },
  crashError: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  crashMeta: {
    fontSize: 12,
    color: '#666',
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resolvedTag: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  resolvedText: {
    color: '#27ae60',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
  },
  stackTraceContainer: {
    maxHeight: 200,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    padding: 12,
  },
  stackTrace: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
  resolveButton: {
    backgroundColor: '#27ae60',
    margin: 16,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  resolveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CrashReportsScreen;