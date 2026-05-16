import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create-master" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
