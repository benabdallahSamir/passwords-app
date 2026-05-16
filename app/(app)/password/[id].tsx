import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { usePasswordStore } from '@/store/usePasswordStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export default function PasswordDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const passwords = usePasswordStore((s) => s.passwords);
  const editPassword = usePasswordStore((s) => s.editPassword);
  const deletePassword = usePasswordStore((s) => s.deletePassword);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const entry = passwords.find(p => p.id === id);

  const [form, setForm] = useState({
    title: '', appName: '', username: '', email: '', password: '', category: '', note: ''
  });

  useEffect(() => {
    if (entry) {
      setForm(entry);
    } else {
      router.back();
    }
  }, [entry]);

  if (!entry) return null;

  const handleSave = async () => {
    try {
      await editPassword(entry.id, form);
      setIsEditing(false);
      Alert.alert('Success', 'Password updated');
    } catch (e) {
      Alert.alert('Error', 'Failed to update');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deletePassword(entry.id);
        router.back();
      }}
    ]);
  };

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Copied to clipboard!');
  };

  const renderField = (label: string, field: keyof typeof form, isSecure = false) => {
    const isCopyable = field === 'username' || field === 'email' || field === 'password';

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={form[field]}
            onChangeText={(v) => setForm({ ...form, [field]: v })}
            secureTextEntry={isSecure && !showPassword}
            multiline={field === 'note'}
          />
        ) : (
          <View style={styles.readOnlyContainer}>
            <Text style={styles.valueText}>
              {isSecure && !showPassword ? '••••••••••••' : (form[field] || '—')}
            </Text>
            <View style={styles.readOnlyActions}>
              {isSecure && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconBtn}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#007AFF" />
                </TouchableOpacity>
              )}
              {isCopyable && (
                <TouchableOpacity onPress={() => copyToClipboard(form[field])} style={styles.iconBtn}>
                  <Ionicons name="copy-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.actionBtn}>
            <Text style={styles.actionText}>{isEditing ? 'Cancel' : 'Edit'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={[styles.actionBtn, styles.deleteBtn]}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {renderField('Title', 'title')}
        {renderField('App/Website Name', 'appName')}
        {renderField('Username', 'username')}
        {renderField('Email', 'email')}
        {renderField('Password', 'password', true)}
        {renderField('Category', 'category')}
        {renderField('Notes', 'note')}

        {isEditing && (
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16, gap: 12 },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#f0f0f0' },
  actionText: { color: '#007AFF', fontWeight: 'bold' },
  deleteBtn: { backgroundColor: '#ffeeee' },
  deleteText: { color: '#ff3b30', fontWeight: 'bold' },
  fieldContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 6 },
  input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#eee' },
  readOnlyContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#f0f0f0' },
  valueText: { fontSize: 16, color: '#333', flex: 1 },
  readOnlyActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: 16 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
