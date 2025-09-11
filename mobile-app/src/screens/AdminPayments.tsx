import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import paymentService from '../services/paymentService';
import { MemberMonthlyPayment } from '../types';
import { Button, Input, Card, Icon, LoadingSpinner, EmptyState } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

const AdminPayments = () => {
  const [payments, setPayments] = useState<MemberMonthlyPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month in YYYY-MM format

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await paymentService.getMyMonthlyPayments(month);
      setPayments(response);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An unknown error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleUpdateStatus = async (
    userId: string,
    currentStatus: 'Paid' | 'Unpaid'
  ) => {
    try {
      const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
      await paymentService.updatePaymentStatus(userId, month, newStatus);
      // Refresh the list to show the updated status
      fetchPayments();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while updating status.'
      );
    }
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'Paid' ? COLORS.success : COLORS.error;
  };

  const getStatusIcon = (status: string) => {
    return status === 'Paid' ? 'check-circle' : 'clock';
  };

  const renderPaymentItem = ({ item }: { item: MemberMonthlyPayment }) => (
    <Card variant="elevated" style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.memberInfo}>
          <View style={styles.memberHeader}>
            <View style={styles.avatarContainer}>
              <Icon name="user" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.memberDetails}>
              <Text style={styles.memberName}>{item.userName}</Text>
              <Text style={styles.memberId}>ID: {item.userId}</Text>
            </View>
          </View>
          
          <View style={styles.amountContainer}>
            <View style={styles.amountIconContainer}>
              <Icon name="money" size={18} color={COLORS.textSecondary} />
            </View>
            <View style={styles.amountContent}>
              <Text style={styles.amountLabel}>Amount Owed</Text>
              <Text style={styles.amountValue}>
                ₹{typeof item.totalAmount === 'number' ? item.totalAmount.toFixed(2) : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <Icon name={getStatusIcon(item.status)} size={16} color={getStatusColor(item.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
          
          <Button
            title={`Mark as ${item.status === 'Paid' ? 'Unpaid' : 'Paid'}`}
            onPress={() => handleUpdateStatus(item.userId, item.status)}
            variant={item.status === 'Paid' ? 'outline' : 'primary'}
            size="small"
            style={styles.statusButton}
          />
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Payment Management</Text>
          <Text style={styles.subtitle}>
            Manage member payment statuses and track monthly payments
          </Text>
        </View>

        <Card variant="elevated" style={styles.monthSelectorCard}>
          <Text style={styles.sectionTitle}>Select Month</Text>
          <View style={styles.monthSelector}>
            <Input
              label="Month (YYYY-MM)"
              placeholder="2024-01"
              value={month}
              onChangeText={setMonth}
              style={styles.monthInput}
            />
            <Button
              title="Fetch Payments"
              onPress={fetchPayments}
              variant="primary"
              style={styles.fetchButton}
            />
          </View>
          <Text style={styles.monthDisplay}>
            Currently viewing: <Text style={styles.monthHighlight}>{formatMonth(month)}</Text>
          </Text>
        </Card>

        {isLoading ? (
          <LoadingSpinner text="Loading payments..." />
        ) : payments.length === 0 ? (
          <EmptyState
            icon="credit-card"
            title="No Payments Found"
            subtitle={`No payment records found for ${formatMonth(month)}. Members will appear here once they participate in events.`}
            variant="default"
          />
        ) : (
          <View style={styles.paymentsContainer}>
            <View style={styles.paymentsHeader}>
              <Text style={styles.sectionTitle}>Payment Records</Text>
              <Text style={styles.paymentCount}>{payments.length} members</Text>
            </View>
            
            <FlatList
              data={payments}
              renderItem={renderPaymentItem}
              keyExtractor={(item) => item.userId + item.month}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.paymentsList}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lg * 1.4,
  },
  monthSelectorCard: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    marginBottom: SPACING.md,
    position: 'relative',
    zIndex: 1,
  },
  monthInput: {
    flex: 1,
    minWidth: 250,
    maxWidth: '70%',
    overflow: 'hidden',
    zIndex: 1,
    paddingRight: 0,
  },
  fetchButton: {
    minWidth: 120,
    flexShrink: 0,
  },
  monthDisplay: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  monthHighlight: {
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.primary,
  },
  paymentsContainer: {
    marginBottom: SPACING.lg,
  },
  paymentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  paymentCount: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  paymentsList: {
    gap: SPACING.md,
  },
  paymentCard: {
    marginBottom: SPACING.sm,
  },
  paymentHeader: {
    gap: SPACING.md,
  },
  memberInfo: {
    gap: SPACING.md,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  memberId: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  amountIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountContent: {
    flex: 1,
  },
  amountLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.medium as any,
    marginBottom: SPACING.xs,
  },
  amountValue: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.bold as any,
    color: COLORS.textPrimary,
  },
  statusSection: {
    alignItems: 'flex-end',
    gap: SPACING.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 80,
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  statusText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium as any,
  },
  statusButton: {
    minWidth: 140,
  },
});

export default AdminPayments;
