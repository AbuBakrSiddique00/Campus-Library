import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user } = useAuth();

  // If we don't have a user, redirect to login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Otherwise direct to appropriate role-based dashboard
  if (user.role === 'reader') {
    return <Redirect href="/(student)" />;
  }
  
  if (user.role === 'librarian') {
    return <Redirect href="/(librarian)" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
