import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePasswordStore } from '@/store/usePasswordStore';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { initApp, isMasterPasswordSet, isAuthenticated, isLoading } = usePasswordStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initApp();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isMasterPasswordSet) {
      // Need to create master password
      if (segments[1] !== 'create-master') {
        router.replace('/(auth)/create-master');
      }
    } else if (!isAuthenticated) {
      // Need to login
      if (segments[1] !== 'login') {
        router.replace('/(auth)/login');
      }
    } else if (isAuthenticated && inAuthGroup) {
      // Logged in, redirect to app
      router.replace('/(app)');
    }
  }, [isLoading, isMasterPasswordSet, isAuthenticated, segments]);

  if (isLoading) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
