import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import paymentService from '../services/paymentService';
import { MemberMonthlyPayment } from '../types';

const AdminPayments = () => {
  const [payments, setPayments] = useState<MemberMonthlyPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month in YYYY-MM format

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      // Corrected the function call to getMyMonthlyPayments and removed the argument
      const response = await paymentService.getMyMonthlyPayments(month);
      // The response is the array of payments, so no need for .payments
      setPayments(response);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An unknown error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []); // Removed month from dependency array as it's not used

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleUpdateStatus = async (
    memberId: string,
    currentStatus: 'paid' | 'unpaid'
  ) => {
    try {
      const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
      await paymentService.updatePaymentStatus(memberId, month, newStatus);
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

  const renderPaymentItem = ({ item }: { item: MemberMonthlyPayment }) => (
    <View style={styles.paymentItem}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.userName}</Text>
        <Text>Owed: {typeof item.totalAmount === 'number' ? `₹${item.totalAmount.toFixed(2)}` : 'N/A'}</Text>
        <Text>Status: {item.paymentStatus}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.statusButton,
          item.status === 'paid' ? styles.paidButton : styles.unpaidButton,
        ]}
        onPress={() => handleUpdateStatus(item.memberId, item.status)}
      >
        <Text style={styles.statusButtonText}>
          Mark as {item.status === 'paid' ? 'Unpaid' : 'Paid'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.monthSelector}>
        <TextInput
          style={styles.input}
          value={month}
          onChangeText={setMonth}
          placeholder="YYYY-MM"
        />
        <Button title="Fetch Payments" onPress={fetchPayments} />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <Text>Loading payments...</Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.memberId + item.month}
          contentContainerStyle={styles.listContainer}
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
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginRight: 8,
    borderRadius: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  paymentItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  paidButton: {
    backgroundColor: '#28a745',
  },
  unpaidButton: {
    backgroundColor: '#dc3545',
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminPayments;
