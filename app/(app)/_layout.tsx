import { Stack } from 'expo-router';
import { View, Pressable } from 'react-native';
import { usePasswordStore } from '@/store/usePasswordStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  const logout = usePasswordStore((s) => s.logout);
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'My Passwords',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, gap: 16 }}>
              <Pressable onPress={() => router.push('/(app)/settings')}>
                <Ionicons name="settings-outline" size={24} color="#007AFF" />
              </Pressable>
              <Pressable onPress={logout}>
                <Ionicons name="lock-closed-outline" size={24} color="#007AFF" />
              </Pressable>
            </View>
          )
        }} 
      />
      <Stack.Screen 
        name="password/add" 
        options={{ 
          title: 'Add Password',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="password/[id]" 
        options={{ 
          title: 'Details',
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
        }} 
      />
    </Stack>
  );
}
