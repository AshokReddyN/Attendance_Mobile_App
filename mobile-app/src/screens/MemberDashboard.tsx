import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MemberDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Member!</Text>
      <Text>This is your dashboard.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default MemberDashboard;
