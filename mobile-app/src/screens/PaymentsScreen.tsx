import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import paymentService from '../services/paymentService';
import { MemberMonthlyPayment } from '../types';

const PaymentsScreen = () => {
  const [payments, setPayments] = useState<MemberMonthlyPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const today = new Date();
        const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        const fetchedPayments = await paymentService.getMyMonthlyPayments(month);
        setPayments(fetchedPayments);
        setError(null);
      } catch (e: any) {
        if (e.message.includes('403')) {
          setError('You are not authorized to view these payments.');
        } else {
          setError('Failed to fetch your monthly payments.');
        }
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator testID="activity-indicator" size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {payments.length === 0 ? (
        <Text style={styles.noDataText}>No payment history found.</Text>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.userId + item.month}
          renderItem={({ item }) => (
            <View style={[styles.card, item.status === 'Paid' ? styles.paidCard : styles.unpaidCard]}>
              <Text style={styles.monthText}>Month: {item.month}</Text>
              <Text>Total Owed: ₹{item.totalAmount.toFixed(2)}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  paidCard: {
    backgroundColor: '#d4edda',
  },
  unpaidCard: {
    backgroundColor: '#f8d7da',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default PaymentsScreen;
