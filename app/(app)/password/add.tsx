import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { usePasswordStore } from '@/store/usePasswordStore';
import { useRouter } from 'expo-router';

export default function AddPasswordScreen() {
  const router = useRouter();
  const addPassword = usePasswordStore((s) => s.addPassword);

  const [title, setTitle] = useState('');
  const [appName, setAppName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const handleSave = async () => {
    if (!title || !password) {
      Alert.alert('Error', 'Title and password are required.');
      return;
    }
    
    try {
      await addPassword({
        title, appName, username, email, password, category, note
      });
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save password.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Title *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. My Google Account" />

        <Text style={styles.label}>App/Website Name</Text>
        <TextInput style={styles.input} value={appName} onChangeText={setAppName} placeholder="e.g. Google" />

        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Password *</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

        <Text style={styles.label}>Category</Text>
        <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="e.g. Work, Personal, Social" />

        <Text style={styles.label}>Notes</Text>
        <TextInput style={[styles.input, styles.textArea]} value={note} onChangeText={setNote} multiline numberOfLines={4} />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Entry</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 4, marginTop: 12 },
  input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#eee' },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
