import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import authService from '../services/authService';
import tokenService from '../services/tokenService';

type RegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Registration'>;

const RegistrationScreen = () => {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'member' | 'admin'>('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    const userData = { name, email, phone, password, role };
    try {
      const authResponse = await authService.register(userData);
      await tokenService.saveToken(authResponse.token);
      navigation.replace(role === 'admin' ? 'AdminDashboard' : 'MemberDashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={styles.roleLabel}>Select your role:</Text>
      <View style={styles.roleSelector}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'member' && styles.roleButtonSelected]}
          onPress={() => setRole('member')}
        >
          <Text style={[styles.roleButtonText, role === 'member' && styles.roleButtonTextSelected]}>Member</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'admin' && styles.roleButtonSelected]}
          onPress={() => setRole('admin')}
        >
          <Text style={[styles.roleButtonText, role === 'admin' && styles.roleButtonTextSelected]}>Admin</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button title="Register" onPress={handleRegister} disabled={loading} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  roleButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
  },
  roleButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  roleButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  roleButtonTextSelected: {
    color: '#fff',
  },
});

export default RegistrationScreen;
