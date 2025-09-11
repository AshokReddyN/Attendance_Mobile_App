import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ScrollView } from 'react-native';
import paymentService from '../services/paymentService';
import { UserMonthlyPayment } from '../types';
import { Card, Icon, LoadingSpinner, EmptyState } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

const PaymentsScreen = () => {
  const [payments, setPayments] = useState<UserMonthlyPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const fetchedPayments = await paymentService.getMyPayments();
        setPayments(fetchedPayments);
        setError(null);
      } catch (e) {
        setError('Failed to fetch your payments.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

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

  const renderPaymentItem = ({ item }: { item: UserMonthlyPayment }) => (
    <Card variant="elevated" style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.monthContainer}>
          <Icon name="calendar" size={20} color={COLORS.primary} />
          <Text style={styles.monthText}>{formatMonth(item.month)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.paymentStatus) + '15' }]}>
          <Icon name={getStatusIcon(item.paymentStatus)} size={16} color={getStatusColor(item.paymentStatus)} />
          <Text style={[styles.statusText, { color: getStatusColor(item.paymentStatus) }]}>
            {item.paymentStatus}
          </Text>
        </View>
      </View>

      <View style={styles.paymentDetails}>
        <View style={styles.amountRow}>
          <View style={styles.amountIconContainer}>
            <Icon name="money" size={18} color={COLORS.textSecondary} />
          </View>
          <View style={styles.amountContent}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>₹{item.totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.paymentInfo}>
          <Text style={styles.paymentNote}>
            {item.paymentStatus === 'Paid' 
              ? 'Payment completed successfully for this month'
              : 'Payment pending for this month'
            }
          </Text>
        </View>
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner text="Loading your payment history..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="alert-circle"
          title="Unable to Load Payments"
          subtitle={error}
          variant="compact"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>My Payments</Text>
          <Text style={styles.subtitle}>
            Track your monthly payment status and amounts
          </Text>
        </View>

        {payments.length === 0 ? (
          <EmptyState
            icon="credit-card"
            title="No Payment History"
            subtitle="You haven't made any payments yet. Your payment history will appear here once you start participating in events."
            variant="default"
          />
        ) : (
          <View style={styles.paymentsContainer}>
            <View style={styles.paymentsHeader}>
              <Text style={styles.sectionTitle}>Payment Records</Text>
              <Text style={styles.paymentCount}>{payments.length} months</Text>
            </View>
            
            <FlatList
              data={payments}
              keyExtractor={(item) => item.month}
              renderItem={renderPaymentItem}
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
  paymentsContainer: {
    marginBottom: SPACING.lg,
  },
  paymentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  monthText: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold as any,
    color: COLORS.textPrimary,
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
  paymentDetails: {
    gap: SPACING.md,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
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
  paymentInfo: {
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  paymentNote: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});

export default PaymentsScreen;
