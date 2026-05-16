import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { usePasswordStore } from '@/store/usePasswordStore';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const setMasterPassword = usePasswordStore((s) => s.setMasterPassword);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangeMasterPassword = async () => {
    if (newPassword.length < 4) {
      Alert.alert('Error', 'Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      await setMasterPassword(newPassword);
      Alert.alert('Success', 'Master password updated successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to update master password.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Change Master Password</Text>
        <Text style={styles.subtitle}>Enter your new master password below.</Text>
        
        <TextInput
          style={styles.input}
          placeholder="New Master Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirm New Master Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleChangeMasterPassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  input: { backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#eee' },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
